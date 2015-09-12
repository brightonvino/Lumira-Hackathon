define("br810_viz_ext_crime-src/js/render", [], function() {
	/*
	 * This function is a drawing function; you should put all your drawing logic in it.
	 * it's called in moduleFunc.prototype.render
	 * @param {Object} data - proceessed dataset, check dataMapping.js
	 * @param {Object} container - the target d3.selection element of plot area
	 * @example
	 *   container size:     this.width() or this.height()
	 *   chart properties:   this.properties()
	 *   dimensions info:    data.meta.dimensions()
	 *   measures info:      data.meta.measures()
	 */
	var render = function(data, container) {
		console.log(JSON.stringify(data));

		try {

			require.config({
				'paths': {
					//'leaflet': '../sap/bi/bundles/br810/viz/ext/crime/leaflet'
					'leaflet': 'leaflet'
				},
				shim: {
					leaflet: {
						exports: 'leaflet'
					},
					crimeData: {
						deps: ['leaflet']
					}
				}
			});

			define("runtime", function(require) {
				var leaflet = require('leaflet');
				// return the required objects - can be used when module is used inside a require function
				return {
					leaflet: leaflet
				};
			});

			require.onError = function(err) {
				if (err.requireType === 'timeout') {
					//console.log("error: " + err);
				} else {
					throw err;
				}
			};

			require(["runtime"], function(runt) {
				var div = container.selectAll('#map');
				if (div[0].length === 0) {
					div = container.append('div').attr('id', 'map');
					
					var L = runt.leaflet;
var map = L.map('map').setView([45, 10], 3);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
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


			});

		} catch (Exception) {
			//console.log("Error: " + Exception);
		}
	};
	return render;
});