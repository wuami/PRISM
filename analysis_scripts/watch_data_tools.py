import MySQLdb as mdb
import pandas as pd
import numpy as np
import time_series_tools as tt


def split_blob_series(blob, char=";"):
    """ split text blob by char """
    split = np.array([blob.iloc[i].split(char) for i in range(len(blob))])
    return pd.DataFrame(split.T)

def cart2sph(xyz):
    """ convert cartesian to spherical coordinates """
    dtype = xyz.columns[0][:-1]
    index = xyz.index
    xyz = xyz.values
    xy = xyz[:,0]**2 + xyz[:,1]**2
    sph = pd.DataFrame(np.vstack(([np.sqrt(xy + xyz[:,2]**2), np.arctan2(np.sqrt(xy), xyz[:,2]), np.arctan2(xyz[:,1], xyz[:,0])])).T, index=index)
    sph.columns = ['%sr' % dtype, '%stheta' % dtype, '%sphi' % dtype]
    return sph

def get_all_features_for_id(userid, split_by, c):
    """ get all summary features for watch data for one user """
    features = ['timestamp', 'heart_rate', 'light', 'total_steps', 'walk_steps', 'run_steps', 'walk_freq', 'step_status', 'speed', 'distance', 'calories', 'accelx', 'accely', 'accelz', 'rotata', 'rotatb', 'rotatc']

    # get data from mysql
    breaks = tt.get_time_breaks(userid, split_by, c)
    data = pd.read_sql_query("SELECT %s FROM user_data WHERE userid = %s;" % (", ".join(features), userid), c)

    # split data and ensure correct format and data types
    time_series = pd.concat([split_blob_series(data.iloc[i,:]) for i in range(data.shape[0])])
    time_series.columns = features
    time_series = time_series.convert_objects(convert_dates=True, convert_numeric=True)
    time_series['timestamp'] = pd.to_datetime(time_series['timestamp'])
    time_series = time_series.set_index('timestamp')

    # convert cumulative data types
    cum_dtypes = ['total_steps', 'walk_steps', 'run_steps', 'distance', 'calories']
    #final_values = pd.concat([time_series[:b][cum_dtypes].iloc[-1] for b in breaks[1:]], axis=1).T
    final_values = pd.concat([tt.get_time_ceiling(b, time_series[cum_dtypes]) for b in breaks[1:]], axis=1).T
    time_series = time_series.join(time_series[cum_dtypes].diff(), lsuffix="", rsuffix="_diff")
    time_series = time_series.drop(cum_dtypes, 1)
    
    # convert acceleration and rotation coordinates to spherical
    time_series = time_series.join(cart2sph(time_series[['accelx', 'accely', 'accelz']]))
    time_series = time_series.drop(['accelx', 'accely', 'accelz'], 1)
    
    # return combined data over all time series
    data = pd.concat([tt.break_and_get_stats(time_series[x], breaks) for x in time_series.columns], axis=0).T
    featurelist = []
    for feat in time_series.columns:
        featurelist.extend(['mean_%s' % feat, 'std_%s' % feat, 'freq_%s' % feat])
    data.columns = featurelist
    final_values.index = data.index
    data = data.join(final_values)
    return data

def get_combined_features(users, split_by, c):
    """ get all time series features for one user """
    return pd.concat([get_all_features_for_id(user, split_by, c) for user in users])

def main():
    # testing on a single user
    c = mdb.connect(host=HOST, user=USER, passwd=PASSWORD, db=DATABASE)
    data = get_combined_features([35], "hour", c)
    print data

if __name__ == "__main__":
    main()
