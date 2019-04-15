StlMap = function(_parentElement, _data,_coordinates, _statistics) {
    this.parentElement = _parentElement;
    this.data = _data;
    this.coordinates = _coordinates;
    this.statistics = _statistics;
    this.initVis();
};

/*
 *  Initialize STL map
 */

StlMap.prototype.initVis = function() {
    var vis = this;
    L.Icon.Default.imagePath="images/";
    vis.map = L.map(vis.parentElement).setView(this.coordinates, 13);
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
    var markers = L.markerClusterGroup({ chunkedLoading: true,
        maxClusterRadius: 2*30,
        iconCreateFunction: defineClusterIcon
    });
    markers.on('clustermouseover', function (cluster) {
        // console.log(cluster.layer.getAllChildMarkers());
        vis.statistics.updateVis(cluster.layer.getAllChildMarkers().map(x => x.options))
        //cluster.layer.bindPopup("<div id='popup-content'></div>").openPopup();
    });
    // markers.on('clustermouseout', function (cluster) {
    //     console.log(cluster.layer.getAllChildMarkers());
    //     cluster.layer.closePopup();
    // });
    CustomMarker = L.Marker.extend({
        Complaint: "",
        DateOccur: "",
        Description: "",
        Address: "",
        Street: "",
        Type: ""
    });
    //http://bl.ocks.org/gisminister/10001728

    for(var i = 0; i < this.data.length; i++){
        var popupContent = "<strong>" + this.data[i].Description + "</strong> <br/>";
        popupContent += " Date Occured: " + this.data[i].DateOccur + "<br/>";
        popupContent += "Incident ID: " + this.data[i].Complaint + "<br/>";
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
        var marker = new CustomMarker(location,{
            icon: iconColor,
            Complaint: this.data[i].Complaint,
            DateOccur: this.data[i].DateOccur,
            Description: this.data[i].Description,
            Address: this.data[i].ILEADSAddress,
            Street: this.data[i].ILEADSStreet,
            Type: this.data[i].Type
        });
        marker.bindPopup(popupContent);
        markers.addLayer(marker);
    }
    this.map.addLayer(markers);
    vis.wrangleData();

};

function defineClusterIcon(cluster){
    var children = cluster.getAllChildMarkers(), n = children.length,
        strokeWidth = 1, r = 25,  iconDim = (r+strokeWidth)*2;

    var holder = [0,0,0,0,0,0,0,0];
    var holderTotal = 0;
    for(var i =0; i<n;i++){
        if(children[i].options.Type === "Larceny"){
            holder[0] +=1;
        }
        else if(children[i].options.Type === 'Robbery' || children[i].options.Type === "Burglary"){
            holder[1] +=1;
        }
        else if(children[i].options.Type === "Fraud"){
            holder[2] +=1;
        }
        else if(children[i].options.Type === "Drug Abuse"){
            holder[3] +=1;
        }
        else if(children[i].options.Type === 'Auto Theft'){
            holder[4] +=1;
        }
        else if(children[i].options.Type === 'Assault' || children[i].type === 'Weapons'){
            holder[5] +=1;
        }
        else if(children[i].options.Type === 'Arson'){
            holder[6] +=1;
        }
        else{
            holder[7] +=1;
        }
        holderTotal++;
        // console.log(children[i].options.Type);
    }
    // console.log(holder);
    //view-source:https://leaflet.github.io/Leaflet.markercluster/example/marker-clustering-custom.html

    html = bakeThePie({
        data: holder,
        data2: holderTotal,
        strokeWidth: 1,
        outerRadius: 25,
        innerRadius: 25-10,
        pieClass: 'cluster-pie',
        pieLabel: n,
        pieLabelClass: 'marker-cluster-pie-label',
    }),
        myIcon = new L.DivIcon({
            html: html,
            className: 'marker-cluster',
            // iconSize: new L.Point(200, 200)
        });

    return myIcon;
}

function bakeThePie(options) {
    var data = options.data;
    var dataTotal = options.data2;
        pathClassFunc = options.pathClassFunc?options.pathClassFunc:function(){return '';}, //Class for each path
        pieClass = options.pieClass?options.pieClass:'marker-cluster-pie', //Class for the whole pie
        pieLabelClass = options.pieLabelClass?options.pieLabelClass:'marker-cluster-pie-label',//Class for the pie label
        origo = 26, //Center coordinate
        w = origo*2, //width and height of the svg element
        h = w;
    console.log(dataTotal);

    var pie = d3.pie();
    var w = 50;
    var h = 50;
    var color = d3.scaleOrdinal(d3.schemeCategory20);
    var outerRadius = w/2;
    var innerRadius = w/5;
    var arc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);
    var svg = document.createElementNS(d3.namespaces, 'svg');
    //https://www.oreilly.com/library/view/interactive-data-visualization/9781491921296/ch13.html#chapter11-layouts
    var vis = d3.select(svg)
        .data([data])
        .attr("width", '50')
        .attr("height", '50')
        .attr("class", pieClass);

    var arcs = vis.selectAll("g.arc")
        .data(pie(data))
        .enter()
        .append('svg:g')
        .attr("class", "arc")
        .attr("transform", "translate(" + outerRadius + ", " + outerRadius + ")");
    arcs.append("svg:path")
        .attr("fill", function(d, i) {
            return color(i);
        })
        .attr("d", arc);

    vis.append('text')
        .attr('x',origo)
        .attr('y',origo)
        .attr('class', pieLabelClass)
        .attr('text-anchor', 'middle')
        //.attr('dominant-baseline', 'central')
        /*IE doesn't seem to support dominant-baseline, but setting dy to .3em does the trick*/
        .attr('dy','.3em')
        .text(dataTotal);

    // Return the svg-markup rather than the actual element
    return serializeXmlNode(svg);
}

function serializeXmlNode(xmlNode) {
    if (typeof window.XMLSerializer != "undefined") {
        return (new window.XMLSerializer()).serializeToString(xmlNode);
    } else if (typeof xmlNode.xml != "undefined") {
        return xmlNode.xml;
    }
    return "";
}


/*
 *  Data wrangling
 */

StlMap.prototype.wrangleData = function() {
    var vis = this;

    vis.updateVis();

};


StlMap.prototype.updateVis = function() {

};
