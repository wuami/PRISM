# python getInsightVAD.py emotionsOntology.owl Ratings.csv 1.0
import sys
from sklearn.feature_extraction.text import CountVectorizer
import hashlib
import MySQLdb as mdb
import nltk.stem
from xml.dom import minidom

class StemmedCountVectorizer(CountVectorizer):
	def build_analyzer(self):
		analyzer = super(StemmedCountVectorizer, self).build_analyzer()
		return lambda doc: (english_stemmer.stem(w) for w in analyzer(doc))

english_stemmer = nltk.stem.SnowballStemmer('english')
vectorizer = CountVectorizer(min_df=1, stop_words='english')
stemmedVectorizer = StemmedCountVectorizer(min_df=1, stop_words='english')
analyze = vectorizer.build_analyzer()
stemmedAnalyze = stemmedVectorizer.build_analyzer()

wordMappings = {}
stemmedWordMappings = {} #stemmed version of the words to match with actual insights
keyEmotions = [] #only store the stemmed versions of the emotions


def extractKeyEmotions(ontology):
	#Emotions Ontology goes here - just extract all the classes, build a terminology of stemmed emotions
	doc = minidom.parse(ontology)
	classes = doc.getElementsByTagName("owl:Class")
	for emotion in classes:
		label = emotion.getElementsByTagName("rdfs:label")
		if len(label) > 0: #because some classes do not have label defined
			stemmedLabels = stemmedAnalyze(label[0].firstChild.data)
			for k in stemmedLabels:
				if k not in keyEmotions:
					keyEmotions.append(k)
	print keyEmotions


def parseWordEmotions(scorefile):
	# extract the word-emotions ratings and create two lists, one with the actual words and another with the stemmed words
	wordEmotionFile = open(scorefile) #word - emotions rating from the paper
	wordEmotionLines = wordEmotionFile.readlines()
	wordEmotionFile.close()

	for k in range(len(wordEmotionLines)):
		if k == 0: # ignore heading
			continue
		wordParams = wordEmotionLines[k].strip().split(",")
		#print wordParams[1]
		stemmedWord = ":-:".join(stemmedAnalyze(wordParams[1]))
		realWord = ":-:".join(analyze(wordParams[1]))
		#print stemmedWord
		wordMappings[realWord] = {"valence": float(wordParams[2]), "arousal": float(wordParams[5]), "dominance": float(wordParams[8])}

		if stemmedWordMappings.get(stemmedWord):
			stemmedWordMappings[stemmedWord]["valence"] = (float(wordParams[2]) + len(stemmedWordMappings[stemmedWord]["list"])*stemmedWordMappings[stemmedWord]["valence"])/(len(stemmedWordMappings[stemmedWord]["list"])+1)
			stemmedWordMappings[stemmedWord]["arousal"] = (float(wordParams[5]) + len(stemmedWordMappings[stemmedWord]["list"])*stemmedWordMappings[stemmedWord]["arousal"])/(len(stemmedWordMappings[stemmedWord]["list"])+1)
			stemmedWordMappings[stemmedWord]["dominance"] = (float(wordParams[8]) + len(stemmedWordMappings[stemmedWord]["list"])*stemmedWordMappings[stemmedWord]["dominance"])/(len(stemmedWordMappings[stemmedWord]["list"])+1)
			stemmedWordMappings[stemmedWord]["list"].append(wordParams[1])
		else:
			stemmedWordMappings[stemmedWord] = {"valence": float(wordParams[2]), "arousal": float(wordParams[5]), "dominance": float(wordParams[8]), "list": [wordParams[1]]}

def main():
	extractKeyEmotions(sys.argv[1])
	parseWordEmotions(sys.argv[2])
    con = mdb.connect(host=HOST, user=USER, passwd=PASSWORD, db=DATABASE)
	cur = con.cursor()

	insights = {}
	query = "SELECT `id`, `insight` FROM `user_insights`"
	cur.execute(query)
	retrievedEntries = cur.fetchall()

	for row in retrievedEntries:
		descriptors = analyze(row[1])
		stemmedDescriptors = stemmedAnalyze(row[1])

		regTokens = ""
		val_scores = ""
		aro_scores = ""
		dom_scores = ""

		sum_val_score = 0
		sum_aro_score = 0
		sum_dom_score = 0

		emotionTokens = ""

		for k in stemmedDescriptors:
			if stemmedWordMappings.get(k):
				scores = stemmedWordMappings[k]
				
				actualDescriptor = ""
				for j in scores["list"]:
					if j in descriptors:	
						actualDescriptor = j
						break
				
				if len(actualDescriptor) > 0:
					scores = wordMappings[actualDescriptor]
					regTokens = regTokens + actualDescriptor + ":-:"
					weight = 1.0
				else:
					regTokens = regTokens + k + ":-:"
					weight = 0.8

				if k in keyEmotions:
					emotionTokens = emotionTokens + k + ":-:"
					weight = float(sys.argv[3])

				val_scores = val_scores + str(round(scores["valence"],2)) + ":-:" 
				aro_scores = aro_scores + str(round(scores["arousal"],2)) + ":-:"
				dom_scores = dom_scores + str(round(scores["dominance"],2)) + ":-:"

					# You can use a weighted summation here using an ontology
				sum_val_score = sum_val_score + weight*round(scores["valence"],2)
				sum_aro_score = sum_aro_score + weight*round(scores["arousal"],2)
				sum_dom_score = sum_dom_score + weight*round(scores["dominance"],2)


		#print regTokens
		count = len(regTokens.split(":-:"))-1
		#print count
		if count > 0:
			query = "UPDATE `user_insights` SET `tokens`='%s', `valence_per_word`='%s', `arousal_per_word`='%s', `dominance_per_word`='%s', `valence_avg`=%f, `arousal_avg`=%f, `dominance_avg`=%f, `emotion_tokens`='%s' WHERE `id`=%d" % (regTokens, val_scores, aro_scores, dom_scores, sum_val_score/count, sum_aro_score/count, sum_dom_score/count, emotionTokens, row[0]) 
			cur.execute(query)
			con.commit()

	print "Updated"

main()




