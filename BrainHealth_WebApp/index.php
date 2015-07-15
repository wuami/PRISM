<?php include('session_check.php')?>
<!DOCTYPE html>
<html lang="en-US">
<head>
    <?php include('header.php'); ?>
    <link rel="stylesheet" href="css/editor.css" type="text/css">
</head>

<body>
	<?php include('navbar.php'); ?>

  <div class="container-fluid" id="notification" style="display:none;">
    <div class="row-fluid" id="successLogin" style="display:none;">
      <div class="span12">
        <h4 align="center" style="color: #0000ff">Welcome back, <?php echo $_SESSION['login_user']?></h4>
      </div>
    </div>
    <div class="row-fluid" id="successInsight" style="display:none;">
      <div class="span12">
        <h4 align="center" style="color: #0000ff">Insight saved successfully. Check out how you performed!</h4>
      </div>
    </div>
  </div>

	<div class="container-fluid">
		<div class="row-fluid">
            <div class="span8 login">
                <div class="row-fluid"><div class="span12">
                <h1 align="center"><img src="img/think.png">&nbsp;&nbsp;What's on your mind?</h1>
                <hr>
                <form>
                    <textarea id="insightInput" placeholder="How were you feeling ..."></textarea>
                    <br><div class="row-fluid"><div class="span4"><b style="font-size:15px">How happy were you feeling on a 1-10 scale? <span style="color:#ff0000">*</span></b></div>
                    <div class="span8">
                    <span class="pull-left" style="font-size:15px">
                      <label class="radio-inline">
                        <b>Very Sad <i class="fa fa-frown-o"></i> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b><input type="radio" name="inlineRadioOptions" id="inlineRadio1" value="1"> 1
                      </label>
                      <label class="radio-inline">
                        <input type="radio" name="inlineRadioOptions" id="inlineRadio2" value="2"> 2
                      </label>
                      <label class="radio-inline">
                        <input type="radio" name="inlineRadioOptions" id="inlineRadio3" value="3"> 3
                      </label>
                      <label class="radio-inline">
                        <input type="radio" name="inlineRadioOptions" id="inlineRadio4" value="4"> 4
                      </label>
                      <label class="radio-inline">
                        <input type="radio" name="inlineRadioOptions" id="inlineRadio5" value="5"> 5
                      </label>
                      <label class="radio-inline">
                        <input type="radio" name="inlineRadioOptions" id="inlineRadio6" value="6"> 6
                      </label>
                      <label class="radio-inline">
                        <input type="radio" name="inlineRadioOptions" id="inlineRadio7" value="7"> 7
                      </label>
                      <label class="radio-inline">
                        <input type="radio" name="inlineRadioOptions" id="inlineRadio8" value="8"> 8
                      </label>
                      <label class="radio-inline">
                        <input type="radio" name="inlineRadioOptions" id="inlineRadio9" value="9"> 9
                      </label>
                      <label class="radio-inline">
                        <input type="radio" name="inlineRadioOptions" id="inlineRadio10" value="10"> 10<b>&nbsp;&nbsp;Very Happy! <i class="fa fa-smile-o"></i></b>
                      </label></span></div></div>
                    <br><div class="row-fluid"><div class="span4"><b style="font-size:15px;">How energetic were you feeling on a 1-10 scale? <span style="color:#ff0000">*</span></b></div>
                    <div class="span8">
                    <span class="pull-left" style="font-size:15px">
                      <label class="radio-inline">
                        <b>Very Tired <i class="fa fa-frown-o"></i> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b><input type="radio" name="inlineRadioOptions1" id="inlineRadio1" value="1"> 1
                      </label>
                      <label class="radio-inline">
                        <input type="radio" name="inlineRadioOptions1" id="inlineRadio2" value="2"> 2
                      </label>
                      <label class="radio-inline">
                        <input type="radio" name="inlineRadioOptions1" id="inlineRadio3" value="3"> 3
                      </label>
                      <label class="radio-inline">
                        <input type="radio" name="inlineRadioOptions1" id="inlineRadio4" value="4"> 4
                      </label>
                      <label class="radio-inline">
                        <input type="radio" name="inlineRadioOptions1" id="inlineRadio5" value="5"> 5
                      </label>
                      <label class="radio-inline">
                        <input type="radio" name="inlineRadioOptions1" id="inlineRadio6" value="6"> 6
                      </label>
                      <label class="radio-inline">
                        <input type="radio" name="inlineRadioOptions1" id="inlineRadio7" value="7"> 7
                      </label>
                      <label class="radio-inline">
                        <input type="radio" name="inlineRadioOptions1" id="inlineRadio8" value="8"> 8
                      </label>
                      <label class="radio-inline">
                        <input type="radio" name="inlineRadioOptions1" id="inlineRadio9" value="9"> 9
                      </label>
                      <label class="radio-inline">
                        <input type="radio" name="inlineRadioOptions1" id="inlineRadio10" value="10"> 10<b>&nbsp;&nbsp;Very Energetic! <i class="fa fa-smile-o"></i></b>
                      </label></span></div></div>
                    <br><div class="row-fluid"><div class="span4"><b style="font-size:15px">How relaxed were you feeling on a 1-10 scale? <span style="color:#ff0000">*</span></b></div>
                    <div class="span8">
                    <span class="pull-left" style="font-size:15px">
                      <label class="radio-inline">
                        <b>Very Anxious <i class="fa fa-frown-o"></i> &nbsp&nbsp;</b><input type="radio" name="inlineRadioOptions2" id="inlineRadio1" value="1"> 1
                      </label>
                      <label class="radio-inline">
                        <input type="radio" name="inlineRadioOptions2" id="inlineRadio2" value="2"> 2
                      </label>
                      <label class="radio-inline">
                        <input type="radio" name="inlineRadioOptions2" id="inlineRadio3" value="3"> 3
                      </label>
                      <label class="radio-inline">
                        <input type="radio" name="inlineRadioOptions2" id="inlineRadio4" value="4"> 4
                      </label>
                      <label class="radio-inline">
                        <input type="radio" name="inlineRadioOptions2" id="inlineRadio5" value="5"> 5
                      </label>
                      <label class="radio-inline">
                        <input type="radio" name="inlineRadioOptions2" id="inlineRadio6" value="6"> 6
                      </label>
                      <label class="radio-inline">
                        <input type="radio" name="inlineRadioOptions2" id="inlineRadio7" value="7"> 7
                      </label>
                      <label class="radio-inline">
                        <input type="radio" name="inlineRadioOptions2" id="inlineRadio8" value="8"> 8
                      </label>
                      <label class="radio-inline">
                        <input type="radio" name="inlineRadioOptions2" id="inlineRadio9" value="9"> 9
                      </label>
                      <label class="radio-inline">
                        <input type="radio" name="inlineRadioOptions2" id="inlineRadio10" value="10"> 10<b>&nbsp;&nbsp;Very Relaxed! <i class="fa fa-smile-o"></i></b>
                      </label></span></div></div>
                    <br><button type="button" class="btn btn-primary" id="insightSub">Submit!</button>&nbsp;&nbsp;<button type="reset" class="btn btn-danger">Reset</button>
                </form>
                </div></div>
            </div>
            <div class="span4 login">
                <div class="row-fluid">
                    <div class="span12" style="padding: 10px 10px 10px 10px;"><h2>
                      <img src="img/loginsight.png">&nbsp;&nbsp;Logged Insights</h2><hr>
                      <?php
                        include('connection.php');
                        $insights = mysql_query("SELECT `insight`, `time` FROM `user_insights` WHERE `userid`=" . $_SESSION['userid'] . " ORDER BY `time` DESC LIMIT 5");
                        while ($row = mysql_fetch_object($insights)) {
                          echo '<b>' . $row->time . '</b><br>' . $row->insight . '<hr>';
                        }
                        mysql_close ($connection);
                      ?>
                      </div>
                </div>
            </div>
		</div>
    </div>
    <div class="container-fluid" style="display:none;">
        <div class="row-fluid">
            <div class="span8">
                <h2>Events:</h2>
                <div id="log"></div>
            </div>
        </div>
    </div>
    <script type="text/javascript" src="js/index.js"></script>
    <script type="text/javascript" src="js/navbar.js"></script>
    <?php include('footer.php')?>
</body></html>
