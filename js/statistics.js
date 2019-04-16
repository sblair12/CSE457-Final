Statistics = function(_parentElement, _data) {
    this.parentElement = _parentElement;
    this.initVis(_data);
};

/*
 *  Initialize Statistics
 */
Statistics.prototype.initVis = function(data) {
    var vis = this;
    vis.margin = {top: 50, right: 50, bottom: 50, left: 50};
    vis.width = 600 - vis.margin.left - vis.margin.right;
    vis.height = 600 - vis.margin.top - vis.margin.bottom;
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");
    vis.x = d3.scaleBand()
        .rangeRound([0, vis.width])
        .paddingInner(0.1);

    vis.y = d3.scaleLinear()
        .range([vis.height, 0]);

    vis.xAxisSvg = vis.svg.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", "translate(0," + (vis.height) + ")");
    vis.yAxisSvg = 	vis.svg.append("g")
        .attr("id", "y-axis")
        .attr("class", "axis y-axis");
    vis.axisLabel = vis.svg.append("text")
        .attr("transform", "translate(-20,-10)")
        .attr("text-anchor", "middle");
    vis.updateVis(data);
};

Statistics.prototype.updateVis = function(data) {
    let vis = this;
    let hours = [];
    for(var i = 0; i < 25; i++) {
        hours.push(0);
    }
    data.forEach((elem) => {
        hours[elem.DateOccur.getHours()] += 1;
    });

    vis.x.domain(hours.map((x, i) => i));
    vis.y.domain([
        0,
        d3.max(hours, d => d)
    ]);
    var bars = vis.svg.selectAll("rect")
        .data(hours);

    bars.enter().append("rect")
        .attr("width", vis.x.bandwidth())
        .attr("class", "bar")
        .merge(bars)
        .style("opacity", 0.5)
        .transition()
        .duration(800)
        .style("opacity", 1)
        .attr("x", function(d, index) { return vis.x(index); })
        .attr("y", function(d) { return vis.y(d); })
        .attr("height", function(d) { return vis.height - vis.y(d); });

    bars.exit().remove();

    var xAxis = d3.axisBottom()
        .scale(vis.x)
        .tickValues(vis.x.domain().filter(function(d,i){ return !(i%6)}));
    var yAxis = d3.axisLeft()
        .scale(vis.y);

    vis.xAxisSvg.transition().duration(800).call(xAxis);
    vis.yAxisSvg.transition().duration(800).call(yAxis);
};
