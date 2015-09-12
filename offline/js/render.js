var render = function (data, container) {

    var div = container.selectAll('#map');
    if (div[0].length === 0) {
        div = container.append('div').attr('id', 'map');

        var leaflet;
        if ($('.sapUiBody').length !== 0) {
            leaflet = runt.leaflet;
        } else {
            leaflet = L;
        }

        var map = L.map('map').setView([33.775, -84.40], 14);

        leaflet.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 20,
            id: 'shobhitg.na7jk2f5',
            accessToken: 'pk.eyJ1Ijoic2hvYmhpdGciLCJhIjoiNmI1Nzg0ZmIzMWY4OGU4MGEzYzI3ZGIxMzBhZmQ4NmUifQ.z5e8zocByNWRqW6VPfxpwg'
        }).addTo(map);

        renderMap(data, map);
    }
};

function renderMap(data, map) {
    var updateMap;

    var d3Overlay = L.d3SvgOverlay(function (selection, projection) {
        
        updateMap = function () {
            var feature = selection.selectAll("circle")
                    .data(data);
            
            feature.enter().append("circle")
                    .style("opacity", .2)
                    .style("fill", "red")
                    .attr("r", function (d) {
                        return Math.log(d.MinOfucr) * 2 / Math.min(projection.layer._scale, 18);
                    })
                    .attr('cx', function (d) {
                        return projection.latLngToLayerPoint([parseFloat(d.y), parseFloat(d.x)]).x;
                    })
                    .attr('cy', function (d) {
                        return projection.latLngToLayerPoint([parseFloat(d.y), parseFloat(d.x)]).y;
                    });

            feature.exit().remove();

            feature.attr('stroke-width', 1 / projection.layer._scale)
                    .attr("r", function (d) {
                        return Math.log(d.MinOfucr) * 2 * 1 / Math.min(projection.layer._scale, 15);
                    });
        };
        
        updateMap();
    });

    d3Overlay.addTo(map);
}

$(function () {
    var container = d3.select('#container');
    d3.json("./data/crime-1k.json", function (data) {
        render(data, container);
    });
});