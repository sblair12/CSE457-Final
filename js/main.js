var allData = [];
var stlMap;
var statistics;

loadData();


function loadData() {
    d3.csv("python/output/all_parsed_test.csv", function (error, data_in) {
        allData = data_in;
    for(var i =0; i<allData.length;i++){
        allData[i].XCoord = +allData[i].XCoord;
        allData[i].YCoord = +allData[i].YCoord;
        allData[i].DateOccur = new Date(allData[i].DateOccur);
    }
        createVis();
    });
}


function createVis() {
    statistics = new Statistics("statistics", allData);
    stlMap = new StlMap("station-map",allData,[38.631176, -90.252077], statistics);
}