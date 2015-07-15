This repository contains the entire codebase of the PRISM (Passive, Real-time Information for Sensing Mental Health) platform, along with the database structure. The directory structure is as follows:

* BrainHealth_WearableApp: Contains the final code for the Samsung Gear S smart watch application that collects physiological, activity and environmental data from the user. (Maulik)
* BrainHealth_WebApp: Contains the code for the web application, that allows users to enter subjective insights and quantitative outcomes, monitors user keystroke and mouse interaction patterns and provides data visualizations panels for all the collected data types. (Maulik) 
* analysis_scripts: Scripts to perform feature engineering and supervised and unsupervised Machine Learning over the textual insights, keystroke patterns and physiological data collected from smart watch. (Michelle)
* data_processing: Workaround scripts for preliminary data cleaning and processing before upload to database (Michelle)

Contact Maulik or Michelle to learn more about database structure and data collection details.

**Libraries and Requirements:**
* Amazon EC2 instance
* Tizen SDK for Wearable 1.0.0
* Samsung Gear S smart watch
* Apache 2 Server with PHP5, PHP5-CURL, PHP-Pspell, PHP-MySQL, GNU Aspell installed
* MySQL Database
* Compute Cluster
* Web & Visualization libraries: jQuery, BootstrapJS, KineticJS, HeatmapJS, HighSlide Charts
* Machine Learning: R ggplot, Python pandas, scikit-learn

**Developers:**
* Maulik Kamdar (maulikrk@stanford.edu)
* Michelle Wu (mjwu@stanford.edu)
