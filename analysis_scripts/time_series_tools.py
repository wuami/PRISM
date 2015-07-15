import numpy as np
import pandas as pd

def get_frequency(time_series):
    """ get major frequency from fourier transform """
    if len(time_series.index) == 0:
        return 0
    ft = np.fft.rfft(time_series)
    return np.fft.fftfreq(len(time_series))[np.argmax(abs(ft))]

def get_time_series_stats(time_series):
    """ get mean, std and major frequency for a single time series """
    return pd.Series([np.mean(time_series), np.std(time_series), get_frequency(time_series)])

def break_and_get_stats(full_series, breaks):
    """ break up time series into chunks and get time series stats for each """
    n = len(breaks)
    return pd.concat([get_time_series_stats(full_series[breaks[i]:breaks[i+1]]) for i in range(n-1)], axis=1)

def break_and_get_mean(full_series, breaks):
    """ break up time series into chunks and get mean for each """
    n = len(breaks)
    return pd.Series([np.mean(full_series[breaks[i]:breaks[i+1]]) for i in range(n-1)])

def get_time_ceiling(time, data):
    """ get closest point in times list after given time """
    if time >= data.index.max():
        return data.iloc[-1]
    elif time <= data.index.min():
        return data.iloc[0]
    return data[str(time):].iloc[0]

def get_time_breaks(userid, split_by, c):
    """
    get break points for time series based on insight times
    includes zero time point at the beginning
    """
    result = pd.read_sql_query("SELECT time FROM user_insights WHERE userid = %s;" % userid, c) 
    if split_by == "insight":
        timestamps = pd.to_datetime(pd.Series(np.insert(result.values,0,0)))
        timestamps.sort()
        return timestamps
    elif split_by == "hour":
        timestamps = pd.to_datetime(pd.Series(result.values[:,0]))
        timestamps = pd.date_range(timestamps.min(), timestamps.max(), freq='H')
        timestamps = np.insert(timestamps.values, 0, 0)
        return pd.Series(pd.to_datetime(timestamps))
