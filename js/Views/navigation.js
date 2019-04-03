var transistionColor0 = "rgba(" + (redPlanetColor * 255 + 90).toFixed(0) + ","
		+ (greenPlanetColor * 255 + 90).toFixed(0) + ","
		+ (bluePlanetColor * 255 + 90).toFixed(0) + "," + 0.9 + ")";

var iconColor0 = "rgba(" + (redPlanetColor * 255 + 90).toFixed(0) + ","
		+ (greenPlanetColor * 255 + 90).toFixed(0) + ","
		+ (bluePlanetColor * 255 + 90).toFixed(0) + "," + 0.85 + ")";

var transistionHoverColor0 = "rgba(" + (redPlanetColor * 255 + 140).toFixed(0)
		+ "," + (greenPlanetColor * 255 + 140).toFixed(0) + ","
		+ (bluePlanetColor * 255 + 140).toFixed(0) + "," + 0.9 + ")";

var transistionColor1 = "rgba(" + (redPlanetColor * 255 + 60).toFixed(0) + ","
		+ (greenPlanetColor * 255 + 60).toFixed(0) + ","
		+ (bluePlanetColor * 255 + 60).toFixed(0) + "," + 0.0 + ")";

$("#right-img-background").css(
		{
			"background" : "linear-gradient(to left," + iconColor0
					+ "50%, rgba(0,0,0,0) 50%)"
		});
$("#right-navigation-bar").css(
		{
			"background-color" : transistionColor0,
			"background" : "-webkit-linear-gradient(-130deg,"
					+ transistionColor0 + "," + transistionColor1 + ")",
			"background" : "-o-linear-gradient(-130deg," + transistionColor0
					+ "," + transistionColor1 + ")",
			"background" : "-moz-linear-gradient(-130deg," + transistionColor0
					+ "," + transistionColor1 + ")",
			"background" : "linear-gradient(-130deg," + transistionColor0 + ","
					+ transistionColor1 + ")",
		});
$("#right-navigation-bar").hover(
		function() {
			$(this).css(
					{
						"background-color" : transistionHoverColor0,
						"background" : "-webkit-linear-gradient(-90deg,"
								+ transistionHoverColor0 + ","
								+ transistionColor1 + ")",
						"background" : "-o-linear-gradient(-90deg,"
								+ transistionHoverColor0 + ","
								+ transistionColor1 + ")",
						"background" : "-moz-linear-gradient(-90deg,"
								+ transistionHoverColor0 + ","
								+ transistionColor1 + ")",
						"background" : "linear-gradient(-90deg,"
								+ transistionHoverColor0 + ","
								+ transistionColor1 + ")",
					});
			$("#right-img-background").css(
					{
						"background" : "linear-gradient(to left,"
								+ transistionHoverColor0
								+ "50%, rgba(0,0,0,0) 50%)"
					});
			$("#right-img-icon").css({
				"background-image" : "url('img/usericon.png')"
			});
		},
		function() {
			$(this).css(
					{
						"background-color" : transistionColor0,
						"background" : "-webkit-linear-gradient(-130deg,"
								+ transistionColor0 + "," + transistionColor1
								+ ")",
						"background" : "-o-linear-gradient(-130deg,"
								+ transistionColor0 + "," + transistionColor1
								+ ")",
						"background" : "-moz-linear-gradient(-130deg,"
								+ transistionColor0 + "," + transistionColor1
								+ ")",
						"background" : "linear-gradient(-130deg,"
								+ transistionColor0 + "," + transistionColor1
								+ ")",
					});
			$("#right-img-background").css(
					{
						"background" : "linear-gradient(to left," + iconColor0
								+ "50%, rgba(0,0,0,0) 50%)"
					});
			$("#right-img-icon").css({
				"background-image" : "url('img/usericon1.png')"
			});
		});

$("#right-img-icon").hover(
		function() {
			$("#right-navigation-bar").css(
					{
						"background-color" : transistionHoverColor0,
						"background" : "-webkit-linear-gradient(-90deg,"
								+ transistionHoverColor0 + ","
								+ transistionColor1 + ")",
						"background" : "-o-linear-gradient(-90deg,"
								+ transistionHoverColor0 + ","
								+ transistionColor1 + ")",
						"background" : "-moz-linear-gradient(-90deg,"
								+ transistionHoverColor0 + ","
								+ transistionColor1 + ")",
						"background" : "linear-gradient(-90deg,"
								+ transistionHoverColor0 + ","
								+ transistionColor1 + ")",
					});
			$("#right-img-background").css(
					{
						"background" : "linear-gradient(to left,"
								+ transistionHoverColor0
								+ "50%, rgba(0,0,0,0) 50%)"
					});
			$("#right-img-icon").css({
				"background-image" : "url('img/usericon.png')"
			});
		},
		function() {
			$("#right-navigation-bar").css(
					{
						"background-color" : transistionColor0,
						"background" : "-webkit-linear-gradient(-130deg,"
								+ transistionColor0 + "," + transistionColor1
								+ ")",
						"background" : "-o-linear-gradient(-130deg,"
								+ transistionColor0 + "," + transistionColor1
								+ ")",
						"background" : "-moz-linear-gradient(-130deg,"
								+ transistionColor0 + "," + transistionColor1
								+ ")",
						"background" : "linear-gradient(-130deg,"
								+ transistionColor0 + "," + transistionColor1
								+ ")",
					});
			$("#right-img-background").css(
					{
						"background" : "linear-gradient(to left," + iconColor0
								+ "50%, rgba(0,0,0,0) 50%)"
					});
			$("#right-img-icon").css({
				"background-image" : "url('img/usericon1.png')"
			});
		});

$("#left-img-background").css(
		{
			"background" : "linear-gradient(to right," + iconColor0
					+ "50%, rgba(0,0,0,0) 50%)"
		});

$("#left-navigation-bar").css(
		{
			"background-color" : transistionColor0,
			"background" : "-webkit-linear-gradient(130deg,"
					+ transistionColor0 + "," + transistionColor1 + ")",
			"background" : "-o-linear-gradient(130deg," + transistionColor0
					+ "," + transistionColor1 + ")",
			"background" : "-moz-linear-gradient(130deg," + transistionColor0
					+ "," + transistionColor1 + ")",
			"background" : "linear-gradient(130deg," + transistionColor0 + ","
					+ transistionColor1 + ")",
		});
$("#left-navigation-bar").hover(
		function() {
			$(this).css(
					{
						"background-color" : transistionColor0,
						"background" : "-webkit-linear-gradient(90deg,"
								+ transistionHoverColor0 + ","
								+ transistionColor1 + ")",
						"background" : "-o-linear-gradient(90deg,"
								+ transistionHoverColor0 + ","
								+ transistionColor1 + ")",
						"background" : "-moz-linear-gradient(90deg,"
								+ transistionHoverColor0 + ","
								+ transistionColor1 + ")",
						"background" : "linear-gradient(90deg,"
								+ transistionHoverColor0 + ","
								+ transistionColor1 + ")",
					});
			$("#left-img-background").css(
					{
						"background" : "linear-gradient(to right,"
								+ transistionHoverColor0
								+ "50%, rgba(0,0,0,0) 50%)"
					});
			$("#left-img-icon").css({
				"background-image" : "url('img/menuicon.png')"
			});
		},
		function() {
			$(this).css(
					{
						"background-color" : transistionColor0,
						"background" : "-webkit-linear-gradient(130deg,"
								+ transistionColor0 + "," + transistionColor1
								+ ")",
						"background" : "-o-linear-gradient(130deg,"
								+ transistionColor0 + "," + transistionColor1
								+ ")",
						"background" : "-moz-linear-gradient(130deg,"
								+ transistionColor0 + "," + transistionColor1
								+ ")",
						"background" : "linear-gradient(130deg,"
								+ transistionColor0 + "," + transistionColor1
								+ ")",
					});
			$("#left-img-background").css(
					{
						"background" : "linear-gradient(to right," + iconColor0
								+ "50%, rgba(0,0,0,0) 50%)"
					});
			$("#left-img-icon").css({
				"background-image" : "url('img/menuicon1.png')"
			});
		});

$("#left-img-icon").hover(
		function() {
			$("#left-navigation-bar").css(
					{
						"background-color" : transistionColor0,
						"background" : "-webkit-linear-gradient(90deg,"
								+ transistionHoverColor0 + ","
								+ transistionColor1 + ")",
						"background" : "-o-linear-gradient(90deg,"
								+ transistionHoverColor0 + ","
								+ transistionColor1 + ")",
						"background" : "-moz-linear-gradient(90deg,"
								+ transistionHoverColor0 + ","
								+ transistionColor1 + ")",
						"background" : "linear-gradient(90deg,"
								+ transistionHoverColor0 + ","
								+ transistionColor1 + ")",
					});
			$("#left-img-background").css(
					{
						"background" : "linear-gradient(to right,"
								+ transistionHoverColor0
								+ "50%, rgba(0,0,0,0) 50%)"
					});
			$("#left-img-icon").css({
				"background-image" : "url('img/menuicon.png')"
			});
		},
		function() {
			$("#left-navigation-bar").css(
					{
						"background-color" : transistionColor0,
						"background" : "-webkit-linear-gradient(130deg,"
								+ transistionColor0 + "," + transistionColor1
								+ ")",
						"background" : "-o-linear-gradient(130deg,"
								+ transistionColor0 + "," + transistionColor1
								+ ")",
						"background" : "-moz-linear-gradient(130deg,"
								+ transistionColor0 + "," + transistionColor1
								+ ")",
						"background" : "linear-gradient(130deg,"
								+ transistionColor0 + "," + transistionColor1
								+ ")",
					});
			$("#left-img-background").css(
					{
						"background" : "linear-gradient(to right," + iconColor0
								+ "50%, rgba(0,0,0,0) 50%)"
					});
			$("#left-img-icon").css({
				"background-image" : "url('img/menuicon1.png')"
			});
		});