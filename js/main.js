var allData = [];
var stlMap;

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
    stlMap = new StlMap("map",allData,[38.631176, -90.252077]);
}