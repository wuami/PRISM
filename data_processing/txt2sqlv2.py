import MySQLdb as mdb
import pandas as pd
import argparse
import time
import re
from collections import OrderedDict

def read_line(f, base_time=0):
    """ read one line of data, converting timestamp to int """
    line = f.readline().strip().split('\t')
    if line[0] != '':
        line[0] = int(line[0]) + base_time
    return line

def get_step_status_int(string):
    """ convert step status to corresponding integer value """
    if string == "RUNNING":
        return "2"
    elif string == "WALKING":
        return "1"
    else:
        return "0"

def convert_time(unix):
    """ convert unix time to correct format """
    t = time.gmtime(unix/1000)
    return "%s-%s-%s %02d:%02d" % (t.tm_year, t.tm_mon, t.tm_mday, t.tm_hour, t.tm_min)

def get_blob(series, char=";"):
    return char.join(series)

def insert_data(data):
    # join data into text blob
    data = pd.DataFrame(data, columns=cols)
    result = data.apply(get_blob, axis=0)
    
    # get mysql connection
    con = mdb.connect(host=HOST, user=USER, passwd=PASSWORD, db=DATABASE)
    cur = con.cursor()
    
    # get user id from username
    cur.execute("SELECT id FROM user_profiles WHERE username = '%s';" % args.user)
    result['userid'] = cur.fetchone()[0]
    result = pd.DataFrame(result).T
    print result
    
    # write to sql
    result.to_sql("user_data", con, flavor="mysql", if_exists="append")


# parse arguments
p = argparse.ArgumentParser()
p.add_argument("-u", "--user", help="username for data")
p.add_argument("-t", "--time", help="username for data")
p.add_argument("-p", "--path", help="path to files", default="../../datav3")
args = p.parse_args()


## READ DATA FROM FILE TO PANDAS ##

# open files
hrm_file = open('%s/%s_hrm_%s.txt_new_adj' % (args.path, args.user, args.time), 'r')
light_file = open('%s/%s_light_%s.txt_adj' % (args.path, args.user, args.time), 'r')
pedo_file = open('%s/%s_pedo_%s.txt_adj' % (args.path, args.user, args.time), 'r')
motion_file = open('%s/%s_motion_%s.txt_adj' % (args.path, args.user, args.time), 'r')

# read header to get baseline time for hrm data
hrm_header = hrm_file.readline()
hrm_base_time = int(re.search('\(.*\).*\((.*?)\)', hrm_header).group(1))

# remove header lines in each file
hrm_file.readline()
light_file.readline()
pedo_file.readline()
motion_file.readline()

# get first data point from each file
hrm = read_line(hrm_file)
light = read_line(light_file)
pedo = read_line(pedo_file)
motion = read_line(motion_file)

# create dataframe
cols = ['timestamp', 'heart_rate', 'peak2peak', 'light', 'calories', 'distance', 'run_steps', 'speed', 'step_status', 'total_steps', 'walk_steps', 'walk_freq', 'accelx', 'accely', 'accelz', 'rotata', 'rotatb', 'rotatc']
#data = pd.DataFrame(columns=cols)
data = []

# maintain current stats, roll over if no update, initialize with NA
current = OrderedDict(zip(cols, ['NA']*len(cols)))

# read data, one time point at a time
prev_timestamp = 0
while len(hrm) > 1 or len(light) > 1 or len(pedo) > 1 or len(motion) > 1:
    timestamp = min(hrm[0], light[0], pedo[0], motion[0])
    current['timestamp'] = convert_time(timestamp)
    if hrm[0] == timestamp:
        current['heart_rate'] = hrm[1]
        if hrm[2] != "0":
            current['peak2peak'] = hrm[2]
        hrm = read_line(hrm_file)
    if light[0] == timestamp:
        current['light'] = light[1]
        light = read_line(light_file)
    if pedo[0] == timestamp:
        current['calories'] = pedo[1]
        current['distance'] = pedo[2]
        current['run_steps'] = pedo[3]
        current['speed'] = pedo[4]
        current['step_status'] = get_step_status_int(pedo[5])
        current['total_steps'] = pedo[6]
        current['walk_steps'] = pedo[7]
        current['walk_freq'] = pedo[8]
        pedo = read_line(pedo_file)
    if motion[0] == timestamp:
        current['accelx'], current['accely'], current['accelz'] = motion[1:4]
        current['rotata'], current['rotatb'], current['rotatc'] = motion[4:8]
        motion = read_line(motion_file)
    #data = data.append(current, ignore_index=True)
    if current['timestamp'] == prev_timestamp:
        continue
    prev_timestamp = current['timestamp']
    data.append(current.values())
    if len(data) == 60:
        insert_data(data)
        data = []

insert_data(data)
