// define the url with data
let url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

// read the json data from the link and populate the dropdown box
d3.json(url).then(
    (data) => {
        // print the data to the console for reference
        console.log(data);

        // fill in dropdown box with data in the array "names"
        // define id names array
        let names = data.names;

        // define dropdown selection
        var dropdown = d3.select("#selDataset");

        // loop through names array to populate dropdown options
        for (i = 0; i < names.length; i++){

            // define a dropdown option
            let option = dropdown.append("option");

            // append an option value
            option.text(names[i]).property("value", names[i]);
        }
    }
);

// define function to populate demographic info panel with input
function demographicInfo(input){
    // populate metadata info into the demographic info panel
    d3.json(url).then(
        (data) => {
            // populate the metadata demographic info
            // pull metadata from json
            let metadata = data.metadata;

            // loop through each key-value pair and match the input
            for (i = 0; i < metadata.length; i++){
                // use if statement to check for match
                if (metadata[i].id == input){
                    // convert to text string
                    let id = "ID: " + metadata[i].id.toString();
                    let eth = "ETHNICITY: " + metadata[i].ethnicity;
                    let gen = "GENDER: " + metadata[i].gender;
                    let age = "AGE: " + metadata[i].age.toString();
                    let loc = "LOCATION: " + metadata[i].location;
                    let bbtype = "BBTYPE: " + metadata[i].bbtype;
                    let wfreq = "WFREQ: " + metadata[i].wfreq.toString();
    
                    // select metadata panel div
                    let panel = d3.select("#sample-metadata");
    
                    // populate the demigraphic panel with text strings using .html()
                    panel.html(id + "<br>" + eth + "<br>" + gen + "<br>" + age + "<br>" + loc + "<br>" + bbtype + "<br>" + wfreq);
                }
            }
        }
    );
}

// define function to populate bar chart
function barChart(input){
    d3.json(url).then(
        function(data){
            // define samples array
            let samples = data.samples;
            // loop through samples array to find match to dropdown value
            for (i = 0; i < samples.length; i++){
                // grab first sample
                let sample = samples[i];
    
                // use if statement to check if the id matches and create bar chart from that dataset
                if (sample.id == input){
                    // creat a list of dictionaries containing the sample data of that dataset
                    // define list variable
                    let idDataset = [];
    
                    // loop through arrays of the dataset to create dicitionary
                    for (j = 0; j < sample.otu_ids.length; j++){
                        let otuSample = {
                            "otu_id": "OTU " + sample.otu_ids[j].toString(),
                            "sample_val": sample.sample_values[j],
                            "otu_label": sample.otu_labels[j]
                        }
    
                        // append dictionary to list
                        idDataset.push(otuSample);
                    }
    
                    // sort data in descending order
                    let idDatasetSort = idDataset.sort((first, next) => next.sample_val - first.sample_val);
    
                    // slice the top 10 samples
                    let idDatasetSliced = idDatasetSort.slice(0 , 10);

                    // reverse data
                    idDatasetSliced.reverse();
    
                    // create bar chart
                    // set up data for chart
                    let barData = [{
                        x: idDatasetSliced.map(result => result.sample_val),
                        y: idDatasetSliced.map(result => result.otu_id),
                        text: idDatasetSliced.map(result => result.otu_label),
                        type: "bar",
                        orientation: "h"
                    }];
    
                    // set up layout for chart
                    let barLayout = {
                        title: "Top 10 Bacteria Cultures Found",
                        xaxis: {title: "Number of Bacteria"}
                    };

                    Plotly.newPlot("bar", barData, barLayout);
                }
            }
        }
    );
}

// define function to create bubble chart
function bubbleChart(input){
    d3.json(url).then(
        function(data){
            // pull sample data from json
            let samples = data.samples;

            // loop through samples to find matching id to the dropdown value
            for (i = 0; i < samples.length; i++){
                // define the first id samples
                let sample = samples[i];
    
                // use if statement to find matching id dataset
                if (sample.id == input){
                    // create bubble graph
                    // set up trace
                    let trace = {
                        x: sample.otu_ids,
                        y: sample.sample_values,
                        mode: "markers",
                        marker: {
                            size: sample.sample_values,
                            color: sample.otu_ids
                        },
                        text: samples.otu_labels
                    }
    
                    let bubbleData = [trace];
    
                    let bubbleLayout = {
                        title: "Bacteria Cultures Per Sample",
                        xaxis: {title: "OTU ID"},
                        yaxis: {title: "Number of Bacteria"}
                    }
    
                    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
                }
            }
        }
    );
}

// define function to initialize the dashboard
function init(){
    d3.json(url).then(
        (data) => {
            // pull first id from names array
            let firstID = data.names[0];

            // call on demographicInfo() function to populate the panel with the first name id info
            demographicInfo(firstID);

            // call on barChart() function to populate the chart with the first name id samples
            barChart(firstID);

            // call on bubbleChart() function to popuulate the chart with the first name id samples
            bubbleChart(firstID);

        }
    );
}

// define function that updates the dashboard new 
function optionChanged(item){
    // update demographic panel info with new id based on dropdown value
    demographicInfo(item);

    // update the bar graph
    barChart(item);

    // update the bubble graph
    bubbleChart(item);
}

// call on initialization function
init();