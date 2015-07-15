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

function logInteractions () {
    //console.log(totalDragPos);
    var totalTime = prevTime.getTime() - origTime.getTime();
    var avgSpeed = Math.round((Math.sqrt(totalDist)/totalTime)*1000000)/10000;
    var avgDragSpeed = Math.round((Math.sqrt(totalDragPos)/totalDragTime)*1000000)/10000;

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