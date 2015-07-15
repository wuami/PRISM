<?php
	include('connection.php');
	//$name = $_POST['name1']; // Fetching Values from URL.
	//$email = $_POST['email1'];
	$password = sha1($_POST['password1']); 
    //$mobile = $_POST['mobile1'];
    $sha1key = sha1($_POST['uname1']);
    $uname = $_POST['uname1'];
    $dob = $_POST['dob1'];
	//$email = filter_var($email, FILTER_SANITIZE_EMAIL); // Sanitizing email(Remove unexpected symbol like <,>,?,#,!, etc.)
	$result = mysql_query("SELECT `username` FROM user_profiles WHERE username='$uname'");
	$data = mysql_num_rows($result);
	if(($data)==0){
		$query = mysql_query("insert into user_profiles(username, password, sha1key, role, dob) values ('$uname', '$password', '$sha1key', 'general', '$dob')"); // Insert query
		if($query){
            //$commandStr = 'python regEmail.py '. $email . ' "' . $name . '"';
            //$command = escapeshellcmd($commandStr);
            //$output = shell_exec($command);
			echo "success";
		} else {
			echo "Error! MySQL has gone away";
		}
	} else {
		echo "This username is already taken, Please try with another username ...";
	}
	mysql_close ($connection);
?>