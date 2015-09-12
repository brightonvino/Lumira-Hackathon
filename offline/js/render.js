var render = function(data, container) {

	console.log(JSON.stringify(data));


	var div = container.selectAll('#map');
	if (div[0].length === 0) {
		div = container.append('div').attr('id', 'map');
		
		var leaflet;
		if ($('.sapUiBody').length !== 0) {
			leaflet = runt.leaflet;
		}
		else {
			leaflet = L;
		}


		var map = L.map('map').setView([45, 10], 3);

		leaflet.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
			attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
			maxZoom: 18,
			id: 'shobhitg.na7jk2f5',
			accessToken: 'pk.eyJ1Ijoic2hvYmhpdGciLCJhIjoiNmI1Nzg0ZmIzMWY4OGU4MGEzYzI3ZGIxMzBhZmQ4NmUifQ.z5e8zocByNWRqW6VPfxpwg'
		}).addTo(map);
	}

	var svg = container.selectAll('svg');
	if (svg[0].length === 0) {
		svg = container.append('svg');
	}

	svg.selectAll('circle')
		.data([1, 2, 3, 4, 5, 6])
		.enter()
		.append('circle')
		.attr('cx', function(d) {
			return d * 20;
		})
		.attr('cy', function(d) {
			return d * 20;
		})
		.attr('r', function(d) {
			return 5;
		});

	//container.select(div).append();
	// TODO: add your own visualization implementation code below ...

};



$(function() {
	var container = d3.select('#container');
	d3.json("/offline/data/crime-1k.json", function(data) {
	    render(data, container);
	});
		
});