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
	var motionFile = null, lightFile = null, hrmFile = null, pedoFile = null;
	//var tizenLocalInterval = null;
	var isHidden = false;
    
	if (storage.getItem("collecting")) {
		startTime = new Date();
    	jQuery('#startScreen').hide();
    	jQuery('#sensorScreen').show();
    	username = storage.getItem("collecting");
    	jQuery('#provUsername').html(username);
    	jQuery('#startTime').html(startTime.toDateString());
    	createFile();
    }

	document.addEventListener("visibilitychange", visibilityChanged);
	
	function visibilityChanged() {
		if (document.hidden) isHidden = true;
		else isHidden = false;
	}
	
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
    
    function round(val) {
		var amt = 100;
		return Math.round(val * amt) /  amt;
	}
    
    function onOpenSuccessMotion(fileLoc) {
    	jQuery("#log").html("writing motion data<br>");
    	var prevTime = new Date();
    	//fileLoc.write("Time -" + prevTime.getTime() + " (one second apart)\nAccelX\tAccelY\tAccelZ\tAccelGX\tAccelGY\tAccelGZ\tRotatA\tRotatB\tRotatC\n")
    	fileLoc.write("Time\tAccelX\tAccelY\tAccelZ\tRotatA\tRotatB\tRotatC\n")
    	
    	var prevSeconds = prevTime.getSeconds();
    	var desiredTimeDiff = 1; 
    	
    	netAccelX = 0; 
		netAccelY = 0;
		netAccelZ = 0; 
		/*netAccelGX = 0;
		netAccelGY = 0; 
		netAccelGZ = 0; */
		netAlpha = 0;
		netBeta = 0; 
		netGamma = 0; 
		count = 0;	
		
    	function deviceMotionHandler(eventData) {
    		var printString = "";
    		var currentTime = new Date();
    		var currentSeconds = currentTime.getSeconds();
    		
    		if (prevSeconds != currentSeconds) {
    			var outputString = prevTime.getTime();
    			var avgAccelX = round(netAccelX/count);
    			var avgAccelY = round(netAccelY/count);
    			var avgAccelZ = round(netAccelZ/count);
    			var avgAlpha = round(netAlpha/count);
    			var avgBeta = round(netBeta/count);
    			var avgGamma = round(netGamma/count);
    			outputString = outputString + "\t" + avgAccelX + "\t" + avgAccelY + "\t" + avgAccelZ;
    			//outputString = outputString + "\t" + round(netAccelGX/count) + "\t" + round(netAccelGY/count) + "\t" + round(netAccelGZ/count);
    			outputString = outputString + "\t" + avgAlpha + "\t" + avgBeta + "\t" + avgGamma;
    			fileLoc.write(outputString + "\n");
    			
    			if (!isHidden) {
            		printString = "(" + avgAccelX + ", " + avgAccelY + ", " + avgAccelZ + ")";
                	jQuery("#accel").html(printString);
                	
                	//printString = "(" + round(accelerationG.x) + ", " + round(accelerationG.y) + ", " + round(accelerationG.z) + ")";
                	//jQuery("#accelg").html(printString);
                	
                	printString = "(" + avgAlpha + ", " + avgBeta + ", " + avgGamma + ")";
                	jQuery("#rotat").html(printString);
            	}
    			
    			netAccelX = 0; 
    			netAccelY = 0;
    			netAccelZ = 0; 
    			/*netAccelGX = 0;
    			netAccelGY = 0; 
    			netAccelGZ = 0; */
    			netAlpha = 0;
    			netBeta = 0; 
    			netGamma = 0; 
    			count = 0;		
    		} 
    		var acceleration = eventData.acceleration;
    		//var accelerationG = eventData.accelerationIncludingGravity;
    		var rotation = eventData.rotationRate;
    		var timeInt = eventData.interval;
        	netAccelX = netAccelX + acceleration.x;
        	netAccelY = netAccelY + acceleration.y;
        	netAccelZ = netAccelZ + acceleration.z;
        	/*netAccelGX = netAccelGX + accelerationG.x;
        	netAccelGY = netAccelGY + accelerationG.y;
        	netAccelGZ = netAccelGZ + accelerationG.z;*/
        	netAlpha = netAlpha + rotation.alpha;
        	netBeta = netBeta + rotation.beta;
        	netGamma = netGamma + rotation.gamma;
        	count++;
    		//alert(totalTime + " " + timeInt);
        	
    		prevTime = currentTime;
    		prevSeconds = prevTime.getSeconds();
    	}
    	
    	if ((window.DeviceMotionEvent) || ('listenForDeviceMovement' in window)) {
    		window.addEventListener('devicemotion', deviceMotionHandler, false);
    	} else {
    		alert("Device Motion motion supported on your device or browser.  Sorry!")
    	}	
    }
    
    function onOpenSuccessLight(fileLoc) {
    	//var sensors = tizen.sensorservice.getAvailableSensors();
    	//alert("Available sensor: " + sensors.toString());
    	var prevTime = new Date();
    	var prevSeconds = prevTime.getSeconds();
    	fileLoc.write("Time\tLight Levels\n");
    	//fileLoc.write("Light\n");
    	lightSensor = tizen.sensorservice.getDefaultSensor("LIGHT");
        
        lightLevel = 0;
        count = 0;
      
        function onGetLightSuccessCB(sensorData) {
        	var currentTime = new Date();
        	var currentSeconds = currentTime.getSeconds();
    		
    		if (prevSeconds != currentSeconds) {
    			var avgLevel = round(lightLevel/count);
    			if (!isHidden) jQuery("#light").html(avgLevel);
    			fileLoc.write(prevTime.getTime() + "\t" + avgLevel + "\n");
    			lightLevel = 0;
    			count = 0;
    		}
    		lightLevel = lightLevel + sensorData.lightLevel;
        	prevTime = currentTime;
    		prevSeconds = prevTime.getSeconds();
           	count++;
        }
        
        function querySensors(){
        	lightSensor.getLightSensorData(onGetLightSuccessCB);
        	fileLoc.write(lightLevel + "\n");
        }
        
        lightSensor.start(function() {jQuery("#log").append('Light sensor started<br>');}, function() {jQuery("#log").append('Failure to start light sensor');});
        //tizenLocalInterval = setInterval(querySensors, 1000);
        lightSensor.setChangeListener(onGetLightSuccessCB);
    }
    
    function onOpenSuccessHrm(fileLoc) {
    	var prevTime = new Date();
    	fileLoc.write("Time - "+ prevTime + " (" + prevTime.getTime() + ")\nTime Difference\tHeartBeat\tP2P\n");
    	var hrmRate = 0, p2p = 0;
    	var prevHeartRate = 0, prevp2p = 0;
    	
    	function onchangedCB(hrmInfo) { 
    		hrmRate = hrmInfo.heartRate;
    		p2p = hrmInfo.rRInterval; 
    		if (prevHeartRate != hrmRate || prevp2p != p2p) {
	    		var currentTime = new Date();
	    		var timeDiff = currentTime.getTime()-prevTime.getTime();
	    		fileLoc.write(timeDiff + "\t" + hrmRate + "\t" + p2p + "\n");
	    		if (!isHidden) jQuery("#hrm").html(hrmRate);
	    		if (!isHidden) jQuery("#p2p").html(p2p);
	    		prevTime = currentTime;
    		}
    		prevHeartRate = hrmRate;
    		prevp2p = p2p;
    	}
    	
    	webapis.motion.start("HRM", onchangedCB); 
    }
    
    function onOpenSuccessPedo(fileLoc) {
    	fileLoc.write("Time\tcalories\tdistance\trunStep\tspeed\tstepStatus\ttotalStep\twalkStep\twalkingFrequency\n");
    	var calories = 0, distance = 0, runStep = 0, speed = 0, stepStatus = "NOT_MOVING", totalStep = 0, walkStep = 0, walkFrequency = 0;
    	//alert("Trying to write Pedometer data");
    	function onchangedCB(pedometerInfo) { 
    		//alert("pedometer changed");    		
    		calories = pedometerInfo.cumulativeCalorie;
    		distance = pedometerInfo.cumulativeDistance;
    		runStep = pedometerInfo.cumulativeRunStepCount;
    		speed = pedometerInfo.speed;
    		stepStatus = pedometerInfo.stepStatus;
    		totalStep = pedometerInfo.cumulativeTotalStepCount;
    		walkStep = pedometerInfo.cumulativeWalkStepCount;
    		walkFrequency = pedometerInfo.walkingFrequency;
    		var currentTime = new Date();
    		fileLoc.write(currentTime.getTime() + "\t" + calories + "\t" + distance + "\t" + runStep + "\t" + speed + "\t" + stepStatus+ "\t" + totalStep+ "\t" + walkStep+ "\t" + walkFrequency + "\n");
    		jQuery("#status").html(stepStatus);
	    	jQuery("#calories").html(calories);
	    	jQuery("#tsteps").html(totalStep);
	    	jQuery("#speed").html(speed);
	    	jQuery("#distance").html(distance);
	    	jQuery("#runstep").html(runStep);
	    	jQuery("#walkstep").html(walkStep);
	    	jQuery("#walkfreq").html(walkFrequency);
    	}
    	
    	function onerrorCB(error){
    		alert(error.message);
    	}
    	
    	function onSuccessCB(pedometerInfo){
    		alert("success");
    		alert(JSON.stringify(pedometerInfo));
    	}
    	 
    	webapis.motion.start("PEDOMETER", onchangedCB, onerrorCB);
    	//webapis.motion.setPedometerListener(onchangedCB);
    	
    	jQuery("#status").html(stepStatus);
		jQuery("#calories").html(calories);
		jQuery("#tsteps").html(totalStep);
		jQuery("#speed").html(speed);
		jQuery("#distance").html(distance);
		jQuery("#runstep").html(runStep);
		jQuery("#walkstep").html(walkStep);
		jQuery("#walkfreq").html(walkFrequency);
    }
    
    function stopSensors() {
    	alert("stop collecting");
    	document.removeEventListener("devicemotion", function(){motionFile.closeStream();});
    	//clearInterval(tizenLocalInterval);
    	lightSensor.stop();
    	webapis.motion.stop("HRM");
    	webapis.motion.stop("PEDOMETER");
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
