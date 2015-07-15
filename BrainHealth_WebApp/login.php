<!DOCTYPE html>
<html lang="en-US">
<head>
    <?php include('header.php'); ?>
    <link rel="stylesheet" href="css/editor.css" type="text/css">
</head>

<body>
	<?php include('navbar.php'); ?>

	<div class="container-fluid">
    <div class="row-fluid" id="notification" style="display:none;">
      <div class="span12">
        <h4 align="center" style="color: #0000ff"> Your registration was successful! Please use your username and password to sign in the portal. </h4>
      </div>
    </div>
		<div class="row-fluid">
      <div class="span4 login">
        <div class="row-fluid" id="loginDiv">
          <div class="span12 login-container"><h1><img src="img/patientlogin.jpg">&nbsp;&nbsp;Sign In</h1>
            <hr>
            <form class="form loginForm" id="loginForm" method="post" action="#">
              <input type="text" name="loguname" id="loguname" class="email" placeholder="Username">
              <input type="password" name="logpassword" id="logpassword" placeholder="Password">
              <button type="button" class="btn btn-primary btn-md" name="login" id="login">Sign In</button>
            </form>
            <h5><a href="javascript:displayRegister();">Register</a> | <a href="">Forgot Password</a></h5>
          </div>
        </div>
        <div class="row-fluid" style="display:none" id="registerDiv">
          <div class="span12 register-container"><h1><img src="img/patientadd.jpg">&nbsp;&nbsp;Sign Up</h1>
            <hr>
            <form class="form loginForm" id="registerForm" method="post" action="#">
              <!--<input type="text" name="name" id="name" class="email" placeholder="Full Name">-->
              <input type="text" name="uname" id="uname" class="email" placeholder="Username">
              <!--<input type="email" name="regemail" id="regemail" class="email" placeholder="Email">
              <input type="text" name="cemail" id="cemail" class="email" placeholder="Confirm Email">-->
              <!--<input type="text" name="mobile" id="mobile" class="mobile" placeholder="Mobile Number">-->
              <div class="row-fluid"><span class="span4"><b>Year of Birth:</b></span>
              <!--<select class="form-control span2" id="month">
                <option value="" disabled selected>Month</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
              </select>
              <select class="form-control span2" id="date">
                <option value="" disabled selected>Date</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
                <option value="13">13</option>
                <option value="14">14</option>
                <option value="15">15</option>
                <option value="16">16</option>
                <option value="17">17</option>
                <option value="18">18</option>
                <option value="19">19</option>
                <option value="20">20</option>
                <option value="21">21</option>
                <option value="22">22</option>
                <option value="23">23</option>
                <option value="24">24</option>
                <option value="25">25</option>
                <option value="26">26</option>
                <option value="27">27</option>
                <option value="28">28</option>
                <option value="29">29</option>
                <option value="30">30</option>
                <option value="31">31</option>
              </select>-->
              <select class="form-control span2" id="year">
                <option value="" disabled selected>Year</option>
                <option value="1971">1971</option>
                <option value="1972">1972</option>
                <option value="1973">1973</option>
                <option value="1974">1974</option>
                <option value="1975">1975</option>
                <option value="1976">1976</option>
                <option value="1977">1977</option>
                <option value="1978">1978</option>
                <option value="1979">1979</option>
                <option value="1980">1980</option>
                <option value="1981">1981</option>
                <option value="1982">1982</option>
                <option value="1983">1983</option>
                <option value="1984">1984</option>
                <option value="1985">1985</option>
                <option value="1986">1986</option>
                <option value="1987">1987</option>
                <option value="1988">1988</option>
                <option value="1989">1989</option>
                <option value="1990">1990</option>
                <option value="1991">1991</option>
                <option value="1992">1992</option>
                <option value="1993">1993</option>
                <option value="1994">1994</option>
                <option value="1995">1995</option>
                <option value="1996">1996</option>
                <option value="1997">1997</option>
                <option value="1998">1998</option>
                <option value="1999">1999</option>
                <option value="2000">2000</option>
                <option value="2001">2001</option>
              </select>
              </div>
              <input type="password" name="password" id="password" placeholder="Password">
              <input type="password" name="cpassword" id="cpassword" placeholder="Confirm Password">
              <div class="row-fluid">
                  <span class="span1"><input type="checkbox" value="yes" name="consent" id="consent" style="height:20px;margin-right:0px;margin-top:-5px"></span>
                  <span class="span11"><b>I agree to the terms and conditions. <a href="privacy.php"><i class="fa fa-question-circle"></i></a></b></span>
              </div>
              <br>
              <button type="button" class="btn btn-primary btn-md" name="register" id="register">Sign Up</button>
              <button type="reset" class="btn btn-danger btn-md">Reset</button>
            </form>
            <h5><a href="javascript:displayLogin();">Login</a> | <a href="">Register as a Physician</a></h5>
          </div>
        </div>
      </div>
      <div class="span8 login">
        <div class="row-fluid"><div class="span12">
        <?php include('about.php');?></div></div>
      </div>
            
		</div>
    </div>

<script type="text/javascript" src="js/login.js"></script>
<?php include('footer.php')?>
</body></html>
