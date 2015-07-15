var storage = (function() {
    var uid = new Date,
        storage,
        result;
    try {
      (storage = window.localStorage).setItem(uid, uid);
      result = storage.getItem(uid) == uid;
      storage.removeItem(uid);
      return result && storage;
    } catch(e) {}
}());

window.onload = function () {
	var username;
	var startTime = new Date();
	var lightFile = null;
	var tizenLocalInterval = null;
    
	if (storage.getItem("collecting")) {
		startTime = new Date();
    	jQuery('#startScreen').hide();
    	jQuery('#sensorScreen').show();
    	username = storage.getItem("collecting");
    	jQuery('#provUsername').html(username);
    	jQuery('#startTime').html(startTime.toDateString());
    	createFile();
    }
	
    document.addEventListener('tizenhwkey', function(e) {
        if(e.keyName == "back")
		try {
		    tizen.application.getCurrentApplication().exit();
		} catch (ignore) {
		}
    });

    function createFile() {
    	var documentsDir;  
    	jQuery("#log").html("creating files<br>");
    	tizen.filesystem.resolve("documents", function (result) {
    		documentsDir = result; 
    		lightFile = documentsDir.createFile(username + "_hrm_raw_" + startTime.getTime() + ".txt");
    		if (lightFile != null) lightFile.openStream('w', onOpenSuccessLight);
    	}, function (error) {alert("error resolving dir" + error.message)});
    }
    
    
    function onOpenSuccessLight(fileLoc) {
    	var sensors = tizen.sensorservice.getAvailableSensors();
    	alert("Available sensor: " + sensors.toString());
    	hrmSensor = tizen.sensorservice.getDefaultSensor("HRM_RAW");
    	var prevTime = new Date()
    	fileLoc.write("Time: Base Value-" + prevTime.getTime() + "\tHRM Type\tIntensity\n");
    	
    	function onchangedCB(sensorData) {
    		var currentTime = new Date();
    		var lightVal = sensorData.lightType == "LED_GREEN"? 1 : (sensorData.lightType == "LED_RED" ? 2 : 3);
    		fileLoc.write(currentTime.getTime()-prevTime.getTime() + "\t" + lightVal + "\t" + sensorData.lightIntensity + "\n");
    		jQuery("#raw_hrm").html(sensorData.lightType + " " + sensorData.lightIntensity);
    		prevTime = currentTime;
    	}
        
        hrmSensor.start(function() {jQuery("#log").append('HRM sensor started<br>');}, function() {jQuery("#log").append('Failure to start HRM sensor');});
        hrmSensor.setChangeListener(onchangedCB);
    }
    
    
    function stopSensors() {
    	alert("stop collecting");
    	clearInterval(tizenLocalInterval);
    	hrmSensor.stop();
    	//hrmSensor.stop();
    }
    
    
    var submitBtn = document.querySelector('#submit');
    submitBtn.addEventListener("click", function(){
    	username = jQuery('#username').val();
    	jQuery('#startScreen').hide();
    	jQuery('#sensorScreen').show();
    	jQuery('#provUsername').html(username);
    	jQuery('#startTime').html(startTime.toDateString());
    	storage.setItem("collecting", username);
    	createFile();
    });
    
    var stopBtn = document.querySelector("#stop");
    stopBtn.addEventListener("click", function() {
    	jQuery('#sensorScreen').hide();
    	jQuery('#startScreen').show();
    	stopSensors();
    	storage.removeItem("collecting");
    })
    
};
