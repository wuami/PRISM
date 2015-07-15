import MySQLdb as mdb
import pandas as pd
import numpy as np
from scipy import spatial
import time_series_tools as tt


def get_insights_by_user(userid, c):
    """ get insight ids for a specific user from database connection c """
    return pd.read_sql_query("SELECT id FROM user_insights WHERE userid = %s;" % userid, c)

def get_insight_times_by_user(userid, c):
    """ get insight times for a specific user from database connection c """
    return pd.read_sql_query("SELECT time FROM user_insights WHERE userid = %s;" % userid, c)

def get_keystrokes_by_user(userid, c):
    """ get keystroke press times for a user from database connection c """
    return pd.read_sql_query("SELECT key_details, key_press_time FROM user_insights WHERE userid = %s;" % userid, c)

def get_keylatency_by_user(userid, c):
    """ get key latency for a user from database connection c """
    return pd.read_sql_query("SELECT keybigram_details, keybigram_timediff FROM user_insights WHERE userid = %s;" % userid, c)

def get_keystrokes_by_insight(insightid, c):
    """ get keystroke press times for an insight from database connection c """
    return pd.read_sql_query("SELECT key_details, key_press_time FROM user_insights WHERE id = %s;" % insightid, c)

def get_keylatency_by_insight(insightid, c):
    """ get key latency for an insight from database connection c """
    return pd.read_sql_query("SELECT keybigram_details, keybigram_timediff FROM user_insights WHERE id = %s;" % insightid, c)

def get_typing_by_insight(insightid, c):
    """ get typing data for an insight from database connection c """
    return pd.read_sql_query("SELECT time_taken, total_spells, total_undos, total_backs, total_redos, total_enters FROM user_insights WHERE id = %s;" % insightid, c)

def get_typing_by_user(userid, c):
    """ get typing data for a user from database connection c """
    return pd.read_sql_query("SELECT time_taken, total_spells, total_undos, total_backs, total_redos, total_enters FROM user_insights WHERE userid = %s;" % userid, c)

def aggregate_text_blob(blob, char=":"):
    """ split blob text format into data frame """
    if blob.empty:
        return pd.DataFrame({'key':[], 'time':[]}, dtype=int)
    first = blob.iloc[:,0].str.split(char).sum()[:-1]
    second = blob.iloc[:,1].str.split(char).sum()[:-1]
    return pd.DataFrame({'key': first, 'time': second}, index=first).convert_objects(convert_numeric=True)


def get_keystroke_stats(id, split_by, var, c):
    """
    compile mean and standard deviation for one variable
    inputs: split_by specifies variable to select data by - either by user or by insight id
            var specifies the variable to select from the database - either key latency or press time
    """
    # ensure inputs are correct
    if var not in ['latency', 'press']:
        raise ValueError("could not get variable split_by %s" % var)
    if split_by not in ['user', 'insight']:
        raise ValueError("could not get split_by %s" % split_by)

    # get data based on inputs
    if var == "latency":
        if split_by == "user":
            data = aggregate_text_blob(get_keylatency_by_user(id, c))
        else:
            data = aggregate_text_blob(get_keylatency_by_insight(id, c))
    else:
        if split_by == "user":
            data = aggregate_text_blob(get_keystrokes_by_user(id, c))
        else:
            data = aggregate_text_blob(get_keystrokes_by_insight(id, c))

    # get summary statistics
    grouped = data.groupby('key')
    mean = grouped.mean()
    std = grouped.std()
    return pd.concat([grouped.mean(), grouped.std()], keys=['mean', 'std'])

def get_mouse_by_user(userid, c):
    """ get mouse data for a user from database connection c """
    return pd.read_sql_query("SELECT time, avg_move_velocity, avg_drag_velocity, mouse_move_position, total_mouse_clicks, total_move_time, total_drag_time, mouse_move_time FROM mouse_interactions WHERE userid = %s;" % userid, c)

def get_total_time(time_blob):
    return sum([int(x) for x in time_blob.split(":")[:-1]])

def get_distance(coord1, coord2):
    coord1 = map(int, coord1.split("-"))
    coord2 = map(int, coord2.split("-"))
    return spatial.distance.euclidean(coord1, coord2)

def get_average_distance(blob):
    coords = blob.split(":")[:-1]
    dist = []
    for i in range(len(coords)-1):
        dist.append(get_distance(coords[i], coords[i+1]))
    return np.mean(dist)

def get_mouse_series(userid, c):
    mouse = get_mouse_by_user(userid, c)
    mouse['time'] = pd.to_datetime(mouse['time'])
    mouse = mouse.set_index('time')
    mouse['average_move_dist'] = mouse['mouse_move_position'].apply(get_average_distance)
    mouse['total_time'] = mouse['mouse_move_time'].apply(get_total_time)
    mouse['scaled_move_time'] = mouse['total_move_time']/mouse['total_time']
    mouse['scaled_drag_time'] = mouse['total_drag_time']/mouse['total_time']
    mouse['scaled_mouse_clicks'] = mouse['total_mouse_clicks']/mouse['total_time']
    mouse.drop(['mouse_move_position', 'mouse_move_time', 'total_move_time', 'total_drag_time', 'total_mouse_clicks'], 1, inplace=True)
    return mouse

def get_mouse_features(userid, split_by, c):
    """ break up time series into chunks and get stats for each """
    if split_by not in ['user', 'insight', 'hour']:
        raise ValueError("could not get split_by %s" % split_by)
    if split_by == 'user' or split_by == 'insight':
        breaks = tt.get_time_breaks(userid, 'insight', c) 
    else:
        breaks = tt.get_time_breaks(userid, 'hour', c)
    time_series = get_mouse_series(userid, c)
    if split_by == 'user':
        means = pd.DataFrame([np.mean(time_series[x]) for x in time_series.columns]).T
    else:
        means = pd.concat([tt.break_and_get_mean(time_series[x], breaks) for x in time_series.columns], axis=1)
    means.columns = time_series.columns
    return means

def get_typing_info(id, split_by, c):
    if split_by == "user":
        return get_typing_by_user(id, c)
    elif split_by == "insight":
        return get_typing_by_insight(id, c)
    raise ValueError("could not get split_by %s" % split_by)

def combine_keyboard_features(id, split_by, c):
    if split_by not in ['user', 'insight', 'hour']:
        raise ValueError("could not get split_by %s" % split_by)
    if split_by == 'hour':
        split_by = 'insight'
    latency = get_keystroke_stats(id, split_by, "latency", c).T
    press = get_keystroke_stats(id, split_by, "press", c).T
    typing = get_typing_info(id, split_by, c)
    typing.index = latency.index
    return latency.join(press).join(typing)


def get_keyboard_features(id, split_by, c):
    """ get all features - both latency and press time - for one user """
    if split_by not in ['user', 'insight', 'hour']:
        raise ValueError("could not get split_by %s" % split_by)
    if split_by == 'insight' or split_by == 'hour':
        insights = get_insights_by_user(id, c).T.values[0]
        keyboard = pd.concat([combine_keyboard_features(i,split_by,c) for i in insights])
        if split_by == 'insight':
            return keyboard
        else:
            breaks = tt.get_time_breaks(id, 'hour', c)[1:]
            times = pd.Series(get_insight_times_by_user(id, c).values[:,0])
            keyboard = keyboard.set_index(pd.to_datetime(times))
            keyboard = pd.concat([tt.get_time_ceiling(t, keyboard) for t in breaks], axis=1).T
            keyboard = keyboard.set_index(breaks)
            return keyboard
    else:
        return combine_keyboard_features(id, split_by, c)

def get_all_features_for_id(id, split_by, c):
    """ get all features corresponding to given id """
    if split_by not in ['user', 'insight', 'hour']:
        raise ValueError("could not get split_by %s" % split_by)
    keyboard = get_keyboard_features(id, split_by, c)
    mouse = get_mouse_features(id, split_by, c)
    data_np = np.hstack((keyboard.values, mouse.values))
    names = np.hstack((keyboard.columns.values, mouse.columns.values))
    return pd.DataFrame(data_np.T, index=names)
    #return pd.concat([keyboard, mouse], keys=['keyboard', 'mouse'])

def get_combined_features(ids, split_by, c):
    """ get all features for multiple users """
    if split_by not in ['user', 'insight', 'hour']:
        raise ValueError("could not get split_by %s" % split_by)
    return pd.concat([get_all_features_for_id(id, split_by, c) for id in ids], axis=1)

def main():
    c = mdb.connect(host=HOST, user=USER, passwd=PASSWORD, db=DATABASE)
    #print get_combined_features([9], "user", c)
    print get_combined_features([35], "hour", c)


if __name__ == "__main__":
    main()
