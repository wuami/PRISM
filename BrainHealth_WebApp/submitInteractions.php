<?php
	include('session_check.php');
	include('connection.php');
	$userid = $_SESSION['userid'];
	$posLog = $_POST["poslog1"];
    $timeLog = $_POST["timelog1"];
	$totalLogged = $_POST["totalLog1"];
    $avgSpeed = $_POST["avgSpeed1"];
    $totalTime = $_POST["totaltime1"];
    $totalClicks = $_POST["totalclicks1"];
    $avgDragSpeed = $_POST["avgdragvel"];
    $totalDragTime = $_POST["totaldragtime"];
    $dragPos = $_POST["dragposlog1"];
    $dragTime = $_POST["dragtimelog1"];
    $screenwidth = $_POST["screenwidth"];
	$screenheight = $_POST["screenheight"];
	$page = $_POST["currentpage"];

	$query1 = "INSERT INTO `mouse_interactions`(`userid`, `total_events`, `total_move_time`, `avg_move_velocity`, `mouse_move_position`, `mouse_move_time`, `total_mouse_clicks`, `total_drag_time`, `mouse_drag_position`, `mouse_drag_time`, `avg_drag_velocity`, `user_screen_width`, `user_screen_height`, `current_page`) VALUES ('$userid', '$totalLogged', '$totalTime', '$avgSpeed', '$posLog', '$timeLog', '$totalClicks', '$totalDragTime', '$dragPos', '$dragTime', '$avgDragSpeed', '$screenwidth', '$screenheight', '$page')";
	//echo $query1;
	$results = mysql_query($query1); 
	if($results){
		echo "success";
	} else {
		echo "Error! During one of the inserts";
	}
	mysql_close ($connection);
?>