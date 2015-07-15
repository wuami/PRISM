jQuery("#writeLink").click(function(event) {
    event.preventDefault();
    logInteractions();
    window.location = "index.php"
});

jQuery("#exploreLink").click(function(event) {
    event.preventDefault();
    logInteractions();
    window.location = "explore.php"
});

jQuery("#aboutLink").click(function(event) {
    event.preventDefault();
    logInteractions();
    window.open("about.php", "_blank");
});

jQuery("#downloadLink").click(function(event) {
    event.preventDefault();
    logInteractions();
    window.open("download.php", "_blank");
});

jQuery("#privacyLink").click(function(event) {
    event.preventDefault();
    logInteractions();
    window.open("privacy.php", "_blank");
});

jQuery("#helpLink").click(function(event) {
    event.preventDefault();
    logInteractions();
    //window.location = "help.php"
});

jQuery("#logoutLink").click(function(event) {
    event.preventDefault();
    logInteractions();
    window.location = "logout.php"
});