jQuery(document).ready(function(){
    var timeSlots = [];
    var mostRecent = "";
    var uniqueTimeLoc = [];
    
    d3.tsv("explore_retrieve.php?option=all", function(data) {    
        for (entry in data) {
            var timestampParts = data[entry]["upload"].split(" ");
            if (timestampParts.length >  1) {
                if (typeof timeSlots[timestampParts[0]] === "undefined") {
                    timeSlots[timestampParts[0]] = {"times": [timestampParts[1]]};
                    uniqueTimeLoc.push(timestampParts[0]);
                    mostRecent = timestampParts[0];
                } else  {
                    timeSlots[timestampParts[0]]["times"].push(timestampParts[1])
                }
            }
        }
        console.log(mostRecent);
        for (time = uniqueTimeLoc.length; time > 0; time--) {
            jQuery("#loggeddays").append("<option value=" + uniqueTimeLoc[time-1] + ">"+ getCustomDate(uniqueTimeLoc[time-1]) + "</option>");
        }
    });

    var width = 0.95*window.innerWidth;
    var height = 800; // window.innerHeight - 320 // window.innerHeight - 200
    var baseLength = 0.05;
    var baseHrmHeight = 1.5;
    var topHrmHeight = baseHrmHeight*200;
    var baseLlHeight = 0.2; 
    var topLlHeight = baseLlHeight*1500;
    var bottomHeight = 440;
    var bottomStepHeight = 240;
    var bottomAcceloHeight = 20;
    var stepsMultiplier = 10;
    var stepHeight = stepsMultiplier*18;
    //var speedMultiplier = 1;
    //var speedHeight = speedMultiplier*18;
    var accelMultiplier = 10;
    var rotatMultiplier = 0.5;
    var accelHeight = accelMultiplier*20;
    var rotatHeight = rotatMultiplier*400;

    var startTime = 8;
    var endTime = 24;
    var trackLength = (endTime-startTime)*3600*baseLength + 50;
    
    var colors = ["#000000", "#ffffff"];

    var trackCanvas = new Kinetic.Stage({
        container: 'trackCanvas',
        width: width,
        height: height, 
    });

    var lstaticTrackLayer = new Kinetic.Layer({
        width: 50
    });

    var rstaticTrackLayer = new Kinetic.Layer({
        x: width - 50,
        width: 50
    });

    var dynamicTrackLayer = new Kinetic.Layer({
        width: width - 100,
        x: 50,
        draggable: true,
        dragBoundFunc: function(pos) {
            var newX =  pos.x > 50 ? 50 : pos.x;
            return {
                x: newX,
                y: this.getAbsolutePosition().y
            }
        }
    });

    var legendLayer = new Kinetic.Layer({
        width: width-100,
        x: 50
    })

    var yAxis = new Kinetic.Line({
        points: [0, 0, 0, height],
        stroke: 'black',
        strokeWidth: 2,
        lineJoin: 'round',
        opacity: 0.1
    });

    dynamicTrackLayer.add(yAxis);

    var lstaticLayerBg = new Kinetic.Rect({
        x: 0,
        y: 0,
        width: 50,
        height: height,
        fill: '#fff',
        stroke: '#cccccc',
        opacity: 1,
        strokeWidth: 1
    });

    
    var rstaticLayerBg = new Kinetic.Rect({
        x: 0,
        y: 0,
        width: 50,
        height: height,
        fill: '#fff',
        stroke: '#cccccc',
        opacity: 1,
        strokeWidth: 1
    });

    var hrmRangeVals = new Kinetic.Group();
    for (i = 0; i < 11; i++) {
        var valLoc = height - bottomHeight - i*30 - 18;
        var hrmPrint = i*20;
        var hrmVal = new Kinetic.Text({
            x: 0,
            y: valLoc,
            text: hrmPrint,
            fontSize: 16,
            fontFamily: 'Calibri',
            fill: '#C10000',
            width: 50,
            fontStyle: "bold",
            padding: 10,
            align: 'right'
        });
        hrmRangeVals.add(hrmVal);
    }

    var llRangeVals = new Kinetic.Group();
    for (i = 0; i < 11; i++) {
        var valLoc = height - bottomHeight - i*30 - 15;
        var llPrint = i*150;
        var llVal = new Kinetic.Text({
            x: 0,
            y: valLoc,
            text: llPrint,
            fontSize: 16,
            fontFamily: 'Calibri',
            fill: '#F6CD03',
            width: 100,
            fontStyle: "bold",
            padding: 6,
            align: 'left'
        });
        llRangeVals.add(llVal);
    }

    var stepRangeVals = new Kinetic.Group();
    for (i = 0; i < 7; i ++){
        var stepValLoc = height - bottomStepHeight - i*30 - 18;
        var stepValPrint = i*30;
        var stepVal = new Kinetic.Text({
            x: 0,
            y: stepValLoc,
            text: stepValPrint,
            fontSize: 16,
            fontFamily: 'Calibri',
            fill: '#000000',
            width: 50,
            fontStyle: "bold",
            padding: 10,
            align: 'right'
        });
        stepRangeVals.add(stepVal);
    }

    var accelRangeVals = new Kinetic.Group();
    for (i = 0; i < 9; i++) {
        var accelValLoc = height - bottomAcceloHeight - i*25 - 18;
        var accelPrint = i*2.5;
        var accelVal = new Kinetic.Text({
            x: 0,
            y: accelValLoc,
            text: accelPrint,
            fontSize: 16,
            fontFamily: 'Calibri',
            fill: '#191970',
            width: 50,
            fontStyle: "bold",
            padding: 10,
            align: 'right'
        });
        accelRangeVals.add(accelVal);
    }

    var gyroRangeVals = new Kinetic.Group();
    for (i = 0; i < 9; i++) {
        var gyroValLoc = height - bottomAcceloHeight - i*25 - 15;
        var gyroPrint = i*50;
        var gyroVal = new Kinetic.Text({
            x: 0,
            y: gyroValLoc,
            text: gyroPrint,
            fontSize: 16,
            fontFamily: 'Calibri',
            fill: '#ff1493',
            width: 100,
            fontStyle: "bold",
            padding: 6,
            align: 'left'
        });
        gyroRangeVals.add(gyroVal);
    }

    function getLegendText(x, y, width, text) {
        var legendText = new Kinetic.Text({
            x: x,
            y: y,
            text: text,
            fontSize: 16,
            fontFamily: 'Calibri',
            fill: '#000000',
            width: width,
            fontStyle: "bold",
            padding: 6,
            align: 'left'
        });
        return legendText;
    }

    function getLegendBox(x, y, width){
        var legendBox = new Kinetic.Rect({
            x: x,
            y: y,
            width: width,
            height: 30,
            fill: '#ffffff',
            stroke: '#000000'
        });
        return legendBox;
    }

    function getLegendLine(x,y,fill, stroke) {
        var legendLine = new Kinetic.Line({
            points: [x, y, x+20, y],
            fill: fill,
            stroke: fill,
            strokeWidth: stroke,
            lineJoin: 'round',
        }); 
        return legendLine;
    }

    legendLayer.add(getLegendBox(width-520, 60, 360));
    legendLayer.add(getLegendLine(width-510, 75, "#C10000", 5));
    legendLayer.add(getLegendText(width-490, 60, 300, "Heartrate - Beats per minute"));
    legendLayer.add(getLegendLine(width-280, 75, "#F6CD03", 5));
    legendLayer.add(getLegendText(width-260, 60, 300, "Light Values"));

    legendLayer.add(getLegendBox(width-520, 380, 380));
    legendLayer.add(getLegendLine(width-510, 395, "#00ff00", 20));
    legendLayer.add(getLegendText(width-490, 380, 300, "Walk Steps per minute"));
    legendLayer.add(getLegendLine(width-320, 395, "#0000ff", 20));
    legendLayer.add(getLegendText(width-300, 380, 300, "Run Steps per minute"));

    legendLayer.add(getLegendBox(width-520, 580, 300));
    legendLayer.add(getLegendLine(width-510, 595, "#191970", 5));
    legendLayer.add(getLegendText(width-490, 580, 300, "Net Acceleration"));
    legendLayer.add(getLegendLine(width-360, 595, "#ff1493", 5));
    legendLayer.add(getLegendText(width-340, 580, 300, "Net Rotation"));

    lstaticTrackLayer.add(lstaticLayerBg);
    rstaticTrackLayer.add(rstaticLayerBg);
    lstaticTrackLayer.add(hrmRangeVals);
    lstaticTrackLayer.add(stepRangeVals);
    lstaticTrackLayer.add(accelRangeVals);
    rstaticTrackLayer.add(llRangeVals);
    rstaticTrackLayer.add(gyroRangeVals);
    trackCanvas.add(dynamicTrackLayer);
    trackCanvas.add(lstaticTrackLayer);
    trackCanvas.add(rstaticTrackLayer);
    trackCanvas.add(legendLayer);

    var linearTimeGroup = new Kinetic.Group();
    var trackGroup = new Kinetic.Group();
    var hrmLineGroup = new Kinetic.Group();
    var llLineGroup = new Kinetic.Group();
    var walkGroup = new Kinetic.Group();
    var totalGroup = new Kinetic.Group();
    var stepGroup = new Kinetic.Group();
    var acceloDivGroup = new Kinetic.Group();
    var acceloGroup = new Kinetic.Group();
    var rotatoGroup = new Kinetic.Group();

    var completedLength = 0;
    for (i = startTime; i < endTime; i++) {
        var timeElem = new Kinetic.Rect({
            x: completedLength,
            y: 0,
            width: baseLength*3600,
            height: 50,
            fill: "#ffffff",
            stroke: 'black',
            opacity: 0.75,
              //  strokeEnabled: false
        });
        
        linearTimeGroup.add(timeElem);
        for (k = 1; k < 6; k ++) {
            var xVal = completedLength + k*600*baseLength;
            var tenMinDivider = new Kinetic.Line({
                points: [xVal, 50, xVal, 30],
                stroke: 'black',
                strokeWidth: 1,
                lineJoin: 'round'
            });
            linearTimeGroup.add(tenMinDivider);
        }

        var timePrint = (i > 12) ? (i-12) + " PM" : ((i < 12) ? i + " AM" : i + " PM");
        var timeText = new Kinetic.Text({
            x: completedLength,
            y: 0,
            text: timePrint,
            fontSize: 16,
            fontFamily: 'Calibri',
            fill: '#000',
            width: 200,
            padding: 10
        });
        linearTimeGroup.add(timeText);

        completedLength = baseLength*3600 + completedLength;
    }

    var dynamicLayerBg = new Kinetic.Rect({
        x: 0,
        y: 0,
        width: completedLength,
        height: height,
        fill: '#ccc',
        stroke: '#cccccc',
        opacity: 0.1,
        strokeWidth: 1
    });

    dynamicTrackLayer.add(dynamicLayerBg);

    for (i = 0; i < 11; i++) {
        var dividerHeight = height - bottomHeight - i*30;
        var canvasDivider = new Kinetic.Line({
            points: [0, dividerHeight, completedLength, dividerHeight],
            stroke: "#ccc",
            strokeWidth: 1,
            lineJoin: 'round'
        });
        trackGroup.add(canvasDivider);
    }

    for (i = 0; i < 7; i++) {
        var dividerHeight = height - bottomStepHeight - i*30;
        var canvasDivider = new Kinetic.Line({
            points: [0, dividerHeight, completedLength, dividerHeight],
            stroke: "#ccc",
            strokeWidth: 1,
            lineJoin: 'round'
        });
        stepGroup.add(canvasDivider);
    }

    for (i = 0; i < 9; i++) {
        var dividerHeight = height - bottomAcceloHeight - i*25;
        var canvasDivider = new Kinetic.Line({
            points: [0, dividerHeight, completedLength, dividerHeight],
            stroke: "#ccc",
            strokeWidth: 1,
            lineJoin: 'round'
        });
        acceloDivGroup.add(canvasDivider);
    }

    dynamicTrackLayer.add(trackGroup);
    dynamicTrackLayer.add(stepGroup);
    dynamicTrackLayer.add(acceloDivGroup);
    dynamicTrackLayer.add(linearTimeGroup);

    var fXAxis = new Kinetic.Line({
        points: [0, height-bottomHeight+10, completedLength, height-bottomHeight+10],
        stroke: 'black',
        strokeWidth: 2,
        lineJoin: 'round',
        opacity: 1
    });

    var fXAxis1 = new Kinetic.Line({
        points: [0, height-bottomStepHeight+10, completedLength, height-bottomStepHeight+10],
        stroke: 'black',
        strokeWidth: 2,
        lineJoin: 'round',
        opacity: 1
    });

    dynamicTrackLayer.add(fXAxis);
    dynamicTrackLayer.add(fXAxis1);
    dynamicTrackLayer.draw();

    function drawMultiPlot(dataPoints, lineColor, fillColor, strokeWidth, tension, isClosed) {
        var multiLineSeg = new Kinetic.Group();

        var dataLineSegment = new Kinetic.Line({
            points: dataPoints,
            fill: fillColor,
            stroke: lineColor,
            strokeWidth: strokeWidth,
            lineJoin: 'round',
            closed: isClosed,
            tension: tension
        });

        multiLineSeg.add(dataLineSegment);
        return multiLineSeg;
    }
   
    function visualize_tracks(data) {
        //console.log(data);
        var prevTimeStamp = null;
        var prevDataEntry = null;
        var prevWalkSteps = -1;
        var prevWalkLogTime = null;
        var prevTotalSteps = -1;
        var prevTotalLogTime = null;
        var currentDay = null;
        var hrmPoints = [];
        var lightPoints = [];
        var accelPoints = [];
        var rotatPoints = [];

        var walkPoints = [];
        var totalPoints = [];

        for (entry = 0; entry < data.length; entry++) {
            var timestampParts = data[entry].TimeStamp.split(" ");
            if (timestampParts.length >  1) {
                var dayParts = timestampParts[0].split("-");
                var timeParts = timestampParts[1].split(":");
                //new Date(year, month, day, hours, minutes, seconds, milliseconds) 
                var newTimeStamp = new Date(dayParts[0], dayParts[1], dayParts[2], timeParts[0], timeParts[1], 0, 0);
                var hour = startTime;
                hour = parseInt(timeParts[0]) - startTime;

                if (hour < 0 || hour > (endTime-startTime))
                    continue;
                
                var xCoordinate = (hour*3600+ parseInt(timeParts[1])*60)*baseLength;
                //console.log(newTimeStamp);
                var hrmVal = data[entry].Heartrate;
                if (hrmVal == "NA" || hrmVal == "0" || entry == data.length-1) {
                    if (hrmPoints.length > 2) {
                        var visPointGroup = drawMultiPlot(hrmPoints, "#C10000");
                        hrmLineGroup.add(visPointGroup);
                        hrmPoints = [];
                    } else if (hrmPoints.length == 2) {
                        var singlePoint = new Kinetic.Ring({
                            innerRadius: 1,
                            outerRadius: 2,
                            x: hrmPoints[0],
                            y: hrmPoints[1],
                            stroke: "#C10000",
                            strokeWidth: 1
                        });
                        hrmLineGroup.add(singlePoint);
                        hrmPoints = [];
                    }
                } else {
                    var yCoordinate = height - bottomHeight - baseHrmHeight*parseFloat(hrmVal);
                    if (yCoordinate < height - bottomHeight - topHrmHeight)
                        yCoordinate = height - bottomHeight - topHrmHeight;

                    hrmPoints.push(xCoordinate);
                    hrmPoints.push(yCoordinate);
                    //console.log(entry + "-" + hrmPoints.length);
                }

                var llVal = data[entry].Light;
                if (llVal == "NA" || entry == data.length-1) {
                    if (lightPoints.length > 2) {
                        var visPointGroup = drawMultiPlot(lightPoints, "#F6CD03");
                        llLineGroup.add(visPointGroup);
                        lightPoints = [];
                    } else if (lightPoints.length == 2) {
                        var singlePoint = new Kinetic.Circle({
                            innerRadius: 1,
                            outerRadius: 2,
                            x: lightPoints[0],
                            y: lightPoints[1],
                            stroke: "#F6CD03",
                            strokeWidth: 1
                        });
                        llLineGroup.add(singlePoint);
                        llPoints = [];
                    }
                } else {
                    var yCoordinate = height - bottomHeight - baseLlHeight*parseFloat(llVal);
                    if (yCoordinate < height - bottomHeight - topLlHeight)
                        yCoordinate = height - bottomHeight - topLlHeight;
                    lightPoints.push(xCoordinate);
                    lightPoints.push(yCoordinate);
                }
                

                if (data[entry].Walk != "NA" && data[entry].Total != "NA") {
                    var totalSteps = parseFloat(data[entry].Total);
                    var walkSteps = parseFloat(data[entry].Walk);
                    if (prevWalkSteps == -1){
                        prevWalkSteps = walkSteps;
                        prevWalkLogTime = xCoordinate;
                        walkPoints.push(xCoordinate);
                        walkPoints.push(height-bottomStepHeight);
                    }
                    if (prevTotalSteps == -1){
                        prevTotalSteps = totalSteps;
                        prevTotalLogTime = xCoordinate;
                        totalPoints.push(xCoordinate);
                        totalPoints.push(height-bottomStepHeight);
                    }
                    if (prevWalkSteps != -1 && walkSteps != prevWalkSteps) {
                        var stepsWalked = walkSteps - prevWalkSteps;
                        var stepSpeed = stepsWalked/(xCoordinate-prevWalkLogTime);
                        var yCoordinate = height - bottomStepHeight - stepSpeed*stepsMultiplier;
                        if (yCoordinate < height - bottomStepHeight - stepHeight)
                            yCoordinate = height - bottomStepHeight - stepHeight;
                        walkPoints.push(prevWalkLogTime);
                        walkPoints.push(yCoordinate);
                        walkPoints.push(xCoordinate);
                        walkPoints.push(yCoordinate);
                        prevWalkSteps = walkSteps;
                        prevWalkLogTime = xCoordinate;
                    }
                    if (prevTotalSteps != -1 && totalSteps != prevTotalSteps) {
                        var stepsTotal = totalSteps - prevTotalSteps;
                        var stepTSpeed = stepsTotal/(xCoordinate-prevTotalLogTime);
                        var yCoordinate = height - bottomStepHeight - stepTSpeed*stepsMultiplier;
                        if (yCoordinate < height - bottomStepHeight - stepHeight)
                            yCoordinate = height - bottomStepHeight - stepHeight;
                        totalPoints.push(prevTotalLogTime);
                        totalPoints.push(yCoordinate);
                        totalPoints.push(xCoordinate);
                        totalPoints.push(yCoordinate);
                        prevTotalSteps = totalSteps;
                        prevTotalLogTime = xCoordinate;
                    }
                }

                var accelXVal = data[entry].accelx;
                var accelYVal = data[entry].accely;
                var accelZVal = data[entry].accelz;

                if (accelXVal == "NA" || accelYVal == "NA" || accelZVal == "NA" || entry == data.length-1) {
                    if (accelPoints.length > 2) {
                        var visPointGroup = drawMultiPlot(accelPoints, "#191970");
                        acceloGroup.add(visPointGroup);
                        accelPoints = [];
                    } else if (accelPoints.length == 2) {
                        var singlePoint = new Kinetic.Ring({
                            innerRadius: 1,
                            outerRadius: 2,
                            x: accelPoints[0],
                            y: accelPoints[1],
                            stroke: "#191970",
                            strokeWidth: 1
                        });
                        acceloGroup.add(singlePoint);
                        accelPoints = [];
                    }
                } else {
                    var accelActualValue = Math.sqrt(Math.pow(parseFloat(accelXVal),2) + Math.pow(parseFloat(accelYVal),2) + Math.pow(parseFloat(accelZVal),2));
                    //console.log(accelActualValue);
                    var yCoordinate = height - bottomAcceloHeight - accelMultiplier*accelActualValue;
                    if (yCoordinate < height - bottomAcceloHeight - accelHeight)
                        yCoordinate = height - bottomAcceloHeight - accelHeight;

                    accelPoints.push(xCoordinate);
                    accelPoints.push(yCoordinate);
                    //console.log(entry + "-" + accelPoints.length);
                }

                var rotatAVal = data[entry].rotata;
                var rotatBVal = data[entry].rotatb;
                var rotatCVal = data[entry].rotatc;

                if (rotatAVal == "NA" || rotatBVal == "NA" || rotatCVal == "NA" || entry == data.length-1) {
                    if (rotatPoints.length > 2) {
                        var visPointGroup = drawMultiPlot(rotatPoints, "#ff1493");
                        rotatoGroup.add(visPointGroup);
                        rotatPoints = [];
                    } else if (rotatPoints.length == 2) {
                        var singlePoint = new Kinetic.Ring({
                            innerRadius: 1,
                            outerRadius: 2,
                            x: rotatPoints[0],
                            y: rotatPoints[1],
                            stroke: "#ff1493",
                            strokeWidth: 1
                        });
                        rotatoGroup.add(singlePoint);
                        rotatPoints = [];
                    }
                } else {
                    var rotatActualValue = Math.sqrt(Math.pow(parseFloat(rotatAVal),2) + Math.pow(parseFloat(rotatBVal),2) + Math.pow(parseFloat(rotatCVal),2));
                    //console.log(rotatActualValue);
                    var yCoordinate = height - bottomAcceloHeight - rotatMultiplier*rotatActualValue;
                    if (yCoordinate < height - bottomAcceloHeight - rotatHeight)
                        yCoordinate = height - bottomAcceloHeight - rotatHeight;

                    rotatPoints.push(xCoordinate);
                    rotatPoints.push(yCoordinate);
                    //console.log(entry + "-" + rotatPoints.length);
                }
                
                if (prevTimeStamp != null)
                    var timeDiff = newTimeStamp.getTime() - prevTimeStamp.getTime();
                prevTimeStamp = newTimeStamp; 
                //console.log(data[entry].Heartrate);
            }
        }
        

        if (hrmPoints.length > 0) {
            var visPointGroup = drawMultiPlot(hrmPoints, "#C10000", "#C10000", 3, 0.1);
            hrmLineGroup.add(visPointGroup);
        }
        if (lightPoints.length > 0) {
            var visPointGroup = drawMultiPlot(lightPoints, "#F6CD03", "#F6CD03", 3, 0.2);
            llLineGroup.add(visPointGroup);
        }
        if (accelPoints.length > 0) {
            var visPointGroup = drawMultiPlot(accelPoints, "#191970", "#191970", 3, 0.1);
            acceloGroup.add(visPointGroup);
        }
        if (rotatPoints.length > 0) {
            var visPointGroup = drawMultiPlot(rotatPoints, "#ff1493", "#ff1493", 3, 0.1);
            rotatoGroup.add(visPointGroup);
        }

        if (walkPoints.length > 0) {
            walkPoints.push(walkPoints[walkPoints.length-2]);
            walkPoints.push(walkPoints[1]);
            walkPoints.push(walkPoints[0]);
            walkPoints.push(walkPoints[1]);
            var visPointGroup = drawMultiPlot(walkPoints, "#000000", "#00ff00", 1, 0, true);
            walkGroup.add(visPointGroup);
        }
        if (totalPoints.length > 0) {
            totalPoints.push(totalPoints[totalPoints.length-2]);
            totalPoints.push(totalPoints[1]);
            totalPoints.push(totalPoints[0]);
            totalPoints.push(totalPoints[1]);
            var visPointGroup = drawMultiPlot(totalPoints, "#0000ff", "#0000ff", 1, 0, true);
            totalGroup.add(visPointGroup);
        }

        dynamicTrackLayer.add(totalGroup);
        dynamicTrackLayer.add(walkGroup);
        dynamicTrackLayer.add(llLineGroup);
        dynamicTrackLayer.add(hrmLineGroup);
        dynamicTrackLayer.add(acceloGroup);
        dynamicTrackLayer.add(rotatoGroup);
        dynamicTrackLayer.draw();
    }

    function getUserData(timeSel) {
        hrmLineGroup.destroyChildren();
        llLineGroup.destroyChildren();
        totalGroup.destroyChildren();
        walkGroup.destroyChildren();
        acceloGroup.destroyChildren();
        rotatoGroup.destroyChildren();
        
        var desiredTslots = "";
        var recTimes = timeSlots[timeSel]["times"];
        for (ref in recTimes) {
            desiredTslots = desiredTslots + "\"" + timeSel + " " + recTimes[ref] + "\",";
        }
        d3.tsv("explore_retrieve.php?option=spec&timeslots=" + desiredTslots.substring(0, desiredTslots.length-1), function(data) {
            visualize_tracks(data);
        });
    }

    function getCustomDate(timeSel) {
        // Custom date configuration due to the way data is uploaded - remove when better
        // This is super dirty
        var timeParts = timeSel.split("-");
        var newDay = parseInt(timeParts[2])-1;
        var newDate = timeParts[0] + "-" + (newDay == 0 ? "05": timeParts[1]) + "-" + (newDay == 0 ? 31: newDay);
        // ------------------------
        return newDate;
    }



    ///-------------------- Keycode processing and visualization
    var keyCodes = [];
    var keyPadRowWidth = 14.5;
    var keyRows = [];
    var keyStrokeData = [];
    for (i = 1; i < 7; i++) {
        keyRows[i] = [];
        for (j =1; j < 15; j++) {
            keyRows[i][j] = "";
        }
    }
    
    var heatmapInstance;
    var latencyCanvas;

    d3.tsv("data/keycodes.tsv", function (data) {
        for (entry in data) {
            keyCodes[data[entry].KeyCode] = {"keyname": data[entry].KeyName, "row": parseInt(data[entry].Row), "column": parseInt(data[entry].Column), "width": parseFloat(data[entry].Width)};
            keyRows[data[entry].Row][data[entry].Column] = data[entry].KeyCode;
        }
        //console.log(keyCodes);
        //console.log(keyRows);
    });

    function getUserKeyData(timeSel) {
        var newDate = getCustomDate(timeSel);
        keyStrokeData = [];
        d3.tsv("explore_retrieve.php?option=keystroke&time=" + newDate, function (data) {
            jQuery("#loggedtimes").html("");
            var lastTime = "";
            for (entry in data) {
                jQuery("#loggedtimes").append('<label class="radio-inline"><input type="radio" name="avTimes" id="avTimes" value="' + data[entry].Time+ '"> ' + data[entry].Time+ '</label>')
                keyStrokeData[data[entry].Time] = {"insight": data[entry].Insight, "keydetails": data[entry].KeyDetails, "keypresstime": data[entry].KeyPressTime, "keybigramDetails": data[entry].KeyBigramDetails, "keybigramtimes": data[entry].KeyBigramTimeDiff};
                lastTime = data[entry].Time;
            }
            setTimeout(function() { 
                visualizeKeyHeatmap(lastTime);
            }, 1000);
        });
    }

    function visualizeKeyHeatmap(time) {
        jQuery("#keyStrokeView").html('<img src="img/keyboard.jpg" width="100%">');
        heatmapInstance = h337.create({
            container: document.querySelector('.keyheatmap')
        });

        var toBeVisualizedData = keyStrokeData[time];
        //console.log(time);
        jQuery("#insighttext").html("<h3>" + toBeVisualizedData["insight"] + "</h3>");

        var keys = toBeVisualizedData["keydetails"].split(":");
        var keyPressTimes = toBeVisualizedData["keypresstime"].split(":");

        var points = [];
        var max = 0;
        var width = jQuery("#keyStrokeView").width();
        var height = jQuery("#keyStrokeView").height();
        var enteredKeyCodes = [];

        for (k in keys) {
            if (keys[k] != "" && keyPressTimes[k] != "") {
                var keyCodeInfo = keyCodes[keys[k]];
                if (typeof keyCodeInfo !== "undefined") {
                    if (typeof enteredKeyCodes[keys[k]] !== "undefined") {
                        var newAvgTime = (enteredKeyCodes[keys[k]]["time"]*enteredKeyCodes[keys[k]]["clicks"] + parseInt(keyPressTimes[k]))/(enteredKeyCodes[keys[k]]["clicks"]+1);
                        enteredKeyCodes[keys[k]] = {"time": newAvgTime, "clicks": enteredKeyCodes[keys[k]]["clicks"] + 1, "xCoordinate": "", "yCoordinate": ""};
                    } else {
                        enteredKeyCodes[keys[k]] = {"time": parseInt(keyPressTimes[k]), "clicks": 1, "xCoordinate": "", "yCoordinate": ""};
                    }
                } else 
                    console.log(keys[k] + "-" + keyPressTimes[k]);
            }
        }
        //console.log(enteredKeyCodes);
        /*for (k in keyRows[2]) {
            if (keyRows[2][k] != "")
                console.log(keyCodes[keyRows[2][k]]["keyname"] + "\t" + keyCodes[keyRows[2][k]]["width"]);
        }*/
        for (k in enteredKeyCodes) {
            var val = Math.floor(Math.sqrt(enteredKeyCodes[k]["time"]*10));
            var radius = Math.floor(Math.sqrt(enteredKeyCodes[k]["clicks"]*400));

            var keyCodeInfo = keyCodes[k];
            var totalLength = 0;
            for (key in keyRows[keyCodeInfo["row"]]) {
                var pos = keyRows[keyCodeInfo["row"]][key];
                if (pos == k) break;
                totalLength = pos == "" ? totalLength + 1 : totalLength + keyCodes[pos]["width"];
            }


            totalLength = totalLength+keyCodeInfo["width"]/2;
            var xCoordinate = Math.floor(totalLength*width/keyPadRowWidth);
            var yCoordinate = Math.floor(keyCodeInfo["row"]*height/7)+10;
            enteredKeyCodes[k]["xCoordinate"] = xCoordinate;
            enteredKeyCodes[k]["yCoordinate"] = yCoordinate;
            //console.log(keyCodeInfo["keyname"] + "\t" + val + "\t" + radius + "\t" + yCoordinate);
            max = Math.max(max, val);
            var point = {
                x: xCoordinate,
                y: yCoordinate,
                value: val,
                radius: radius
            };
            points.push(point);
        }
   
        var data = { 
          max: max, 
          data: points 
        };
        heatmapInstance.setData(data);   

        latencyCanvas = new Kinetic.Stage({
            container: 'latencyCanvas',
            width: width,
            height: height, 
            opacity: 0.3
        });

        var latencyTrackLayer = new Kinetic.Layer({
            x:0,
            width: width
        });
        latencyCanvas.add(latencyTrackLayer);

        var movement = new Kinetic.Group();
        var bigrams = toBeVisualizedData["keybigramDetails"].split(":");
        var bigramTimes = toBeVisualizedData["keybigramtimes"].split(":");

        var paths = [];
        for (k in bigrams) {
            if (bigrams[k] != "" && bigramTimes[k] != "") {
                var keyInBigram = bigrams[k].split("-");
                if (typeof enteredKeyCodes[keyInBigram[0]] !== "undefined" && typeof enteredKeyCodes[keyInBigram[1]] != "undefined") {
                    if (typeof paths[bigrams[k]] !== "undefined") {
                        paths[bigrams[k]]["weight"] = (parseInt(bigramTimes[k]) + paths[bigrams[k]]["weight"]*paths[bigrams[k]]["times"])/(paths[bigrams[k]]["times"]+1);
                        paths[bigrams[k]]["times"] = paths[bigrams[k]]["times"] + 1;
                    } else {
                        paths[bigrams[k]] = {"x1": enteredKeyCodes[keyInBigram[0]]["xCoordinate"], "y1": enteredKeyCodes[keyInBigram[0]]["yCoordinate"], "x2": enteredKeyCodes[keyInBigram[1]]["xCoordinate"], "y2": enteredKeyCodes[keyInBigram[1]]["yCoordinate"], "weight": parseInt(bigramTimes[k]), "times": 1};
                    }
                } else continue;
            }
        }

        for (k in paths) {
            var pathLine = new Kinetic.Line({
                points: [paths[k]["x1"], paths[k]["y1"]+10, paths[k]["x2"], paths[k]["y2"]+10],
                stroke: '#333',
                fill: '#333',
                strokeWidth: Math.sqrt(paths[k]["weight"]),
                lineJoin: 'round',
                lineCap: 'round',
                opacity: 1.0
            });
            pathLine.tension(0.5);
            movement.add(pathLine);
        }

        latencyTrackLayer.add(movement);
        latencyTrackLayer.draw();
        
    }
   

    jQuery('#latencyControl').click(function () {
        if(this.checked) jQuery("#latencyCanvas").show();
        else jQuery("#latencyCanvas").hide();
    });
    
    //-------------------- Mouse interactions visualizations go here
    var mouseData = {"mousemovepaths": [], "mousedragpaths": [], "screenwidth": 0, "screenheight": 0};
    function getUserMouseData(timeSel, page) {
        var newDate = getCustomDate(timeSel);
        mouseData = {"mousemovepaths": [], "mousedragpaths": [], "screenwidth": 0, "screenheight": 0};
        d3.tsv("explore_retrieve.php?option=mouse&time=" + newDate + "&page=" + page, function (data) {
            var dragLocator = [];
            for (entry in data) {
                var prevPosition = {x: "", y: ""};
                var mousePositions = data[entry]["MouseMovePos"].split(":");
                var mouseTimes = data[entry]["MouseMoveTime"].split(":");
                mouseData["screenwidth"] = parseInt(data[entry]["ScreenWidth"]) == 0 ? window.innerWidth : parseInt(data[entry]["ScreenWidth"]);
                mouseData["screenheight"] = parseInt(data[entry]["screenheight"]) == 0 ? window.innerHeight : parseInt(data[entry]["ScreenHeight"]);
                for (k in mousePositions) {
                    if (mousePositions[k] != "" && mouseTimes[k] != "") {
                        var coordinates = mousePositions[k].split("-");
                        if (coordinates.length > 1) {
                            var currentPosition = {"x": parseInt(coordinates[0]), "y": parseInt(coordinates[1])};
                            if (k != 0 && prevPosition.x != "" && prevPosition.y != "") {
                                mouseData["mousemovepaths"].push({"x1": prevPosition.x, "y1": prevPosition.y, "x2": currentPosition.x, "y2": currentPosition.y, "time": parseInt(mouseTimes[k])});
                            } 
                            prevPosition = currentPosition;
                        }
                    }
                }

                var prevPosition = {x: "", y: ""};
                var mouseDragPositions = data[entry]["MouseDragPos"].split(":");
                var mouseDragTimes = data[entry]["MouseDragTime"].split(":");
                for (k in mouseDragPositions) {
                    if (mouseDragPositions[k] != "" && mouseDragTimes[k] != "") {
                        var coordinates = mouseDragPositions[k].split("-");
                        if (coordinates.length > 1) {
                            if (parseInt(mouseDragTimes[k]) == 0) {
                                mouseData["mousedragpaths"].push({"x": parseInt(coordinates[0]), "y": parseInt(coordinates[1]), "radius": 200, "val": 1000})
                            } else {
                                mouseData["mousedragpaths"].push({"x": parseInt(coordinates[0]), "y": parseInt(coordinates[1]), "radius": 200, "val": Math.sqrt(parseInt(mouseDragTimes[k]))})
                                mouseData["mousedragpaths"].push({"x": prevPosition.x, "y": prevPosition.y, "radius": 200, "val": Math.sqrt(parseInt(mouseDragTimes[k]))})
                            }  
                            prevPosition = {"x": parseInt(coordinates[0]), "y": parseInt(coordinates[1])};
                        } 
                    }
                }
            }
            setTimeout(function() { 
                visualizeMouseHeatmap(page);
            }, 1000);
        });
    }

    function visualizeMouseHeatmap(page) {
        var width = jQuery("#mouseStrokeView").width();
        var height = jQuery("#mouseStrokeView").height();
        if (page == "/BrainHealth/index.php")
            jQuery("#mouseStrokeView").html('<img src="img/screen.png" width="100%">');
        else
            jQuery("#mouseStrokeView").html('<img src="img/explore.png" width="100%">');
        mheatmapInstance = h337.create({
            container: document.querySelector('.mouseheatmap')
        });
        var points = [];
        var count = 0;
        var pointLocator = [];
        var max = 0;
        for (path in mouseData["mousemovepaths"]) {
            var currentPath = mouseData["mousemovepaths"][path];
            var xCoordinate1 = Math.floor(currentPath["x1"]*width/mouseData["screenwidth"]);
            var yCoordinate1 = Math.floor(currentPath["y1"]*height/mouseData["screenheight"]);
            var xCoordinate2 = Math.floor(currentPath["x2"]*width/mouseData["screenwidth"]);
            var yCoordinate2 = Math.floor(currentPath["y2"]*height/mouseData["screenheight"]);
            
            var midPoints = Math.ceil(currentPath["time"]/1000);
            var unitTime = Math.floor(currentPath["time"]/(midPoints+2));
            if (typeof pointLocator[xCoordinate1 + "-" + yCoordinate1] !== "undefined") {
                var newValue = points[pointLocator[xCoordinate1 + "-" + yCoordinate1]]["value"] + unitTime;
                points[pointLocator[xCoordinate1 + "-" + yCoordinate1]]["value"] = newValue;
                max = Math.max(max, newValue);
            } else {
                var point = {
                    x: xCoordinate1,
                    y: yCoordinate1,
                    value: Math.sqrt(unitTime),
                    radius: 20
                };
                points.push(point);
                pointLocator[xCoordinate1 + "-" + yCoordinate1] = count++;
                max = Math.max(max, unitTime);
            }
            
            for (k = 1; k < midPoints; k++) {
                if (xCoordinate2 > xCoordinate1) {
                    var midXCoordinate = Math.floor(xCoordinate1 + (xCoordinate2-xCoordinate1)*k/midPoints);
                    var midYCoordinate = Math.floor(yCoordinate1 + (yCoordinate2-yCoordinate1)*k/midPoints);
                } else {
                    var midXCoordinate = Math.floor(xCoordinate2 + (xCoordinate1-xCoordinate2)*k/midPoints);
                    var midYCoordinate = Math.floor(yCoordinate2 + (yCoordinate1-yCoordinate2)*k/midPoints);
                }
                if (typeof pointLocator[midXCoordinate + "-" + midYCoordinate] !== "undefined") {
                    var newValue = points[pointLocator[midXCoordinate + "-" + midYCoordinate]]["value"] + unitTime;
                    points[pointLocator[midXCoordinate + "-" + midYCoordinate]]["value"] = newValue;
                    max = Math.max(max, newValue);
                } else {
                    var point = {
                        x: midXCoordinate,
                        y: midYCoordinate,
                        value: Math.sqrt(unitTime),
                        radius: 20,
                        blur: .75,
                    }
                    points.push(point);
                    pointLocator[midXCoordinate + "-" + midYCoordinate] = count++;
                    max = Math.max(max, unitTime);
                }
            }

            if (typeof pointLocator[xCoordinate2 + "-" + yCoordinate2] !== "undefined") {
                var newValue = points[pointLocator[xCoordinate2 + "-" + yCoordinate2]]["value"] + unitTime;
                points[pointLocator[xCoordinate2 + "-" + yCoordinate2]]["value"] = newValue;
                max = Math.max(max, newValue);
            } else {
                var point = {
                    x: xCoordinate2,
                    y: yCoordinate2,
                    value: Math.sqrt(unitTime),
                    radius: 20
                };
                points.push(point);
                pointLocator[xCoordinate2 + "-" + yCoordinate2] = count++;
                max = Math.max(max, unitTime);
            }

        }

        console.log(mouseData["mousedragpaths"]);
        for (path in mouseData["mousedragpaths"]) {
            var currentPath = mouseData["mousedragpaths"][path];
            var xCoordinate = Math.floor(currentPath["x"]*width/mouseData["screenwidth"]);
            var yCoordinate = Math.floor(currentPath["y"]*height/mouseData["screenheight"]);
            var point = {
                x: xCoordinate,
                y: yCoordinate,
                value: currentPath["val"],
                radius: currentPath["radius"]
            };
            points.push(point);
            max = Math.max(max, currentPath["val"]);
        }

        var data = { 
          max: max, 
          data: points 
        };
        mheatmapInstance.setData(data);   
    }

    var myInterval = setInterval(function(){
        if (typeof timeSlots[mostRecent] !== "undefined") {
            clearInterval(myInterval);
            getUserData(mostRecent);
        }
    }, 1000);
    
   /* jQuery('#play').click(function() {
        playTrackCounter = setInterval(function(){
            var playWidth = dynamicTrackLayer.getAbsolutePosition().x-dynamicTrackLayer.getWidth()/10;
            dynamicTrackLayer.setAbsolutePosition(playWidth, dynamicTrackLayer.getAbsolutePosition().y);
            dynamicTrackLayer.draw();
            if(playWidth-dynamicTrackLayer.getWidth() < -trackLength) {
                clearInterval(playTrackCounter);
            }
        }, 1000);
    });

    jQuery('#stop').click(function() {
        clearInterval(playTrackCounter);
        dynamicTrackLayer.setAbsolutePosition(50, dynamicTrackLayer.getAbsolutePosition().y);
        dynamicTrackLayer.draw();
    })

    jQuery('#front').click(function() {
        var playWidth = dynamicTrackLayer.getAbsolutePosition().x-dynamicTrackLayer.getWidth();
        if(playWidth > -trackLength) {
            dynamicTrackLayer.setAbsolutePosition(playWidth, dynamicTrackLayer.getAbsolutePosition().y);
            dynamicTrackLayer.draw();
        }
    });

    jQuery('#back').click(function() {
        var playWidth = dynamicTrackLayer.getAbsolutePosition().x+dynamicTrackLayer.getWidth();
        if(playWidth-dynamicTrackLayer.getWidth() < 0){
            dynamicTrackLayer.setAbsolutePosition(playWidth, dynamicTrackLayer.getAbsolutePosition().y);
            dynamicTrackLayer.draw();
        }
    });*/

    jQuery("#loggeddays").change(function() {
        getUserData(this.value);
        getUserKeyData(this.value);
        getUserMouseData(this.value, "/BrainHealth/index.php");
    });

    jQuery("#brainViewTab").click(function() {
        var brainViewWidth = 0.3*window.innerWidth;
        jQuery("#brainview").load(
            "https://brainbrowser.cbrain.mcgill.ca/surface-viewer-widget?" + 
            "version=2.3.0&" + 
            "model=data/realct.obj&" + 
            "color_map=data/spectral.txt&" + 
            "intensity_data=data/realct.txt&" + 
            "width=" + brainViewWidth + "&" + 
            "height=" + brainViewWidth
        );
    });

    jQuery("#keyStrokeTab").click(function() {
        getUserKeyData(jQuery("#loggeddays").val());
        jQuery("#loggedtimes").click(function() {
            var radioVal = jQuery("input:radio[name ='avTimes']:checked").val();
            //alert(radioVal);
            visualizeKeyHeatmap(radioVal);
        });
    });

    jQuery("#mouseTab").click(function() {
        getUserMouseData(jQuery("#loggeddays").val(), "/BrainHealth/index.php");
        jQuery("#loggedpages").click(function() {
            var radioVal = jQuery("input:radio[name ='avPages']:checked").val();
            //alert(radioVal);
            getUserMouseData(jQuery("#loggeddays").val(), radioVal);
        });
    });

    jQuery('#insightTab').click(function() {
        jQuery("#insightCanvas").height("700px")
    });

    jQuery.getScript("js/monitor_mouse.js", function(){
       console.log("Script loaded and executed.");
    });
});