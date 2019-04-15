Statistics = function(_parentElement, _data,_coordinates) {
    this.parentElement = _parentElement;
    this.initVis();
};

/*
 *  Initialize Statistics
 */
Statistics.prototype.initVis = function() {
    var vis = this;
    vis.margin = {top: 50, right: 50, bottom: 50, left: 50};
    vis.width = 300 - vis.margin.left - vis.margin.right;
    vis.height = 300 - vis.margin.top - vis.margin.bottom;
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");
};

Statistics.prototype.updateVis = function() {

};
