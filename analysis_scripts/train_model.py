import MySQLdb as mdb
import numpy as np
import pandas as pd
from sklearn import cross_validation, preprocessing, metrics
from sklearn import ensemble, svm, neighbors, naive_bayes, linear_model, tree
import matplotlib.pyplot as plt
import keystroke_tools as kt
import watch_data_tools as wt
import time_series_tools as tt
import sys

models = {"RFR": [ensemble.RandomForestRegressor(max_features=0.2), 'r', "Random Forest"],
          "RFC": [ensemble.RandomForestClassifier(), 'c', "Random Forest"],
          "DTR": [tree.DecisionTreeRegressor(max_features=0.2), 'r', "Decision Tree"],
          "SVR": [svm.SVR(), 'r', "Support Vector Machine"],
          "KNR": [neighbors.KNeighborsRegressor(n_neighbors=2), 'r', "Nearest Neighbors"],
          "NB": [naive_bayes.GaussianNB(), 'c', "Naive Bayes"],
          "LASSO": [linear_model.Lasso(), 'r', "Lasso"],
          "RIDGE": [linear_model.Ridge(), 'r', "Ridge"],
          "ENR": [linear_model.ElasticNet(), 'r', "Elastic Net"],
          "GBRT": [ensemble.GradientBoostingRegressor(learning_rate=0.2), 'r', "Gradient Boosting"]}

def get_var_by_user(var, user, split_by, c):
    if split_by == 'hour':
        df = pd.read_sql_query("SELECT time, %s FROM user_insights WHERE userid = %s" % (var, user), c)
        df = df.set_index('time')
        breaks = tt.get_time_breaks(user, split_by, c)
        return pd.concat([tt.get_time_ceiling(t, df) for t in breaks], axis=1).values[0,1:]
    df = pd.read_sql_query("SELECT %s FROM user_insights WHERE userid = %s" % (var, user), c)
    return df.values.T[0]

def get_var_by_users(var, users, split_by, c):
    result = []
    for user in users:
        result.extend(get_var_by_user(var, user, split_by, c))
    return np.array(result)

def get_and_impute_data(users, impute, split_by, c):
    """ get data and impute """
    interactions = kt.get_combined_features(users, split_by, c).T
    watch = wt.get_combined_features(users, split_by, c)
    user_feature = get_var_by_users("userid", users, split_by, c)
    with open('features.txt', 'w') as f:
        f.write('\t'.join("_".join([str(y) for y in x]) if not isinstance(x,str) else x for x in interactions.columns))
        f.write('\t' + '\t'.join(watch.columns))
    data = np.hstack((interactions.values, watch.values, np.reshape(user_feature, (user_feature.shape[0],1))))
    np.savetxt("alldata.txt", data)
    if not impute:
        return data
    imp = preprocessing.Imputer(strategy="median")
    return imp.fit_transform(data)

def train_and_test_model(data, response, labels, model_type, split_by, c, impute=True, varname=""):
    """ train and test model of users based on given response variable """
    model, type, model_string = models[model_type]
    if type == 'c':
        split = cross_validation.StratifiedShuffleSplit(response, 1, 0.2)
    else:
        #split = cross_validation.KFold(len(response), 5)
        #split = cross_validation.LeavePLabelOut(labels, 3)
        split = cross_validation.LeaveOneLabelOut(labels)
    predict = np.zeros(response.shape)
    for train, test in split:
        model.fit(data[train], response[train])
        predict[test] = model.predict(data[test])
        #print np.corrcoef(np.vstack((response[test], predict[test])))[0,1]
    plot_obs_pred(predict, response, "%s Model Performance" % model_string, varname)
    model.fit(data, response)
    return model

def evaluate_model(data, response, model, title="Model Evaluation Performance", varname=""):
    plot_obs_pred(model.predict(data), response, title=title, varname=varname)

def plot_obs_pred(predict, response, title="Model Performance", varname=""):
    title = r"%s ($r^2 = %0.2f$)" % (title, np.corrcoef(response, predict)[0,1])

    plt.figure(figsize=(6,6))
    plt.plot(predict, response, 'ko')
    plt.plot([0,10], [0,10], 'r-')
    plt.xlim([-0.2,10.2])
    plt.ylim([-0.2,10.2])
    plt.xlabel("predicted %s" % varname)
    plt.ylabel("observed %s" % varname)
    plt.title(title)
    plt.show()

def plot_roc(test_data, test_response, model, title="Model Performance"):
    test_score = model.predict_proba(test_data)
    fpr, tpr = metrics.roc_curve(test_response, test_score)
    auc = metrics.auc(fpr, tpr)

    plt.figure()
    plt.plot(fpr, tpr, label='ROC curve (area = %0.2f)' % auc)
    plt.plot([0,1], [0,1], 'k--')
    plt.xlim([0.0,1.0])
    plt.ylim([0.0,1.05])
    plt.xlabel('False Positive Rate')
    plt.ylabel('True Positive Rate')
    plt.title(title)
    plt.legend(loc="lower right")
    plt.show()

def main():
    c = mdb.connect(host=HOST, user=USER, passwd=PASSWORD, db=DATABASE)
    
    ### CLASSIFYING USERS FROM KEYSTROKE DYNAMICS
    #
    ## get list of insights and labels
    #userlist = [3, 9]
    #users = []
    #for user in userlist:
    #    values = kt.get_insights_by_user(user, c).values[:,0].tolist()
    #    users.extend([user]*len(values))
    #users = np.array(users)
    #
    #rfc = ensemble.RandomForestClassifier()
    #train_and_test_model(userlist, users, rfc, c)
    
    
    ## PREDICTING HAPPINESS LEVEL FROM ALL DATA
    #users = [45]
    users = [33,35,37,39,41,43,45,47,49]
    if len(sys.argv) > 1:
        model_type = sys.argv[1] 
    else:
        raise ValueError("must specify model type as argument")
    split_by = 'hour'

    # get all data
    data = get_and_impute_data(users, True, split_by, c)
    happiness = get_var_by_users("happiness_level", users, split_by, c)
    energy = get_var_by_users("energy_level", users, split_by, c)
    relax = get_var_by_users("relax_level", users, split_by, c)
    insights = get_var_by_users("id", users, split_by, c)
    response = np.vstack((happiness, energy, relax)).T

    n_insights = len(np.unique(insights))

    # split dataset into training and evaluation datasets
    for train_idx, eval_idx in cross_validation.LeavePLabelOut(insights,int(n_insights*0.2)):
        train_data = data[train_idx]
        eval_data = data[eval_idx]
        train_response = response[train_idx]
        eval_response = response[eval_idx]
        train_insights = insights[train_idx]
        eval_insights = insights[eval_idx]
        break

    #model = train_and_test_model(train_data, train_response[:,1], train_insights, model_type, split_by, c, varname="energy level")
    #evaluate_model(eval_data, eval_response[:,1], model, "%s model evaluation" % model_type, "energy level")
    
    model = train_and_test_model(train_data, train_response[:,2], train_insights, model_type, split_by, c, varname="relaxation level")
    #evaluate_model(eval_data, eval_response[:,2], model, "%s model evaluation" % models[model_type][2], "relaxation level")

    np.savetxt('response.txt', np.vstack((happiness, energy, relax)))

if __name__ == "__main__":
    main()
