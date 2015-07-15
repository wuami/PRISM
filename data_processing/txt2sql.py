import MySQLdb as mdb
import pandas as pd
import argparse
import time

def convert_time(unix):
	t = time.localtime(unix)
	return "%s-%s-%s %s:%s:%s" % (t.tm_year, t.tm_mon, t.tm_mday, t.tm_hour, t.tm_min, t.tm_sec)

# parse arguments
p = argparse.ArgumentParser()
p.add_argument("-i", "--inputFile", help="path to input file")
p.add_argument("-u", "--username", help="username for data")
p.add_argument("-d", "--date", help="date data collected in format YYYY-MM-DD")
args = p.parse_args()


## READ DATA FROM FILE TO PANDAS ##

cols = ['timestamps', 'heart_rate', 'peak2peak', 'light', 'latitude', 'longitude']
data = pd.DataFrame(columns=cols)
# must maintain current stats, roll over if no update
current = {'timestamps':'NA', 'heart_rate':'NA', 'peak2peak':'NA', 'light':'NA', 'latitude':'NA', 'longitude':'NA'}
with open(args.inputFile) as f:
    for line in f:
       	if line.strip():
			spl = line.strip().split(";")
			current['timestamps'] = "%s %s" % (args.date, spl[0])
			# update each data type that is read
			for datum in spl[1:]:
				datum = datum.strip()
				if datum.startswith("hr"):
					current['heart_rate'] = datum[4:]
				elif datum.startswith("ptp"):
					current['peak2peak'] = datum[5:]
				elif datum.startswith("light level"):
					current['light'] = datum[13:]
				elif datum.startswith("lat"):
					current['latitude'] = datum[5:]
				elif datum.startswith("long"):
					current['longitude'] = datum[6:]			
			data = data.append(current, ignore_index=True)

def get_blob(series, char=";"):
	return char.join(series)

# join data into text blob
result = data.apply(get_blob, axis=0)

# get mysql connection
con = mdb.connect(host=HOST, user=USER, passwd=PASSWORD, db=DATABASE)
cur = con.cursor()

# get user id from username
cur.execute("SELECT id FROM user_profiles WHERE username = '%s';" % args.username)
result['userid'] = cur.fetchone()[0]
result = pd.DataFrame(result).T
print result

# write to sql
result.to_sql("user_data", con, flavor="mysql", if_exists="append")
