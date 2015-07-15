window.onload = function () {
	var username;
	var startTime = new Date();
	var motionFile = null, lightFile = null, hrmFile = null, pedoFile = null;
    
    document.addEventListener('tizenhwkey', function(e) {
        if(e.keyName == "back")
		try {
		    tizen.application.getCurrentApplication().exit();
		} catch (ignore) {
		}
    });

    function createFile() {
    	var documentsDir;  
    	jQuery("#log").html("creating files");
    	tizen.filesystem.resolve("documents", function (result) {
    		documentsDir = result; 
    		motionFile = documentsDir.createFile(username + "_motion_" + startTime.getTime() + ".txt");
    		lightFile = documentsDir.createFile(username + "_light_" + startTime.getTime() + ".txt");
    		hrmFile = documentsDir.createFile(username + "_hrm_" + startTime.getTime() + ".txt");
    		pedoFile = documentsDir.createFile(username + "_pedo_" + startTime.getTime() + ".txt")
    		if (motionFile != null) motionFile.openStream('w', onOpenSuccessMotion);
    		if (lightFile != null) lightFile.openStream('w', onOpenSuccessLight);
    		if (hrmFile != null) hrmFile.openStream('w', onOpenSuccessHrm);
    		if (pedoFile != null) pedoFile.openStream('w', onOpenSuccessPedo);
    	}, function (error) {alert("error resolving dir" + error.message)});
    }
    
    function onOpenSuccessMotion(fileLoc) {
    	jQuery("#log").html("writing motion data");
    	fileLoc.write("Time\tAccelX\tAccelY\tAccelZ\tAccelGX\tAccelGY\tAccelGZ\tRotatA\tRotatB\tRotatC\tInterval\n")
    	var prevTime = new Date();
    	var desiredTimeDiff = 1; 
    	
    	function deviceMotionHandler(eventData) {
    		var printString = "";
    		var currentTime = new Date();
    		var timeDiff = Math.floor((currentTime-prevTime)/1000);
    		if (timeDiff >= desiredTimeDiff) {
    			var outputString = currentTime.toString();
        		// Grab the acceleration including gravity from the results
        		var acceleration = eventData.acceleration;
        		printString = "(" + round(acceleration.x) + ", " + round(acceleration.y) + ", " + round(acceleration.z) + ")";
        		outputString = outputString + "\t" + round(acceleration.x) + "\t" + round(acceleration.y) + "\t" + round(acceleration.z);
        		jQuery("#accel").html(printString);

        		acceleration = eventData.accelerationIncludingGravity;
        		printString = "(" + round(acceleration.x) + ", " + round(acceleration.y) + ", " + round(acceleration.z) + ")";
        		outputString = outputString + "\t" + round(acceleration.x) + "\t" + round(acceleration.y) + "\t" + round(acceleration.z);
        	    jQuery("#accelg").html(printString);

        	    var rotation = eventData.rotationRate;
        	    printString = "(" + round(rotation.alpha) + ", " + round(rotation.beta) + ", " + round(rotation.gamma) + ")";
        		outputString = outputString + "\t" + round(rotation.alpha) + "\t" + round(rotation.beta) + "\t" + round(rotation.gamma) + "\n";
        	    jQuery("#rotat").html(printString);

        	    info = eventData.interval;
        	    outputString = outputString + "\t" + info;
        	    fileLoc.write(outputString + "\n");
    		}
    		prevTime = currentTime;
    	}

    	function round(val) {
    		var amt = 10;
    		return Math.round(val * amt) /  amt;
    	}
    	
    	if ((window.DeviceMotionEvent) || ('listenForDeviceMovement' in window)) {
    		window.addEventListener('devicemotion', deviceMotionHandler, false);
    	} else {
    		alert("Device Motion not supported on your device or browser.  Sorry!")
    	}	
    }
    
    function onOpenSuccessLight(fileLoc) {
    	var sensors = tizen.sensorservice.getAvailableSensors();
    	alert("Available sensor: " + sensors.toString());

    	fileLoc.write("Time\tLight\tUV\n");
    	lightSensor = tizen.sensorservice.getDefaultSensor("LIGHT");
        UVSensor = tizen.sensorservice.getDefaultSensor("ULTRAVIOLET");
        hrmSensor = tizen.sensorservice.getDefaultSensor("HRM_RAW");
        function onGetSuccessCB(sensorData)
        {
           alert("light level: " + sensorData.lightLevel);
        }

        function onsuccessCB()
        {
           console.log("sensor started");
           lightSensor.getLightSensorData(onGetSuccessCB);
           lightSensor.stop();
        }

        function onhrmGetSuccessCB(sensorData)
        {
           alert("hrm level: " + sensorData.HRMLevel);
        }

        function onhrmsuccessCB()
        {
           console.log("sensor started");
           hrmSensor.getHRMSensorData(onhrmGetSuccessCB);
           hrmSensor.stop();
        }
        
        lightSensor.start(function() {jQuery("#log").append('Light sensor started');}, function() {jQuery("#log").append('Failure to start light sensor');});
        lightSensor.start(onsuccessCB);
        
        hrmSensor.start(function() {jQuery("#log").append('HRM sensor started');}, function() {jQuery("#log").append('Failure to start hrm sensor');});
        hrmLevel = hrmSensor.getHRMSensorData(onhrmsuccessCB)
        //alert(hrmLevel);
    }
    
    function onOpenSuccessHrm(fileLoc) {
    	fileLoc.write("Time\tHeartBeat\tP2P\n");
    	var prevTime = new Date();
    	var hrmRate = 0, p2p = 0;
    	
    	function onchangedCB(hrmInfo) { 
    		hrmRate = hrmInfo.heartRate;
    		p2p = hrmInfo.rRInterval; 
    		var currentTime = new Date();
    		fileLoc.write(currentTime.getTime() + "\t" + hrmRate + "\t" + p2p + "\n");
    		jQuery("#hrm").html(hrmRate);
    		jQuery("#p2p").html(p2p);
    	}
    	
    	webapis.motion.start("HRM", onchangedCB); 
    }
    
    function onOpenSuccessPedo(fileLoc) {
//    	fileLoc.write("Pedofile here");
//    	function onchangedCB(pedometerInfo) { 
//    		alert("pedometer found");
//    		var data1 = "Step status: " + pedometerInfo.stepStatus; 
//    		var data2 = "Cum. total step count: " + pedometerInfo.cumulativeTotalStepCount;
//    		alert(data1);
//    	}
//    	webapis.motion.start("PEDOMETER", onchangedCB);

    	fileLoc.write("Time\tTotalSteps\tCalories\n"); 
    	var prevTime = new Date(); 
    	var desiredTime = 1; 
    	var pedometerData = {};
    	
    	function onchangedCB(pedometerInfo) {
    		var currentTime = new Date();
    		var timeDiff = Math.floor((currentTime-prevTime)/1000);
    		
    		if (timeDiff >= desiredTime) {
    			pedometerData = getPedometerData(pedometerInfo);
    			fileLoc.write(currentTime.getTime() + "\t" + pedometerData.totalStep + "\t" + pedometerData.calorie + "\n");
    			jquery("#tsteps").html(pedometerData.totalStep);
    			jquery("#calories").html(pedometerData.calorie);
    		}
    	}
    	
    	if (window.webapis && window.webapis.motion !== undefined) {
    		webapis.motion.setAccumulativePedometerListener(onchangedCB);
        	webapis.motion.start("PEDOMETER", onchangedCB);
    	} else {
    		alert("Pedometer not supported on device.");
    	}
    }
    
    function getPedometerData(pedometerInfo) {
    	var pData = {
    		calorie: pedometerInfo.cumulativeCalorie, 
    		distance: pedometerInfo.cumulativeDistance,
    		runDownStep: pedometerInfo.cumulativeRunDownStepCount,
    		runStep: pedometerInfo.cumulativeRunStepCount,
    		runUpStep: pedometerInfo.cumulativeRunUpStepCount,
    		speed: pedometerInfo.speed,
    		stepStatus: pedometerInfo.stepStatus,
    		totalStep: pedometerInfo.cumulativeTotalStepCount,
    		walkDownStep: pedometerInfo.cumulativeWalkDownStepCount,
    		walkStep: pedometerInfo.cumulativeWalkStepCount,
    		walkUpStep: pedometerInfo.cumulativeWalkUpStepCount,
    		walkingFrequency: pedometerInfo.walkingFrequency
    	};
    	return pData;
    }
    
    function resetData() {
    	var pData = {
    		calorie: 0, 
        	distance: 0,
        	runDownStep: 0,
        	runStep: 0,
        	runUpStep: 0,
        	speed: 0,
        	stepStatus: 0,
        	totalStep: 0,
        	walkDownStep: 0,
        	walkStep: 0,
        	walkUpStep: 0,
        	walkingFrequency: 0
    	};
    	return pData;
    }
    
    function stopSensors() {
    	alert("stop collecting");
    	document.removeEventListener("devicemotion", function(){motionFile.closeStream();});
    }
    
    
    var submitBtn = document.querySelector('#submit');
    submitBtn.addEventListener("click", function(){
    	username = jQuery('#username').val();
    	jQuery('#startScreen').hide();
    	jQuery('#sensorScreen').show();
    	jQuery('#provUsername').html(username);
    	jQuery('#startTime').html(startTime.toDateString());
    	createFile();
    });
    
    var stopBtn = document.querySelector("#stop");
    stopBtn.addEventListener("click", function() {
    	jQuery('#sensorScreen').hide();
    	jQuery('#startScreen').show();
    	stopSensors();
    })
    
};
