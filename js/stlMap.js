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
    var LeafIcon = L.Icon.extend({
        options: {
            iconAnchor:   [13, 33], // point of the icon which will correspond to marker's location
            shadowUrl: 'images/marker-shadow.png',
        }
    });
    var blackIcon = new LeafIcon({iconUrl: "images/marker-icon-black.png"});
    var greenIcon = new LeafIcon({iconUrl: "images/marker-icon-green.png"});
    var greyIcon = new LeafIcon({iconUrl: "images/marker-icon-grey.png"});
    var orangeIcon = new LeafIcon({iconUrl: "images/marker-icon-orange.png"});
    var redIcon= new LeafIcon({iconUrl: "images/marker-icon-red.png"});
    var violetIcon = new LeafIcon({iconUrl: "images/marker-icon-violet.png"});
    var yellowIcon = new LeafIcon({iconUrl: "images/marker-icon-yellow.png"});
    var blueIcon = new LeafIcon({iconUrl: "images/marker-icon.png"});
    var iconColor;
    //MarkerCluster library to cluster the data so the website does not lag
    var markers = L.markerClusterGroup({ chunkedLoading: true });
    for(var i = 0; i < this.data.length; i++){
        var popupContent = "<strong>" + this.data[i].Description + "</strong> <br/>";
        popupContent += " Date Occured: " + this.data[i].DateOccur + "<br/>";
        var location = [this.data[i].XCoord,this.data[i].YCoord];

        if(this.data[i].Type.includes("Larceny")){
            iconColor = greyIcon;
        }
        else if(this.data[i].Type === 'Robbery' || this.data[i].Type === "Burglary"){
            iconColor = blackIcon;
        }
        else if(this.data[i].Type === "Fraud"){
            iconColor = greenIcon;
        }
        else if(this.data[i].Type === "Drug Abuse"){
            iconColor = violetIcon;
        }
        else if(this.data[i].Type === 'Auto Theft'){
            iconColor = orangeIcon;
        }
        else if(this.data[i].Type === 'Assault' || this.data[i].type === 'Weapons'){
            iconColor = yellowIcon;
        }
        else if(this.data[i].Type === 'Arson'){
            iconColor = redIcon;
        }
        else{
            iconColor = blueIcon;
        }
        var marker = L.marker(location,{icon: iconColor});
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
