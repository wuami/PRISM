if (storage.getItem("login") == "successful") {
        storage.removeItem("login");
        jQuery("#notification").show();
        jQuery("#successLogin").show();
      }

      if (storage.getItem("insight") == "successful") {
        storage.removeItem("insight");
        jQuery("#notification").show();
        jQuery("#successInsight").show();
      }

      jQuery(document).ready(function(){
        var log = document.getElementById("log");
        var keyDetails = "";
        var keyTime = "";
        var bigramTime = "";
        var bigramDetails = "";
        var prevDownTime = new Date();
        var createTime = prevDownTime;
        var prevKey = 0;
        var keysPressed = 0;
        var numberOfEnters = 0;
        var numberOfBacks = 0;
        var numberOfDeletes = 0;
        var numberOfUndos = 0;
        var numberOfRedos = 0;
        var commandKey = false;

        jQuery.getScript("js/monitor_mouse.js", function(){
           console.log("Script loaded and executed.");
        });

        jQuery("#insightInput").keydown(function(event) {
          start = new Date();
          if (event.which == 13) { // enter
            numberOfEnters += 1;
          } else if (event.which == 8 || event.which == 46) {
            numberOfBacks += 1;
          } 
          if (keysPressed > 0) {
            interKeyLatency = start.getTime()-prevDownTime.getTime();
            bigramTime += interKeyLatency + ":";
            bigramDetails += prevKey + "-" + event.which + ":";
            if (prevKey == 224 || prevKey == 17 || prevKey == 91 || prevKey == 93) 
                commandKey = true;
            if (commandKey && event.which == 90) {
              numberOfUndos += 1;
            } else if (commandKey && event.which == 89) {
              numberOfRedos += 1;
            } 
          }
          prevDownTime = start;
          prevKey = event.which;
          keysPressed++;
        }).keyup(function(event) {
          end = new Date();
          interval = end.getTime() - start.getTime(); // interval in milliseconds
          keyDetails += event.which + ":";
          keyTime += interval + ":";
        });
      
        jQuery("#insightSub").click(function(){
          end = new Date();
          totaltime = end.getTime() - createTime.getTime();
          textInput = jQuery("textarea#insightInput").val();
          sadnessLevel = jQuery('input[name=inlineRadioOptions]:checked').val();
          tiredLevel = jQuery('input[name=inlineRadioOptions1]:checked').val();
          anxietyLevel = jQuery('input[name=inlineRadioOptions2]:checked').val();
          
          //alert(sadnessLevel);
          if (typeof(sadnessLevel) === 'undefined' || typeof(tiredLevel) === 'undefined' || typeof(anxietyLevel) === 'undefined' || textInput == '')
            alert("Please tell us how you feel");
          else {
            logInteractions();
            jQuery.post("submitInsight.php", {
              "textInput": textInput,
              "keyDetails": keyDetails,
              "keyTime": keyTime,
              "bigramDetails": bigramDetails,
              "bigramTime": bigramTime,
              "numberOfEnters": numberOfEnters,
              "numberOfUndos": numberOfUndos,
              "numberOfBacks": numberOfBacks,
              "numberOfRedos": numberOfRedos,
              "totaltime": totaltime,
              "feels": sadnessLevel,
              "energy": tiredLevel,
              "relax": anxietyLevel,
              "currenttime": end.getTime()
              }, function(data) {
                if (jQuery.trim(data) == 'success') {
                  storage.setItem("insight", "successful")
                  location.reload();
                } else {
                  alert(data);
                }
            });
          }
          /*log.innerHTML += "<div>" + keyDetails + "<br>" +  keyTime + "</div>";
          log.innerHTML += "<div>" + bigramDetails + "<br>" +  bigramTime + "</div>";
          log.innerHTML += "<div>Number of enters<br>" +  numberOfEnters + "</div>";
          log.innerHTML += "<div>Number of backs<br>" +  numberOfBacks + "</div>";
          log.innerHTML += "<div>Number of undos<br>" +  numberOfUndos + "</div>";
          log.innerHTML += "<div>Time Taken<br>" +  totaltime + "</div>";
          log.innerHTML += "<div>text<br>" +  textInput + "</div>";*/
        });
      });