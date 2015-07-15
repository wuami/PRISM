d3.tsv("data/thegoldengene_light_1432918072166.txt", function (data) {
	for (entry in data) {
		var timeStamp = new Date(parseInt(data[entry].Time));
		console.log(timeStamp + "-" + data[entry]["Light Levels"]);
	}
})