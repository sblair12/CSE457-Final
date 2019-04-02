StationMap = function(_parentElement, _data,_coordinates) {
    // this.parentElement = _parentElement;
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
    vis.map = L.map('station-map').setView(this.coordinates, 13);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(vis.map);

    //MarkerCluster library to cluster the data so the website does not lag
    var markers = L.markerClusterGroup({ chunkedLoading: true });
    for(var i = 0; i < this.data.length; i++){
    	var popupContent = "<strong>" + this.data[i].Description + "</strong> <br/>";
    	popupContent += " Date Occured: " + this.data[i].DateOccur + "<br/>";
        var location = [this.data[i].XCoord,this.data[i].YCoord];
        var marker = L.marker(location);
        marker.bindPopup(popupContent);
        markers.addLayer(marker);
    }
    this.map.addLayer(markers);
    vis.wrangleData();
};


/*
 *  Data wrangling
 */

StationMap.prototype.wrangleData = function() {
    var vis = this;

    vis.updateVis();

};


StationMap.prototype.updateVis = function() {

};
