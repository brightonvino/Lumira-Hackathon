var render = function(data, container) {
	container.classed('theateam', true);
	var mapDiv = container.selectAll('#map');
	if (mapDiv[0].length === 0) {
		mapDiv = container.append('div').attr('id', 'map');

		var leaflet;
		if ($('.sapUiBody').length !== 0) {
			leaflet = runt.leaflet;
		} else {
			leaflet = L;
		}

		var map = leaflet.map('map').setView([33.775, -84.40], 14);

		leaflet.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
			attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
			maxZoom: 20,
			id: 'shobhitg.na7jk2f5',
			accessToken: 'pk.eyJ1Ijoic2hvYmhpdGciLCJhIjoiNmI1Nzg0ZmIzMWY4OGU4MGEzYzI3ZGIxMzBhZmQ4NmUifQ.z5e8zocByNWRqW6VPfxpwg'
		}).addTo(map);

		renderMap(data, map, container);
	}

};

function renderMap(data, map, container) {
	var updateMap;
	var init = false;


	var d3Overlay = L.d3SvgOverlay(function(selection, projection) {

		updateMap = function() {
            var data = monthDimension.top(Infinity);
            //if (data.length === migrantData.length) return;

            console.log(data.length);
            data = data.filter(function(d) {
                return !((d.x === "") || (d.y === ""));
            });



			var feature = selection.selectAll("circle")
				.data(data);

			feature.enter().append("circle")
				.style("opacity", .2)
				.style("fill", "red")
				.attr("r", function(d) {
					return Math.log(d.MinOfucr) * 2 / Math.min(projection.layer._scale, 18);
				})
				.attr('cx', function(d) {
					return projection.latLngToLayerPoint([parseFloat(d.y), parseFloat(d.x)]).x;
				})
				.attr('cy', function(d) {
					return projection.latLngToLayerPoint([parseFloat(d.y), parseFloat(d.x)]).y;
				});

			feature.exit().remove();

			feature.attr('stroke-width', 1 / projection.layer._scale)
				.attr("r", function(d) {
					return Math.log(d.MinOfucr) * 2 * 1 / Math.min(projection.layer._scale, 15);
				});

		};

		if (init === false) {
			init = true;

			cfData = crossfilter(data);

			var timeChartDiv = container.selectAll('#time-chart');
			if (timeChartDiv[0].length === 0) {
				timeChartDiv = container.append('div').attr('id', 'time-chart').classed('dc-chart', true);

				var dcjs;
				if ($('.sapUiBody').length !== 0) {
					dcjs = runt.dcjs;
				} else {
					dcjs = dc;
				}

				var dateDimension = cfData.dimension(function(d) {
					return new Date(d.occur_date)
				});

				window.monthDimension = cfData.dimension(function(d) {
					return new Date(d.occur_date);
				});

				var openGroup = monthDimension.group().reduceSum(function(d) {
					return parseInt(d.MinOfucr);
				});
				closeGroup = monthDimension.group().reduce(
					function(p, v) {
						p.push(v.close);
						return p;
					},
					function(p, v) {
						p.splice(p.indexOf(v.close), 1);
						return p;
					},
					function() {
						return [];
					}
				);

				var timeChart = dc.barChart('#time-chart');
				timeChart
					.width(800)
					.height(120)
				//.margins({top: 10, right: 50, bottom: 30, left: 50})
				.dimension(monthDimension)
					.group(openGroup)
					.x(d3.time.scale().domain([new Date("2008-01-01T00:00:00Z"), new Date("2016-09-30T00:00:00Z")]))
					.round(d3.time.days.round)
					.xUnits(d3.time.days)
					.elasticY(true)
					.on("filtered", updateMap)
					.filter([new Date("2011-01-01T00:00:00Z"), new Date("2012-09-30T00:00:00Z")]);

				dc.renderAll();


			}

		}

			updateMap();
	});

	d3Overlay.addTo(map);
}

$(function() {
	var container = d3.select('#container');
	d3.json("./data/homepark.json", function(data) {
		render(data, container);
	});
});