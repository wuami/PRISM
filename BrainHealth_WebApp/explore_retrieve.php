<?php
	header("Content-Type: text/plain"); 
	include('session_check.php');
	include('connection.php');
	$option = $_GET["option"];
	if ($option == "all") {
		$query = "SELECT `upload_time` FROM `user_data` WHERE `userid`=45 ORDER BY `upload_time`";
		//$query = "SELECT `upload_time` FROM `user_data` WHERE `userid`=" . $_SESSION['userid'] . " ORDER BY `upload_time`";
		echo "upload\n";
        $data = mysql_query($query);
        while ($row = mysql_fetch_object($data)) {
           echo $row->upload_time . "\n";
        }
	} else if ($option == "spec") {
		$time = $_GET["timeslots"];
		$query = "SELECT `timestamp`, `heart_rate`, `light`, `peak2peak`, `walk_steps`, `total_steps`, `accelx`, `accely`, `accelz`, `rotata`, `rotatb`, `rotatc` FROM `user_data` WHERE `userid`=45 AND `upload_time` IN (". $time .") ORDER BY `upload_time`";
		//echo $query;
		//$query = "SELECT `timestamp`, `heart_rate`, `light`, `peak2peak`, `walk_steps`, `total_steps`, `accelx`, `accely`, `accelz`, `rotata`, `rotatb`, `rotatc` FROM `user_data` WHERE `userid`=" . $_SESSION['userid'] . " AND `upload_time` IN (". $time .") ORDER BY `upload_time`";
		//echo $query . '<br>';
		echo "TimeStamp\tLight\tHeartrate\tPeak2Peak\tWalk\tTotal\taccelx\taccely\taccelz\trotata\trotatb\trotatc\n";
		$data =  mysql_query($query);
	    while ($row = mysql_fetch_object($data)) {
	        $lightVals = explode(";", $row->light);
			$timeVals = explode(";", $row->timestamp);
			$heartVals = explode(";", $row->heart_rate);
			$p2pVals = explode(";", $row->peak2peak);
			$walksteps = explode(";", $row->walk_steps);
			$totalsteps = explode(";", $row->total_steps);
			$accelx = explode(";", $row->accelx);
			$accely = explode(";", $row->accely);
			$accelz = explode(";", $row->accelz);
			$rotata = explode(";", $row->rotata);
			$rotatb = explode(";", $row->rotatb);
			$rotatc = explode(";", $row->rotatc);
	        for ($i = 0 ; $i < count($timeVals); $i++) {
				echo $timeVals[$i] . "\t" . $lightVals[$i] . "\t" . $heartVals[$i] . "\t" . $p2pVals[$i] . "\t" . $walksteps[$i] . "\t" . $totalsteps[$i] . "\t" . $accelx[$i] . "\t" . $accely[$i] . "\t" . $accelz[$i] . "\t" . $rotata[$i] . "\t". $rotatb[$i] . "\t" . $rotatc[$i] . "\n";
			}
		}
    } else if ($option == "keystroke") {
    	$day = $_GET["time"];
    	$query = "SELECT `time`, `insight`, `key_details`, `key_press_time`, `keybigram_details`, `keybigram_timediff` FROM `user_insights` WHERE `userid` = 45 AND `time` > '". $day ." 00:00:00' AND `time` < '". $day ." 23:59:59'";
    	//$query = "SELECT `time`, `insight`, `key_details`, `key_press_time`, `keybigram_details`, `keybigram_timediff` FROM `user_insights` WHERE `userid` = " . $_SESSION['userid'] . " AND `time` > '". $day ." 00:00:00' AND `time` < '". $day ." 23:59:59'";
    	$data =  mysql_query($query);
    	echo "Time\tInsight\tKeyDetails\tKeyPressTime\tKeyBigramDetails\tKeyBigramTimeDiff\n";
    	while ($row = mysql_fetch_object($data)) {
    		echo $row->time . "\t" . mysql_real_escape_string($row->insight) . "\t" . $row->key_details . "\t" . $row->key_press_time . "\t" . $row->keybigram_details . "\t" . $row->keybigram_timediff . "\n";
    	}
    } else if ($option == "mouse") {
    	$day = $_GET["time"];
    	$page = $_GET["page"];
    	$query = "SELECT `mouse_move_position`, `mouse_move_time`, `mouse_drag_position`, `mouse_drag_time`, `user_screen_width`, `user_screen_height` FROM `mouse_interactions` WHERE `userid` = 45 AND `current_page`='" . $page . "' AND `time` > '". $day ." 00:00:00' AND `time` < '". $day ." 23:59:59'";
    	//echo $query;
    	//$query = "SELECT `mouse_move_position`, `mouse_move_time`, `mouse_drag_position`, `mouse_drag_time`, `user_screen_width`, `user_screen_height` FROM `mouse_interactions` WHERE `userid` = " . $_SESSION['userid'] . " AND `current_page`='" . $page . "' AND `time` > '". $day ." 00:00:00' AND `time` < '". $day ." 23:59:59'";
    	$data =  mysql_query($query);
    	echo "MouseMovePos\tMouseMoveTime\tMouseDragPos\tMouseDragTime\tScreenWidth\tScreenHeight\n";
    	while ($row = mysql_fetch_object($data)) {
    		echo $row->mouse_move_position . "\t" . $row->mouse_move_time . "\t" . $row->mouse_drag_position . "\t" . $row->mouse_drag_time . "\t" . $row->user_screen_width . "\t" . $row->user_screen_height . "\n";
    	}
    } else if ($option == "insight") {
    	//$query = "SELECT `insight`,`time`,`tokens`,`valence_avg`,`arousal_avg`,`dominance_avg` FROM `user_insights` WHERE `userid`=45";
    	$query = "SELECT `insight`,`time`,`tokens`,`valence_avg`,`arousal_avg`,`dominance_avg` FROM `user_insights` WHERE `userid` = 45";
    	$data = mysql_query($query);
    	echo "Insight\tTime\tTokens\tValence\tArousal\tDominance\n";
    	while ($row = mysql_fetch_object($data)) {
    		echo mysql_real_escape_string($row->insight) . "\t". $row->time . "\t" . $row->tokens . "\t" . $row->valence_avg . "\t" . $row->arousal_avg . "\t" . $row->dominance_avg . "\n"; 
    	}
    }
    
	
    mysql_close ($connection);
?>