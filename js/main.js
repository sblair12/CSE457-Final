
var allData = [];
var stlMap;

loadData();



function loadData() {
    d3.csv("python/raw/all_parsed.csv", function (error, data_in) {
        allData = data_in;
        var holder = [0,0,0,0,0,0,0,0];
    for(var i =0; i<allData.length;i++){
        allData[i].XCoord = +allData[i].XCoord;
        allData[i].YCoord = +allData[i].YCoord;
        if(allData[i].Type.includes("Larceny")){
            holder[0] +=1;
        }
        else if(allData[i].Type === 'Robbery' || allData[i].Type === "Burglary"){
            holder[1] +=1;
        }
        else if(allData[i].Type === "Fraud"){
            holder[2] +=1;
        }
        else if(allData[i].Type === "Drug Abuse"){
            holder[3] +=1;
        }
        else if(allData[i].Type === 'Auto Theft'){
            holder[4] +=1;
        }
        else if(allData[i].Type === 'Assault' || allData[i].type === 'Weapons'){
            holder[5] +=1;
        }
        else if(allData[i].Type === 'Arson'){
            holder[6] +=1;
        }
        else{
            holder[7] +=1;
        }
    }
        var pie = d3.pie();
        var w = 300;
        var h = 300;
        var color = d3.scaleOrdinal(d3.schemeCategory10);
        var outerRadius = w/2;
        var innerRadius = w/5;
        var arc = d3.arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius);
        var svg = d3.select("body")
            .append("svg")
            .attr("width", w)
            .attr("height", h);
        var arcs = svg.selectAll("g.arc")
            .data(pie(holder))
            .enter()
            .append("g")
            .attr("class", "arc")
            .attr("transform", "translate(" + outerRadius + ", " + outerRadius + ")");
        arcs.append("path")
            .attr("fill", function(d, i) {
                return color(i);
            })
            .attr("d", arc);
        // arcs.append("text")
        //     .attr("transform", function(d) {
        //         return "translate(" + arc.centroid(d) + ")";
        //     })
        //     .attr("text-anchor", "middle")
        //     .text(function(d) {
        //         return d.value;
        //     });

        createVis();
    });
}


function createVis() {
    stlMap = new StlMap("map",allData,[38.631176, -90.252077]);
}