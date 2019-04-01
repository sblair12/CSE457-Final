
var allData = [];

// Variable for the visualization instance
var stationMap;

// Start application by loading the data
loadData();


function loadData() {

    // Proxy url
    var proxy = 'http://michaeloppermann.com/proxy.php?format=xml&url=';

    // Hubway XML station feed
    var url = 'https://member.bluebikes.com/data/stations/bikeStations.xml';

    // TO-DO: LOAD DATA

    // $.getJSON(proxy + url, function(jsonData){
    //     // Work with data
    //     data = jsonData.station;
    //     for(var i = 0; i<data.length; i++){
    //         data[i].id = + data[i].id;
    //         data[i].installDate = +data[i].installDate;
    //         data[i].lastCommWithServer = +data[i].lastCommWithServer;
    //         data[i].lat = +data[i].lat;
    //         data[i].latestUpdateTime = +data[i].latestUpdateTime;
    //         data[i].long = +data[i].long;
    //         data[i].nbBikes = +data[i].nbBikes;
    //         data[i].nbEmptyDocks = +data[i].nbEmptyDocks;
    //         data[i].removalDate = +data[i].removalDate;
    //     }
    //     allData = data;
    //     $("#station-count").text(data.length);
    //     createVis();
    // });
    createVis();
}


function createVis() {
    console.log(allData);
    var stationMap = new StationMap("station-map",allData,[42.360081, -71.058884]);


    // TO-DO: INSTANTIATE VISUALIZATION

}