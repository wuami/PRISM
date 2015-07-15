import MySQLdb as mdb
import pandas as pd
import numpy as np
from sklearn.feature_extraction import text
from sklearn import pipeline, naive_bayes

def list_to_string(list):
    """ turn list into string format for mysql queries """
    list = ["'%s'" % x for x in list]
    return "("+list.join(",")+")"

def get_insights_by_user(userids, c):
    """ get insights for a specific user from database connection c """
    return pd.read_sql_query("SELECT insight FROM user_insights WHERE userid IN %s;" % list_to_string(userids), c) 

def get_insights_by_id(insightids, c):
    """ get insights by id from database connection c """
    return pd.read_sql_query("SELECT insight FROM user_insights WHERE insightid IN %s;" % list_to_string(insightids), c) 

def fit_insights(insightids, response, c):
    """ create a naive bayes model based on the insight ids and response vector given """
    data = get_insights_by_id(insightids, c) 
    nlp_pl = pipeline.Pipeline([('vect', text.CountVectorizer()),
                                ('tfidf', text.TfidfTransformer(use_idf=True)),
                                ('clf', naive_bayes.MultinomialNB())])
    text_clf = nlp_pl.fit(insights, response)
    return text_clf

def predict_insights(model, insightids, c):
    """ predict results for given insight ids with model """
    data = get_insights_by_id(insightids, c) 
    return model.predict(data)
    
def main():
    # get connection to database
    c = mdb.connect(host=HOST, user=USER, passwd=PASSWORD, db=DATABASE)
    
    # get insights from database
    train = [1, 2, 3]
    test = [4, 5]
    model = fit_insights(train, [-1, 1, -1], c)
    print predict_insights(model, test, c)

if __name__ == "__main__":
    main()
