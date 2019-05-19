// from data.js
var tableData = data;
// from states.js
var stateAbbr = states;

// Selects table and tbody and stores as vairables
var table = d3.select('#ufo-table');
var tbody = table.select('tbody');

// Function that fills table using data parameter
function tabulate(data) {
    data.forEach((entry) => {
        var tr = tbody.append('tr');
        tr.append('td').attr("class", "Date").text(entry.datetime);
        tr.append('td').attr("class", "City").text(entry.city);
        tr.append('td').attr("class", "State").text(entry.state);
        tr.append('td').attr("class", "Country").text(entry.country);
        tr.append('td').attr("class", "Shape").text(entry.shape);
        tr.append('td').attr("class", "Duration").text(entry.durationMinutes);
        tr.append('td').attr("class", "Comments").text(entry.comments);
    });
}

// Calls function to display all data as table initially
tabulate(tableData);

// Function to change state names to abbreviations
function changeStateAbbr(filterItem) {

    var abbr = "";

    // If state filter value is not an abbreviation
    if (filterItem.length > 2) {

        // Function to capitalize first letter
        String.prototype.capitalize = function () {
            return this.charAt(0).toUpperCase() + this.slice(1);
        }

        // Function to filter state data
        function abbreviation(state) {
            return state.name === filterItem.capitalize();
        }

        // Finds state abbreviation and changes to lowercase
        abbr = stateAbbr.filter(abbreviation);
        abbr = abbr[0]['abbreviation'].toLowerCase();
    }
    else {
        abbr = filterItem
    }
    return abbr;
};

// Defines filter object
var filters = {};
var submitButton = [];

// When a filter input form is changed
$(".form-control").on("keyup", function (e) {

    // Changes value to lowercase and saves id and value to variables
    var filterValue = e.target.value.toLowerCase();
    var filterID = e.target.id;

    // Adds object entry. (Will write over if filter input is changed) 
    filters[filterID] = filterValue;

    // If enter pressed, triggers submit button
    if (event.key === "Enter") {
        $('#submit')[0].click();
    }
});

// Saves buttons and input forms to variables
var filterButton = d3.select('#submit');
var refreshButton = d3.select('#refresh');
var clearButton = d3.select('#clear');
var filterInputs = d3.selectAll('.form-control');

// Clears input fields and input object
function clearEntries() {
    filters = {};

    // Sets every input field to empty
    filterInputs._groups[0].forEach(entry => {
        if (entry.value != 0) {
            d3.select('#' + entry.id).node().value = "";
        }
    });
};

// Filters data on submit
filterButton.on('click', function () {
    console.log(filters);

    // Keeps page from refreshing
    d3.event.preventDefault();

    // Removes table and text from any previous filter searches
    d3.select('.status').select('h1').remove();
    d3.select("#ufo-table").selectAll('td').remove();

    // Defines filtering data as original data
    var filtering = tableData;

    // For each filter saved previously, filters the data setting it equal to the newly fiiltered data
    Object.keys(filters).forEach(id => {

        // If the id = state, if state name => changes to abbreviation
        if (id === 'state') {
            filters[id] = changeStateAbbr(filters[id]);
        }

        function sightingData(sighting) {
            return sighting[id] === filters[id];
        };

        // Filters table data using previously defined function and store in same variable
        filtering = filtering.filter(sightingData);
    })

    // If the filtered data has results, creates table
    if (filtering.length !== 0) {
        tabulate(filtering);
    }
    // If there are no results, displays "no results" text
    else {
        d3.select('.status').append('h1').text("No Results");
    };

    // Clears input fields
    clearEntries();
});

// Refresh button on click refreshes table to original data
refreshButton.on('click', function () {

    // Keeps page from refreshing completely, only want the table to refresh
    d3.event.preventDefault();

    // Removes any remaining table and load full table
    d3.select("#ufo-table").selectAll('td').remove();
    d3.select('.status').select('h1').remove();

    // Creates table
    tabulate(tableData);
    // Clears input fields
    clearEntries();
})

// Clear button on click clears fields
clearButton.on('click', function () {

    // Keeps page from refreshing completely, only want the table to refresh
    d3.event.preventDefault();
    // Clears input fields
    clearEntries()
});