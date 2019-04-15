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
        // iconCreateFunction: defineClusterIcon
    });
    markers.on('clustermouseover', function (cluster) {
        console.log(cluster.layer.getAllChildMarkers());
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
    for(var i =0; i<n;i++){
        if(children[i].Type === "Larceny"){
            holder[0] +=1;
        }
        else if(children[i].Type === 'Robbery' || children[i].Type === "Burglary"){
            holder[1] +=1;
        }
        else if(children[i].Type === "Fraud"){
            holder[2] +=1;
        }
        else if(children[i].Type === "Drug Abuse"){
            holder[3] +=1;
        }
        else if(children[i].Type === 'Auto Theft'){
            holder[4] +=1;
        }
        else if(children[i].Type === 'Assault' || children[i].type === 'Weapons'){
            holder[5] +=1;
        }
        else if(children[i].Type === 'Arson'){
            holder[6] +=1;
        }
        else{
            holder[7] +=1;
        }
    }
    console.log(holder);

    html = bakeThePie({
        valueFunc: holder,
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
            iconSize: new L.Point(iconDim, iconDim)
        });

    return myIcon;
}

function bakeThePie(options) {
    /*data and valueFunc are required*/
    if (!options.data || !options.valueFunc) {
        return '';
    }
    // var data = options.data,
    //     valueFunc = options.valueFunc,
    //     r = options.outerRadius?options.outerRadius:28, //Default outer radius = 28px
    //     rInner = options.innerRadius?options.innerRadius:r-10, //Default inner radius = r-10
    //     strokeWidth = options.strokeWidth?options.strokeWidth:1, //Default stroke is 1
    //     pathClassFunc = options.pathClassFunc?options.pathClassFunc:function(){return '';}, //Class for each path
    //     pathTitleFunc = options.pathTitleFunc?options.pathTitleFunc:function(){return '';}, //Title for each path
    //     pieClass = options.pieClass?options.pieClass:'marker-cluster-pie', //Class for the whole pie
    //     pieLabel = options.pieLabel?options.pieLabel:d3.sum(data,valueFunc), //Label for the whole pie
    //     pieLabelClass = options.pieLabelClass?options.pieLabelClass:'marker-cluster-pie-label',//Class for the pie label

        origo = 26, //Center coordinate
        w = origo*2, //width and height of the svg element
        h = w,
        donut = d3.layout.pie(),
        arc = d3.svg.arc().innerRadius(15).outerRadius(r);

    //Create an svg element
    var svg = document.createElementNS(d3.ns.prefix.svg, 'svg');
    //Create the pie chart
    var vis = d3.select(svg)
        .data([data])
        .attr('class', pieClass)
        .attr('width', w)
        .attr('height', h);

    var arcs = vis.selectAll('g.arc')
        .data(donut.value(valueFunc))
        .enter().append('svg:g')
        .attr('class', 'arc')
        .attr('transform', 'translate(' + origo + ',' + origo + ')');

    arcs.append('svg:path')
        .attr('class', pathClassFunc)
        .attr('stroke-width', strokeWidth)
        .attr('d', arc)
        // .append('svg:title')
        // .text(pathTitleFunc);

    vis.append('text')
        .attr('x',origo)
        .attr('y',origo)
        // .attr('class', pieLabelClass)
        // .attr('text-anchor', 'middle')
        //.attr('dominant-baseline', 'central')
        /*IE doesn't seem to support dominant-baseline, but setting dy to .3em does the trick*/
        // .attr('dy','.3em')
        // .text(pieLabel);
    //Return the svg-markup rather than the actual element
    return serializeXmlNode(svg);
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
