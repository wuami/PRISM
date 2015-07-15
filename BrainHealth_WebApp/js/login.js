if (storage.getItem("registration") == "successful") {
  jQuery("#notification").show()
  storage.removeItem("registration");
}

function displayRegister() {
  jQuery("#loginDiv").hide();
  jQuery("#registerDiv").show();
}

function displayLogin() {
  jQuery("#loginDiv").show();
  jQuery("#registerDiv").hide();
}



jQuery(document).ready(function(){
  
  jQuery("#logpassword").keydown(function(event) {
    if (event.which == 13){  // enter
      loginUser();
    }
  });
  
  function loginUser(){
    var uname = jQuery("#loguname").val();
    var password = jQuery("#logpassword").val();
      // Checking for blank fields.
    if (uname =='' || password ==''){
      jQuery('#loginForm input[type="text"],input[type="password"]').css("border","2px solid red");
      jQuery('#loginForm input[type="text"],input[type="password"]').css("box-shadow","0 0 3px red");
      alert("Please fill all fields !");
    } else {
      jQuery.post("loginAuth.php",{ uname1: uname, password1:password},
      function(data) {
        if(data=='wrong'){
          jQuery('input[type="text"],input[type="password"]').css({"border":"2px solid red","box-shadow":"0 0 3px red"});
          alert('Username or Password is wrong !');
        } else if(data=='success'){
          storage.setItem("login", "successful");
          window.location.href = "index.php";
        } else{
          alert(data);
        }
      });
    }
  }

  jQuery("#login").click(loginUser);

  jQuery("#register").click(function() {
    console.log("register here");
    //var name = jQuery("#name").val();
    var uname = jQuery("#uname").val();
    //var email = jQuery("#regemail").val();
    //console.log(email);
    var password = jQuery("#password").val();
    var cpassword = jQuery("#cpassword").val(); 
    //var mobile = jQuery("#mobile").val();
    //var month = jQuery("#month").val();
    //var date = jQuery("#date").val();
    var year = jQuery("#year").val();
    if (!jQuery('#consent').is(':checked')) {
      alert("Please agree to the terms and conditions");
    } else {
      var dob = year;
      if (password == '' || cpassword == '' || year == '' || uname == '') {
        //console.log(name + uname + email + password + cpassword + month + date +year + mobile)
        alert("Please fill all fields!");
      } else if ((password.length) < 8) {
        alert("Password should be at least 8 character in length!");
      } else if (!(password).match(cpassword)) {
        alert("Your passwords don't match. Please try again.");
      } else {
        jQuery.post("register.php", {
          //name1: name,
          //email1: email,
          //mobile1: mobile,
          dob1: dob,
          uname1: uname,
          password1: password
          }, function(data) {
            if (data == 'success') {
              storage.setItem("registration", "successful")
              location.reload();
            } else {
              alert(data);
            }
        });
      }
    }
  });
});