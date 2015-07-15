<?php
	include('session_check.php');
	if (empty($_POST['textInput'])) {
		$error = "Please input some text!";
		echo $error;
	} else {
		$connection = mysql_connect($HOST, $USER, $PASSWORD); // Establishing connection with server..
		$db = mysql_select_db($DATABASE, $connection); 
		$userid = $_SESSION['userid'];
		$textInput = stripslashes($_POST['textInput']);
		$keyDetails = $_POST["keyDetails"];
		$keyTime = $_POST["keyTime"];
		$bigramDetails = $_POST["bigramDetails"];
		$bigramTime = $_POST["bigramTime"];
		$numberOfEnters = $_POST["numberOfEnters"];
		$numberOfUndos = $_POST["numberOfUndos"];
		$numberOfBacks = $_POST["numberOfBacks"];
		$numberOfRedos = $_POST["numberOfRedos"];
		$totaltime = $_POST["totaltime"];
		$currenttime = $_POST["currenttime"];
		$sadnessLevel = $_POST["feels"];
		$tiredLevel = $_POST["energy"];
		$anxietyLevel = $_POST["relax"];
		$misspelled = array();

        //Remove block for Amazon Ec2 instance ...
        // install aspell, aspell-en, php5-pspell
		if ($pspell = pspell_new('en', '', '', '', PSPELL_FAST)) {
			$words = preg_split('/[\W]+/u', $textInput, -1, PREG_SPLIT_NO_EMPTY);

			foreach ($words as $w) {
			  if (!pspell_check($pspell, $w) && !is_numeric($w)) {
			    $misspelled[] = $w;
			  }
			}
		}

		$textInput = mysql_real_escape_string($textInput);
		
        $spellm = sizeof($misspelled);
		
		$query1 = mysql_query("INSERT INTO `user_insights`(`userid`, `insight`, `time_taken`, `total_spells`, `total_undos`, `total_backs`, `total_redos`, `total_enters`, `key_details`, `key_press_time`, `keybigram_details`, `keybigram_timediff`, `happiness_level`, `energy_level`, `relax_level`) VALUES ('$userid', '$textInput', '$totaltime', '$spellm', '$numberOfUndos', '$numberOfBacks', '$numberOfRedos', '$numberOfEnters', '$keyDetails', '$keyTime', '$bigramDetails', '$bigramTime', '$sadnessLevel', '$tiredLevel', '$anxietyLevel')"); 
		if($query1){
			echo "success";
		} else {
			echo "Error! During one of the inserts";
		}
		mysql_close ($connection);
	}
?>
