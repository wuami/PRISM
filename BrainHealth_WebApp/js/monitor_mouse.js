var mousePos = {x: -1, y: -1};

    document.onmousemove = handleMouseMove;
    //document.touchstart = handleMouseMove;
    setInterval(getMousePosition, 100); // setInterval repeats every X ms
    setInterval(logInteractions, 20000); // log interactions every 10 seconds or every 100 events whichever comes first
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
            posLog = pos.x + "-" + pos.y + ":";
            origTime = prevTime;
        }
        if(pos.x > -1 && pos.y > -1) {
            prevPos = pos;
        }        
    }