var allData = [];
var stlMap;
var statistics;

loadData();


function loadData() {
    d3.csv("python/raw/all_parsed.csv", function (error, data_in) {
        allData = data_in;
    for(var i =0; i<allData.length;i++){
        allData[i].XCoord = +allData[i].XCoord;
        allData[i].YCoord = +allData[i].YCoord;
        allData[i].DateOccur = new Date(allData[i].DateOccur);
    }
        console.log(allData);

    createVis();
    });
}


function createVis() {
    statistics = new Statistics("statistics");
    stlMap = new StlMap("station-map",allData,[38.631176, -90.252077], statistics);
}