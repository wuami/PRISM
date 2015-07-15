<?php
	session_start(); // Starting Session
	$error=''; // Variable To Store Error Message
	if (empty($_POST['uname1']) || empty($_POST['password1'])) {
		$error = "Username or Password is invalid";
		echo $error;
	} else {
		// Define $username and $password
		$username=$_POST['uname1'];
		$password=$_POST['password1'];
		// Establishing Connection with Server by passing server_name, user_id and password as a parameter
		$connection = mysql_connect($HOST, $USER, $PASSWORD); // Establishing connection with server..
		$db = mysql_select_db($DATABASE, $connection); 
		// To protect MySQL injection for Security purpose
		$username = stripslashes($username);
		$password = stripslashes($password);
		$username = mysql_real_escape_string($username);
		$password = sha1(mysql_real_escape_string($password));
		$query = mysql_query("select id from user_profiles where password='$password' AND username='$username'", $connection);
		$rows = mysql_num_rows($query);
		$userObj = mysql_fetch_object($query);
		if ($rows == 1) {
			$_SESSION['login_user'] = $username; // Initializing Session
			//$_SESSION['full_name'] = $userObj->name;
			$_SESSION['userid'] = $userObj->id;
			echo "success"; // Redirecting To Other Page
		} else {
			$error = "Username or Password is invalid";
			echo $error;
		}
		mysql_close($connection); // Closing Connection
	}
?>
