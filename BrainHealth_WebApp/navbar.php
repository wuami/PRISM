<div class="navbar navbar-inverse">
    <div class="navbar-inner">
        <div class="container-fluid">
            <button type="button" class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <a class="brand" href="index.php">PRISM (Passive, Real-time Information for Sensing Mental Health)</a>
            <div class="nav-collapse collapse">
                <ul class="nav">
                    <?php if(isset($_SESSION['login_user'])) { ?><li id="writeLink" class="navbarLink"><a>Write</a></li>
                    <li id="exploreLink" class="navbarLink"><a>Explore</a></li>
                    <li id="helpLink" class="navbarLink"><a>Help</a></li><?php } ?>
                </ul>
                <ul class="nav pull-right">
                    <li id="downloadLink" class="navbarLink"><a href="download.php" target="_blank">Download Wearable App</a></li>
                    <li id="aboutLink" class="navbarLink"><a href="about.php" target="_blank">About Brain Health</a></li>
                    <li id="privacyLink" class="navbarLink"><a href="privacy.php" target="_blank">Privacy</a></li>
                    <?php if(isset($_SESSION['login_user'])) { ?>
                        <li class="dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown"><?php echo $_SESSION["login_user"]?><b class="caret"></b></a>
                            <ul class="dropdown-menu">
                                <li id="profileLink" style="cursor:pointer"><a>View Profile</a></li>
                                <li id="logoutLink" style="cursor:pointer"><a>Sign Out</a></li>
                            </ul>
                        </li>
                    <?php } ?>
                </ul>
            </div><!--/.nav-collapse -->
        </div>
    </div>
</div>