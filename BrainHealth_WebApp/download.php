<!DOCTYPE html>
<html lang="en-US">
<head>
    <?php include('header.php'); ?>
</head>

<body>
    <?php include('navbar.php'); ?>

    <div class="container-fluid">
        <div class="row-fluid">
            <div class="span12" style="padding:20px">
                <h3>PRISM Wearable App Installation Instructions (Development version)</h3>
                <hr>
                <h4 style="text-align: center"><a href="BrainHealth.wgt">Download PRISM Wearable App</a></h4>
                <hr>
                <h4><u>Instructions</u></h4>
                <ul>
                    <li>Download and install the Tizen SDK for Wearable 1.0.0 using instructions provided <a href="https://developer.tizen.org/downloads/tizen-sdk" target="_blank">here</a>.</li>
                    <li>Download the PRISM Wearable Application from the link above.</li>
                    <li>Connect the Samsung Gear S smart watch to the laptop using a Micro USB cord.</li>
                    <li>Navigate to the Tizen-wearable-sdk folder (usually /Users/{username}/tizen-wearable-sdk) and then to the 'Tools' folder.</li>
                    <li>Copy the BrainHealth.wgt package to this folder.</li>
                    <li>Execute<br>
                        <span>./sdb install BrainHealth.wgt</span>
                    </li>
                    <li>Navigate to your applications on the smart watch and you should see the Brain Health icon</li>
                </ul>
            </div>
        </div>
    </div>
    <?php include('footer.php')?>
</body>
</html>    