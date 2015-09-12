


var render = function (data, container) {
        var weekMap = {
        1: "Monday",
        2: "Tuesday",
        3: "Wednesday",
        4: "Thursday",
        5: "Friday",
        6: "Saturday",
        7: "Sunday"
    };


    var setupSideFilterPanel = function() {

                var $container = $(container[0]);
                
                console.log($container);
                
                
                var rootWidth = $container.parent().parent().width();
                var rootHeight = $container.parent().parent().height();
                $container.parent().width(rootWidth);
                $container.parent().height(rootHeight);
                $container.parent().css('top', '0px');
                $container.parent().css('left', '0px');
                
                $container.width(rootWidth);
                $container.height(rootHeight);
                $container.css('top', '0px');
                $container.css('left', '0px');
                
                
                // add side filter panel
                $container.append(
                    "<span class='theateam-side-filter'>\
                        <input type='checkbox' id='theateam-colorcode-active'/>\
                        <span>\
                        <div class='theateam-side-filter-header'>Crime Types</div>\
                        <input type='checkbox' id='theateam-aggassualt-filter'/> Agg Assault<br>\
                        <input type='checkbox' id='theateam-gta-filter'/> Grand Theft Auto<br>\
                        <input type='checkbox' id='theateam-burglary-filter'/> Burglary<br>\
                        <input type='checkbox' id='theateam-homicide-filter'/> Homicide<br>\
                        <input type='checkbox' id='theateam-larceny-filter'/> Larceny<br>\
                        <input type='checkbox' id='theateam-rape-filter'/> Rape<br>\
                        <input type='checkbox' id='theateam-robbery-filter'/> Robbery<br><br>\
                        <input type='checkbox' id='theateam-day-filter-active' checked/>Day: <label class='theateam-day-label'>Monday</label><br>\
                        <div id='theateam-dayslider-range'></div>\
                        <input type='checkbox' id='theateam-time-filter-active' checked/>Hour: <label class='theateam-time-label'>0 - 24</label><br>\
                        <div id='theateam-timeslider-range'></div><br>\
                        </span>\
                    </span>"
                );
                
                $( "#theateam-dayslider-range" ).slider({
                    range: false,
                    min: 1,
                    max: 7,
                    value: 1,
                    slide: function( event, ui ) {
                      $(".theateam-day-label").text(weekMap[ui.value]);
                    }
                });
                
                $( "#theateam-timeslider-range" ).slider({
                    range: true,
                    min: 0,
                    max: 24,
                    values: [ 0, 24 ],
                    slide: function( event, ui ) {
                      $(".theateam-time-label").text(ui.values[ 0 ] + " - " + ui.values[ 1 ]);
                    }
                });
                
                $("#theateam-day-filter-active").change(function() {
                    if ($(this).is(':checked')) {
                        $( "#theateam-dayslider-range" ).slider( "enable" );
                    } else {
                        $( "#theateam-dayslider-range" ).slider( "disable" );
                    }
                    $("#theateam-dayslider-range").toggleClass('theateam-filter-input-disabled');
                });
                
                $("#theateam-time-filter-active").change(function() {
                    if ($(this).is(':checked')) {
                        $( "#theateam-timeslider-range" ).slider( "enable" );
                    } else {
                        $( "#theateam-timeslider-range" ).slider( "disable" );
                    }
                    $("#theateam-timeslider-range").toggleClass('theateam-filter-input-disabled');
                });
                
                $("#theateam-day-filter").change(function() {
                    $(".theateam-day-label").text(weekMap[this.value]);
                });
                
                $container.append("<span class='theateam-side-filter-handle' data-expanded=true><i class='fa fa-filter theateam-filter-icon'></i></span>");
                
                var filterPos = $(".theateam-side-filter").position();
                var filterWidth = $(".theateam-side-filter").width();
                $(".theateam-side-filter-handle").css('top', filterPos.top);
                $(".theateam-side-filter-handle").css('right', $(".theateam-side-filter").width());
                
                $(".theateam-side-filter-handle").on('click', function() {
                    if($(".theateam-side-filter-handle").data('expanded')) {
                        $(".theateam-side-filter").animate({
                            width: '0%'
                        });
                        $(".theateam-side-filter-handle").animate({
                            right: '0px'
                        });
                        $(".theateam-side-filter-handle").data('expanded', false);
                    } else {
                        $(".theateam-side-filter").animate({
                            width: '20%'
                        });
                        $(".theateam-side-filter-handle").animate({
                            right: filterWidth
                        });
                        $(".theateam-side-filter-handle").data('expanded', true);
                    }
                    
                });
                
                
    }

    setupSideFilterPanel();
        
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

function renderMap(originalData, map, container) {
    var updateMap;
    var init = false;

    var d3Overlay = L.d3SvgOverlay(function (selection, projection) {

        updateMap = function () {
            var data = monthDimension.top(Infinity);
            if (data.length === originalData.length)
                return;

            data = data.filter(function (d) {
                return !((d.Lat === "") || (d.Long === ""));
            });

            var feature = selection.selectAll("circle")
                    .data(data, function (d) {
                        return d.ID;
                    });

            console.log("Filtered: " + data.length);
            
            var colorScale = d3.scale.ordinal()
            .domain(["Auto Theft", "Robbery", "Agg Assault", "Burglary", "Larceny", "Homicide", "Rape"])
            .range(["#2ca02c", "#1f77b4", "#9467bd", "#bcbd22", "#bd9e39", "#ff7f0e", "#d62728"]);
    

            tip = d3.tip()
                    .offset([-10, 0])
                    .attr('class', 'd3-tip').html(function (d) {
                return '<div class="theateam-tip"><span class="type"> ' + d.CrimeDetail + '</span><span class="location">Location: ' + d.Address + '</span><span class="time">Time: ' + d.Date + " " + d.Time + '</span></div>';
            });
            selection.call(tip);

            feature.enter().append("circle")
                    .attr("class", "crime")
                    .attr("r", function (d) {
                        return Math.log(d.Rating) * 2 * 0.5 / Math.min(projection.layer._scale, 15);
                    })
                    .attr('cx', function (d) {
                        return projection.latLngToLayerPoint([parseFloat(d.Long), parseFloat(d.Lat)]).x;
                    })
                    .attr('cy', function (d) {
                        return projection.latLngToLayerPoint([parseFloat(d.Long), parseFloat(d.Lat)]).y;
                    })
                    .attr("fill", function(d){
                        if(false){
                            return colorScale(d.CrimeType);
                        } else {
                            return "#d62728";
                        }
                    })
                    .on('mouseover', tip.show)
                    .on('mouseout', tip.hide);

            feature.exit().remove();

            feature.attr("r", function (d) {
                return Math.log(d.Rating) * 2 * 0.5 / Math.min(projection.layer._scale, 15);
            }).attr('cx', function (d) {
                return projection.latLngToLayerPoint([parseFloat(d.Long), parseFloat(d.Lat)]).x;
            }).attr('cy', function (d) {
                return projection.latLngToLayerPoint([parseFloat(d.Long), parseFloat(d.Lat)]).y;
            });
        };

        if (init === false) {
            init = true;

            cfData = crossfilter(originalData);

            var timeChartDiv = container.selectAll('#time-chart');
            if (timeChartDiv[0].length === 0) {
                timeChartDiv = container.append('div').attr('id', 'time-chart').classed('dc-chart', true);

                var dcjs;
                if ($('.sapUiBody').length !== 0) {
                    dcjs = runt.dcjs;
                } else {
                    dcjs = dc;
                }

                var dateDimension = cfData.dimension(function (d) {
                    var dateParts = d.Date.split('/');
                    var dateObj = new Date(Number(dateParts[2]) + 2000, Number(dateParts[0]) - 1, Number(dateParts[1]));
                    return dateObj;
                });

                window.monthDimension = cfData.dimension(function (d) {
                    var dateParts = d.Date.split('/');
                    var dateObj = new Date(Number(dateParts[2]) + 2000, Number(dateParts[0]) - 1, Number(dateParts[1]));
                    return dateObj;
                });

                var openGroup = monthDimension.group().reduceSum(function (d) {
                    return 1;
                });

                var timeChart = dc.barChart('#time-chart');
                timeChart.width(800)
                        .height(120)
                        .margins({top: 20, right: 30, bottom: 25, left: 30})
                        .dimension(monthDimension)
                        .group(openGroup)
                        .x(d3.time.scale().domain([new Date("2009-01-01T00:00:00Z"), new Date("2015-09-15T00:00:00Z")]))
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

function getCrimeColor(crimeType) {
    
}

$(function () {
    var container = d3.select('#container');
    d3.json("./data/HomePark.json", function (data) {
        render(data, container);
    });
});
