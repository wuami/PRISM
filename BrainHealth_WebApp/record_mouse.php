<?php include('session_check.php')?>
<!DOCTYPE html>
<html lang="en-US">
<head>
    <?php include('header.php'); ?>
</head>

<body>
<script type="text/javascript">
var prevPos;
var prevTime;
var origPos;
var origTime;
var totalLogged;
var totalClicks;
var totalDist = 0;
var totalDragPos = 0;
var totalDragTime = 0;
var localtrigger =0;
var dragPos = "";
var dragTime = "";
var isDragging = false;
var posLog = "", timeLog = "0:";

function setVars () {
    prevPos = null; 
    prevTime = null; 
    origPos = null;
    origTime = null;
    totalLogged = null;
    totalClicks = null;
    totalDist = 0;
    totalDragPos = 0;
    totalDragTime = 0;
    localtrigger =0;
    dragPos = "";
    dragTime = "";
    isDragging = false;
    posLog = ""; 
    timeLog = "0:";
}

setVars();

(function() {
    var mousePos = {x: -1, y: -1};

    document.onmousemove = handleMouseMove;
    //document.touchstart = handleMouseMove;
    setInterval(getMousePosition, 100); // setInterval repeats every X ms
    setInterval(logInteractions, 10000); // log interactions every 10 seconds or every 100 events whichever comes first
    document.onmousedown = handleMouseDown;
    document.onmouseup = handleMouseUp;
    

    function handleMouseDown(event) {
        totalClicks++;
        localtrigger = 0;
        isDragging = true;
    }

    function handleMouseUp(event) {
        if (isDragging) {
            //console.log(isDragging);
            getMousePosition();
            isDragging = false;
        }
    }

    function handleMouseMove(event) {
        var dot, eventDoc, doc, body, pageX, pageY;

        event = event || window.event; // IE-ism

        // If pageX/Y aren't available and clientX/Y are,
        // calculate pageX/Y - logic taken from jQuery.
        // (This is to support old IE)
        if (event.pageX == null && event.clientX != null) {
            eventDoc = (event.target && event.target.ownerDocument) || document;
            doc = eventDoc.documentElement;
            body = eventDoc.body;

            event.pageX = event.clientX +
              (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
              (doc && doc.clientLeft || body && body.clientLeft || 0);
            event.pageY = event.clientY +
              (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
              (doc && doc.clientTop  || body && body.clientTop  || 0 );
        }

        mousePos = {
            x: event.pageX,
            y: event.pageY
        };
    }

    function getMousePosition() {
        if (totalLogged > 100) {
            logInteractions();
        }
        var pos = mousePos;

        if (pos && prevPos) {
            if (pos.x != prevPos.x || pos.y != prevPos.y) {
                var time = new Date();
                dist = Math.pow(pos.x-prevPos.x, 2) + Math.pow(pos.y-prevPos.y, 2);
                totalDist = totalDist + dist;
                var timeTaken = time.getTime() - prevTime.getTime();
                //var speed = Math.round(Math.sqrt(dist)/timeTaken*10000)/10000;   
                prevPos = pos;
                prevTime = time;
                //console.log(dist + "\t" + speed + "\t" + timeTaken);
                timeLog = timeLog + timeTaken + ":";
                posLog = posLog + pos.x + "-" + pos.y + ":";
                //console.log(timeLog);
                if (isDragging) {
                    if (localtrigger > 0) {
                        dragTime = dragTime + timeTaken + ":";
                        dragPos = dragPos + pos.x + "-" + pos.y + ":";
                        totalDragPos = totalDragPos + dist
                        totalDragTime = totalDragTime + timeTaken;
                    } else {
                        // Start new drag round
                        dragTime = dragTime + ":" + 0 + ":";
                        dragPos = dragPos + ":" + pos.x + "-" + pos.y + ":";
                    }   
                    //console.log("drag \t"+totalDragTime+ "\t" + timeTaken);
                    localtrigger++;
                }
                totalLogged++;
            }
        } else {
            prevTime = new Date();
            origPos = pos;
            posLog = pos.x + "-" + pos.y;
            origTime = prevTime;
        }
        if(pos.x > -1 && pos.y > -1) {
            prevPos = pos;
        }        
    }
})();

function logInteractions () {
    //console.log(totalDragPos);
    var totalTime = prevTime.getTime() - origTime.getTime();
    var avgSpeed = Math.round((Math.sqrt(totalDist)/totalTime)*10000)/10000;
    var avgDragSpeed = Math.round((Math.sqrt(totalDragPos)/totalDragTime)*10000)/10000;

    if (totalDist > 0) {
        //console.log(totalDist + "\t" + avgSpeed + "\t" + totalTime);
        jQuery.post("submitInteractions.php", {
            "poslog1": posLog,
            "timelog1": timeLog,
            "totalLog1": totalLogged,
            "avgSpeed1": avgSpeed,
            "totaltime1": totalTime,
            "totalclicks1": totalClicks,
            "avgdragvel": avgDragSpeed, 
            "totaldragtime": totalDragTime,
            "dragposlog1": dragPos,
            "dragtimelog1": dragTime,
            "screenwidth": jQuery(window).width(),
            "screenheight": jQuery(window).height(), 
            "currentpage": window.location.pathname
        }, function(data) {
            if (jQuery.trim(data) == 'success') {
                setVars();
            }
            if (storage.getItem('action') != null && storage.getItem('action') != '') {
                var redirectUrl = storage.getItem('action');
                storage.removeItem('action');
                window.location = redirectUrl;
            }
        });
    }   
}

jQuery("#writeLink").click(function(event) {
    event.preventDefault();
    logInteractions();
    window.location = "index.php"
});

jQuery("#exploreLink").click(function(event) {
    event.preventDefault();
    logInteractions();
    window.location = "explore.php"
});

</script>
</body>
</html>