<!DOCTYPE HTML>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<title>Emotions Cuboid</title>

		<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js"></script>

        <script type="text/javascript" src="js/libraries/d3.v3.min.js"></script>
		<style type="text/css">
            #container {
            	height: 700px; 
            	min-width: 310px; 
            	max-width: 90%;
            	margin: 0 auto;
            }
		</style>
		<script type="text/javascript">
            var showInsights = function () {

                // Give the points a 3D feel by adding a radial gradient
                Highcharts.getOptions().colors = $.map(Highcharts.getOptions().colors, function (color) {
                    return {
                        radialGradient: {
                            cx: 0.4,
                            cy: 0.3,
                            r: 0.5
                        },
                        stops: [
                            [0, color],
                            [1, Highcharts.Color(color).brighten(-0.2).get('rgb')]
                        ]
                    };
                });

                // Set up the chart
                var chart = new Highcharts.Chart({
                    chart: {
                        renderTo: 'container',
                        margin: 100,
                        type: 'scatter',
                        options3d: {
                            enabled: true,
                            alpha: 10,
                            beta: 30,
                            depth: 250,
                            viewDistance: 5,

                            frame: {
                                bottom: { size: 1, color: 'rgba(0,0,0,0.05)' },
                                back: { size: 1, color: 'rgba(0,0,0,0.1)' },
                                side: { size: 1, color: 'rgba(0,0,0,0.2)' }
                            }
                        }
                    },
                    title: {
                        text: 'Emotions Cuboid'
                    },
                    subtitle: {
                        text: 'Click and drag the cuboid to rotate in space'
                    },
                    tooltip: {
                        formatter: function(chart) {
                            var p = this.point;
                            return p.name + '<br><b>Valence: </b>' + 
                                   p.x + '<br><b>Arousal: </b>' + p.y + '<br><b>Dominance: </b>' + p.z;
                        }
                    },
                    plotOptions: {
                        scatter: {
                            width: 10,
                            height: 10,
                            depth: 10,
                            marker: {radius: 7}
                        }
                    },
                    yAxis: {
                        min: minArousal,
                        max: maxArousal,
                        tickColor: "#000000",
                        gridLineColor: '#000000',
                        title: {text:"Arousal", style: { "color": "#000000", "fontWeight": "bold", fontSize: "15px" }}
                    },
                    xAxis: {
                        min: minValence,
                        max: maxValence,
                        gridLineWidth: 1,
                        tickInterval: 1,
                        tickColor: "#000000",
                        gridLineColor: '#000000',
                        title: {text:"Valence", style: { "color": "#000000", "fontWeight": "bold", fontSize: "15px" }}
                    },
                    zAxis: {
                        min: minDominance,
                        max: maxDominance,
                        tickInterval: 1,
                        gridLineColor: '#000000',
                        tickColor: "#000000",
                        title: {text:"Dominance", style: { "color": "#000000", "fontWeight": "bold", fontSize: "15px" }}
                    },
                    legend: {
                        enabled: false
                    },
                    series: [{
                        name: 'Insight',
                        colorByPoint: false,
                        data: insightData
                    }]
                });


                // Add mouse events for rotation
                $(chart.container).bind('mousedown.hc touchstart.hc', function (e) {
                    e = chart.pointer.normalize(e);

                    var posX = e.pageX,
                        posY = e.pageY,
                        alpha = chart.options.chart.options3d.alpha,
                        beta = chart.options.chart.options3d.beta,
                        newAlpha,
                        newBeta,
                        sensitivity = 5; // lower is more sensitive

                    $(document).bind({
                        'mousemove.hc touchdrag.hc': function (e) {
                            // Run beta
                            newBeta = beta + (posX - e.pageX) / sensitivity;
                            newBeta = Math.min(100, Math.max(-100, newBeta));
                            chart.options.chart.options3d.beta = newBeta;

                            // Run alpha
                            newAlpha = alpha + (e.pageY - posY) / sensitivity;
                            newAlpha = Math.min(100, Math.max(-100, newAlpha));
                            chart.options.chart.options3d.alpha = newAlpha;

                            chart.redraw(false);
                        },
                        'mouseup touchend': function () {
                            $(document).unbind('.hc');
                        }
                    });
                });

            }
		</script>
	</head>
	<body>
        <script src="js/libraries/highcharts.js"></script>
        <script src="js/libraries/highcharts-3d.js"></script>

        <div id="container"></div>
        <script type="text/javascript">
            var insightData = [];
            var maxValence = 0, minValence = 10;
            var maxArousal = 0, minArousal = 10;
            var maxDominance = 0, minDominance = 10;

            d3.tsv("explore_retrieve.php?option=insight", function (data) {
                for (entry in data) {
                    var valence = parseFloat(data[entry].Valence);
                    var arousal = parseFloat(data[entry].Arousal);
                    var dominance = parseFloat(data[entry].Dominance);
                    var tokens = data[entry].Tokens.split(":-:");
                    var pubinsight = data[entry].Insight;

                    for (token in tokens) {
                        var re = new RegExp(tokens[token], 'g');
                        pubinsight = pubinsight.toLowerCase().replace(tokens[token], " <b>"+tokens[token]+"</b>")
                    }
                    if (valence < minValence && valence > 0) minValence = Math.floor(valence);
                    if (valence > maxValence) maxValence = Math.ceil(valence);
                    if (arousal < minArousal && arousal > 0) minArousal = Math.floor(arousal);
                    if (arousal > maxArousal) maxArousal = Math.ceil(arousal);
                    if (dominance < minDominance && dominance > 0) minDominance = Math.floor(dominance);
                    if (dominance > maxDominance) maxDominance = Math.ceil(dominance);
                    insightData.push({x: valence, y: arousal, z: dominance, name:"<b>" + data[entry].Time + "</b><br>" + pubinsight})
                }
                console.log(insightData);
                showInsights();
            });
        </script>
	</body>
</html>
