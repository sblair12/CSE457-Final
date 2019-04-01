
/*
 *  StationMap - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _data            -- Array with all stations of the bike-sharing network
 */

StationMap = function(_parentElement, _data,_coordinates) {

    this.parentElement = _parentElement;
    this.data = _data;
    this.coordinates = _coordinates;

    this.initVis();
};


/*
 *  Initialize station map
 */

StationMap.prototype.initVis = function() {
    var vis = this;
    L.Icon.Default.imagePath="images/";
    vis.map = L.map('station-map').setView([38.630280,-90.200310], 13);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(vis.map);
    // for(var i = 0; i < this.data.length; i++){
    // 	var popupContent = "<strong>" + data[i].name + "</strong> <br/>"
    // 	popupContent += " Available Bikes: " + data[i].nbBikes + "<br/>";
    // 	popupContent += " Available Docks: " +data[i].nbEmptyDocks;
    //
    // 	L.marker([data[i].lat,data[i].long])
    // 		.bindPopup(popupContent)
    // 		.addTo(vis.map);
    // }

    //
    // $.getJSON("mbta-lines.json", function(data) {
    // 	L.geoJson(data, {
    // 		style: function (feature) {
    // 			return {
    // 				color: feature.properties.LINE
    // 			}
    // 		},
    // 		weight: 5,
    // 		fillOpacity: 0.7
    // 	}).addTo(vis.map);
    //
    // });
    vis.wrangleData();
};


/*
 *  Data wrangling
 */

StationMap.prototype.wrangleData = function() {
    var vis = this;

    // Currently no data wrangling/filtering needed
    // vis.displayData = vis.data;

    // Update the visualization
    vis.updateVis();

};


/*
 *  The drawing function
 */

StationMap.prototype.updateVis = function() {

};
