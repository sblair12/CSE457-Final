var allData = [];

loadData();


function loadData() {
    d3.csv("python/raw/all_parsed.csv", function (error, data_in) {
        allData = data_in;
    for(var i =0; i<allData.length;i++){
        allData[i].XCoord = +allData[i].XCoord;
        allData[i].YCoord = +allData[i].YCoord;
    }
        console.log(allData);

    createVis();
    });
}


function createVis() {
    var stlMap = new StationMap("map",allData,[38.630280, -90.200310]);
}