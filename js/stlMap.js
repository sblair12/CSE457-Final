var thisObject;
StlMap = function(_parentElement, _data,_coordinates, _statistics) {
    this.parentElement = _parentElement;
    this.data = _data;
    this.coordinates = _coordinates;
    this.statistics = _statistics;
    this.initVis();
    thisObject = this;
};

/*
 *  Initialize STL map
 */

StlMap.prototype.initVis = function() {
    var vis = this;
    vis.color = d3.scaleOrdinal(d3.schemeCategory20);
    // console.log(vis.color);
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
        iconCreateFunction: vis.icon
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

    //https://d3-legend.susielu.com/
    var linear = d3.scaleOrdinal()
        .domain(["Homicide", "Rape", "Robbery", "Assault", "Burglary", "Larceny", "Auto Theft", "Other Assault", "Arson",
            "Forgery", "Fraud", "Embezzlement"])
        .range([ vis.color(0), vis.color(1), vis.color(2), vis.color(3),vis.color(4),vis.color(5),vis.color(6),
                vis.color(7),vis.color(8),vis.color(9),vis.color(10),vis.color(11)]);
    var svg = d3.select("#legend")
        .append("svg")
        .attr("height","80")
        .attr("width","1485");
    svg.append("g")
        .attr("class", "legendLinear")
        .attr("transform", "translate(20,20)");
    var legendLinear = d3.legendColor()
        .shapeWidth(120)
        .cells(10)
        .orient('horizontal')
        .scale(linear);

    svg.select(".legendLinear")
        .call(legendLinear);
    var linear = d3.scaleOrdinal()
        .domain(["Stolen Property", "Vandalism", "Weapons", "Prostitution", "Sex Offenses",
            "Drug Abuse", "Gambling", "Neglect", "DUI", "Liquor Related", "Drunkenness", "Disorderly Cond...", "Vagrancy",
            "Other Offenses", "Suspicion", "Curfew", "Runaways"])
        .range([vis.color(12),vis.color(13), vis.color(14),vis.color(15),vis.color(16),vis.color(17),vis.color(18),vis.color(19),vis.color(20),
            vis.color(21),vis.color(22),vis.color(23),vis.color(24),vis.color(25),vis.color(26),vis.color(27),
            vis.color(28)]);
    var svg = d3.select("#legend")
        .append("svg")
        .attr("height","80")
        .attr("width","1484");
    svg.append("g")
        .attr("class", "legendLinear")
        .attr("transform", "translate(20,20)");
    var legendLinear = d3.legendColor()
        .shapeWidth(120)
        .cells(10)
        .orient('horizontal')
        .scale(linear);

    svg.select(".legendLinear")
        .call(legendLinear);


};
StlMap.prototype.createPieCharts = function(options){
    var vis = this;
    var data = options.data;
    var dataTotal = options.data2;
        pieClass = options.pieClass?options.pieClass:'marker-cluster-pie', //Class for the whole pie
        pieLabelClass = options.pieLabelClass?options.pieLabelClass:'marker-cluster-pie-label',//Class for the pie label
        center = 26, //Center coordinate
        w = center*2,
        h = w;

    var pie = d3.pie();
    var width = 50;
    var height = 50;
    var outerRadius = width/2;
    var innerRadius = width/5;
    var arc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);
    var svg = document.createElementNS(d3.namespaces, 'svg');
    // https://www.oreilly.com/library/view/interactive-data-visualization/9781491921296/ch13.html#chapter11-layouts
    var overallSvg = d3.select(svg)
        .data([data])
        .attr("width", '50')
        .attr("height", '50')
        .attr("class", pieClass);
    var arcs = overallSvg.selectAll("g.arc")
        .data(pie(data))
        .enter()
        .append('svg:g')
        .attr("class", "arc")
        .attr("transform", "translate(" + outerRadius + ", " + outerRadius + ")");
    arcs.append("svg:path")
        .attr("fill", function(d, i) {
            return vis.color(i);
        })
        .attr("d", arc);
    overallSvg.append('text')
        .attr('x',center)
        .attr('y',center)
        .attr('class', pieLabelClass)
        .attr('text-anchor', 'middle')
        .attr('dy','.3em')
        .text(dataTotal);
    // Return the svg-markup rather than the actual element
    return serializeXmlNode(svg);
};

StlMap.prototype.icon = function(cluster) {
    var children = cluster.getAllChildMarkers(), n = children.length;
    var holder = [0,0,0,0,0,0,0,0];
    var holderTotal = 0;
    for(var i =0; i<n;i++){
        if(children[i].options.Type === "Homicide"){
            holder[0] +=1;
        }
        else if(children[i].options.Type === 'Rape' ){
            holder[1] +=1;
        }
        else if(children[i].options.Type === "Robbery"){
            holder[2] +=1;
        }
        else if(children[i].options.Type === "Assault"){
            holder[3] +=1;
        }
        else if(children[i].options.Type === 'Burglary'){
            holder[4] +=1;
        }
        else if(children[i].options.Type === 'Larceny'){
            holder[5] +=1;
        }
        else if(children[i].options.Type === 'Auto Theft'){
            holder[6] +=1;
        }
        else if(children[i].options.Type === "Other Assault"){
            holder[7] +=1;
        }
        else if(children[i].options.type === 'Arson'){
            holder[8] +=1;
        }
        else if(children[i].options.type === 'Forgery'){
            holder[9] +=1;
        }
        else if(children[i].options.type === 'Fraud'){
            holder[10] +=1;
        }
        else if(children[i].options.type === 'Embezzlement'){
            holder[11] +=1;
        }
        else if(children[i].options.type === 'Stolen Property'){
            holder[12] +=1;
        }
        else if(children[i].options.type === 'Vandalism'){
            holder[13] +=1;
        }
        else if(children[i].options.type === 'Weapons'){
            holder[14] +=1;
        }
        else if(children[i].options.type === 'Prostitution'){
            holder[15] +=1;
        }
        else if(children[i].options.type === 'Sex Offenses'){
            holder[16] +=1;
        }
        else if(children[i].options.type === 'Drug Abuse'){
            holder[17] +=1;
        }
        else if(children[i].options.type === 'Gambling'){
            holder[18] +=1;
        }
        else if(children[i].options.type === 'Neglect'){
            holder[19] +=1;
        }
        else if(children[i].options.type === 'DUI'){
            holder[20] +=1;
        }
        else if(children[i].options.type === 'Liquor Related'){
            holder[21] +=1;
        }
        else if(children[i].options.type === 'Drunkenness'){
            holder[22] +=1;
        }
        else if(children[i].options.type === 'Disorderly Conduct'){
            holder[23] +=1;
        }
        else if(children[i].options.type === 'Vagrancy'){
            holder[24] +=1;
        }
        else if(children[i].options.type === 'Other Offenses'){
            holder[25] +=1;
        }
        else if(children[i].options.type === 'Suspicion'){
            holder[26] +=1;
        }
        else if(children[i].options.type === 'Curfew'){
            holder[27] +=1;
        }
        else if(children[i].options.type === 'Runaways'){
            holder[28] +=1;
        }
        holderTotal++;
    }
    //view-source:https://leaflet.github.io/Leaflet.markercluster/example/marker-clustering-custom.html
    html = thisObject.createPieCharts({
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
        });

    return myIcon;
};


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
