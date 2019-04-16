var allData = [];
var stlMap;
var statistics;
var types = ["Homicide", "Rape", "Robbery", "Assault", "Burglary", "Larceny", "Auto Theft", "Other Assault", "Arson",
    "Forgery", "Fraud", "Embezzlement", "Stolen Property", "Vandalism", "Weapons", "Prostitution", "Sex Offenses",
    "Drug Abuse", "Gambling", "Neglect", "DUI", "Liquor Related", "Drunkenness", "Disorderly Conduct", "Vagrancy",
    "Other Offenses", "Suspicion", "Curfew", "Runaways"];
var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];

loadData();


function loadData() {
    d3.csv("python/output/all_parsed.csv", function (error, data_in) {
        allData = data_in;
        var holder = [0,0,0,0,0,0,0,0];
        for(var i =0; i<allData.length;i++){
            allData[i].XCoord = +allData[i].XCoord;
            allData[i].YCoord = +allData[i].YCoord;
            allData[i].DateOccur = new Date(allData[i].DateOccur);
        }

        //Initialize month selector ticks
        let range = document.getElementById("month-select");
        let ticks = document.getElementById("month-ticks");
        let selected = document.getElementById("selected");
        months.forEach((month, index) => {
           let option = document.createElement("option");
           option.innerHTML = index;
           ticks.appendChild(option);
        });
        range.addEventListener("input", function() {
            selected.innerHTML = months[this.value];
            updateType();
        });
        document.getElementById("month-enabled").addEventListener("change", function() {
           range.disabled = !this.checked;
           selected.innerHTML = (this.checked) ? months[range.value] : "All Months";
           updateType();
        });

        //Initialize type selector
        let select = document.getElementById("type-select");
        let option = document.createElement("option");
        option.value = -1;
        option.innerHTML = "All types";
        select.appendChild(option);
        types.forEach((elem, index) => {
            option = document.createElement("option");
            option.value = index;
            option.innerHTML = elem;
            select.appendChild(option);
        });
        select.addEventListener("change", updateType);

        createVis();
    });
}

function createVis() {
    statistics = new Statistics("statistics", allData);
    stlMap = new StlMap("station-map",allData,[38.631176, -90.252077], statistics);
}

function updateType() {
    let type = document.getElementById("type-select").value;
    let checked = document.getElementById("month-enabled").checked;
    let month = document.getElementById("month-select").value;
    let newData = allData;
    if (type != -1) {
        newData = allData.filter(x => x.Type === types[type]);
    }
    if (checked) {
        newData = newData.filter(x => x.DateOccur.getMonth() == month);
    }
    console.log(newData);
    statistics.updateVis(newData);
    stlMap.updateMap(newData);
}