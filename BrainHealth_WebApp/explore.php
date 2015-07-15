<?php include('session_check.php');?>
<!DOCTYPE html>
<html lang="en-US">
<head>
    <?php include('header.php'); ?>
    <script src="js/kinetic.min.js"></script>
    <script src="js/libraries/heatmap.min.js"></script>
</head>

<body>
    <?php include('navbar.php'); ?>
    <div class="container-fluid" style="margin-bottom:10px;">
        <div class="row-fluid">
          <div class="span12">
            <h4 align="center" style="color: #0000ff">This section is still under development, so the widgets do not represent your actual data</h4>
          </div>
        </div>
    </div>

    <div class="container-fluid">
        <div class="row-fluid">
            <div class="span12 explorer">
                <select id="loggeddays"></select>
            </div>
        </div>
        <div class="row-fluid">
            <div class="span12">
                <div class="tabbable" id="datatabs">
                    <ul class="nav nav-tabs" id="tabIds">
                        <li class="active"><a href="#watch" data-toggle="tab">Wearable Data</a></li>
                        <li><a href="#keystroke" data-toggle="tab" id="keyStrokeTab">Keystroke Dynamics</a></li>
                        <li><a href="#mouse" data-toggle="tab" id="mouseTab">Mouse Interaction Patterns</a></li>
                        <li><a href="#insight" data-toggle="tab" id="insightTab">Insights</a></li>
                        <li><a href="#other" data-toggle="tab" id="brainViewTab">Inferred Insights</a></li>
                    </ul>
                    <div class="tab-content" id="datacontent">
                        <div class="tab-pane fade active in" id="watch">
                            <!--<div class="row-fluid">
                                <div class="span12 explorer" id="trackControls">
                                    <select id="loggeddays"></select>
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    <a class="btn" href="#" id="back"><i class="icon-backward icon-black"></i></a>
                                    <a class="btn" href="#" id="play"><i class="icon-play icon-black"></i></a>
                                    <a class="btn" href="#" id="stop"><i class="icon-stop icon-black"></i></a>
                                    <a class="btn" href="#" id="front"><i class="icon-forward icon-black"></i></a>
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                </div>
                            </div>-->
                            <div class="row-fluid"><div class="span12 explorer" id="trackCanvas"></div><!--<div class="span2" id="cumW"></div>--></div>
                        </div>
                        <div class="tab-pane fade" id="keystroke">
                            <div class="row-fluid">
                                <div class="span4 explorer" style="text-align:center; font-size:16px">
                                    <input type="checkbox" id="latencyControl"> <b>Show interkey movements</b>
                                </div>
                                <div class="span8 explorer" id="keytrackControls" style="text-align:center">
                                   <div id="loggedtimes"></div>
                                </div>
                                <div class="span12 explorer" id="insighttext" style="text-align:center">
                                </div>
                            </div>
                            <div class="row-fluid" id="keyStrokeContainer">
                                <div class="span12 explorer keyheatmap" id="keyStrokeView">
                                    <img src="img/keyboard.jpg" width="100%">
                                </div>
                                <div id="latencyCanvas" style="display:none">
                                </div>
                            </div>
                        </div>
                        <div class="tab-pane fade" id="mouse">
                            <div class="row-fluid">
                                <div class="span8 explorer" id="mousetrackControls" style="text-align:center; font-size:16px">
                                   <div id="loggedpages">
                                        <label class="radio-inline"><input type="radio" name="avPages" id="avPages" value="/BrainHealth/index.php"><b>Write Page</b></label> &nbsp;
                                        <label class="radio-inline"><input type="radio" name="avPages" id="avPages" value="/BrainHealth/explore.php"><b>Explore Page</b></label>
                                   </div>
                                </div>
                            </div>
                            <div class="row-fluid" id="mouseStrokeContainer">
                                <div class="span12 explorer mouseheatmap" id="mouseStrokeView">
                                    <img src="img/screen.png" width="100%">
                                </div>
                            </div>
                        </div>
                        <div class="tab-pane fade" id="insight">
                            <div class="row-fluid" id="insightContainer">
                                <div class="span12 explorer insightScatter" id="insightView"><iframe src="emotioncube.php" width="100%" height="720px" frameborder="0"></iframe></div>
                            </div>
                        </div>
                        <div class="tab-pane fade" id="other">
                           <div class="row-fluid">
                                <div id="brainview" class="brainview span4"></div>
                           </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

<script type="text/javascript" src="js/explorer.js"></script>
<script type="text/javascript" src="js/navbar.js"></script>
<?php include('footer.php')?>
</body></html>
