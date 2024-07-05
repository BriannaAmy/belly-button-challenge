// define the url with data
let url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

// read the json data from the link and populate the dropdown box
d3.json(url).then(
    function(data){
        // print the data to the console for reference
        console.log(data);

        // fill in dropdown box with data in the array "names"
        // define id names array
        let names = data.names;

        // define dropdown selection
        let dropdown = d3.select("#selDataset");

        // loop through names array to populate dropdown options
        for (i = 0; i < names.length; i++){

            // define a dropdown option
            let option = dropdown.append("option");

            // append an option value
            option.append("value").text(names[i]);
        }
    }
);

// create horizontal bar chart of top 10 OTUs for id that is selecting in the dropdown box
d3.json(url).then(
    function(data){
        // define samples array
        let samples = data.samples;

        // initialize bar graph
        function init(){
            // pull the dropdown value
            let dropdownVal = d3.select("#selDataset").property("value");

            // loop through samples array to find match to dropdown value
            for (i = 0; i < samples.length; i++){
                // grab first sample
                let sample = samples[i];

                // use if statement to check if the id matches and create bar chart from that dataset
                if (sample.id == dropdownVal){
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
                    let layout = {
                        title: "Top 10 Bacteria Cultures Found",
                        xaxis: {title: "Number of Bacteria"}
                    };

                    Plotly.newPlot("bar", barData, layout);
                }
            }
        }

        function optionChanged(){
            // pull the dropdown value
            let dropdownVal = d3.select("#selDataset").property("value");

            // loop through samples array to find match to dropdown value
            for (i = 0; i < samples.length; i++){
                // grab first sample
                let sample = samples[i];

                // use if statement to check if the id matches and create bar chart from that dataset
                if (sample.id == dropdownVal){
                    // creat a list of dictionaries containing the sample data of that dataset
                    // define list variable
                    let idDataset = [];

                    // loop through arrays of the dataset to create dicitionary
                    for (j = 0; j < sample.otu_ids.length; j++){
                        let otuSample = {
                            "otu_id": sample.otu_ids[j].toString(),
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

                    // pull data for x, y and text values
                    let xVals = idDatasetSliced.map(result => result.sample_val);
                    let yVals = idDatasetSliced.map(result => result.otu_id);
                    let textVals = idDatasetSliced.map(result => result.otu_label);

                    //Plotly.restyle("bar", "x", [xVals]);
                    //Plotly.restyle("bar", "y", [yVals]);
                    //Plotly.restyle("bar", "text", [textVals]);
                }
            }
        }

        d3.select("#selDataset").on("change", optionChanged());

        init();
    }
);

// create a bubble chart based on the dropdown value
d3.json(url).then(
    function(data){
        // pull sample data from json
        let samples = data.samples;

        // initialize the bubble graph
        function init(){
            // pull dropdown value
            let dropdownVal = d3.select("#selDataset").property("value");

            // loop through samples to find matching id to the dropdown value
            for (i = 0; i < samples.length; i++){
                // define the first id samples
                let sample = samples[i];

                // use if statement to find matching id dataset
                if (sample.id == dropdownVal){
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

                    let layout = {
                        title: "Bacteria Cultures Per Sample",
                        xaxis: {title: "OTU ID"},
                        yaxis: {title: "Number of Bacteria"}
                    }

                    Plotly.newPlot("bubble", bubbleData, layout);
                }
            }
        }

        // function for restyling chart when dropdown value is changed
        function optionChanged(){
            
        }

        d3.select("#selDataset").on("change", optionChanged());

        init();
    }
);

// populate demographic info for each id
d3.json(url).then(
    function(data){
        // pull metadata from json
        let metadata = data.metadata;

        // display metadata in console
        console.log(metadata);

        // initialize info table
        function init(){
            // pull dropdown value
            let dropdownVal = d3.select("#selDataset").property("value");

            // loop through each key-value pair and match the id dropdown value
            for (i = 0; i < metadata.length; i++){
                // use if statement to check for match
                if (metadata[i].id == dropdownVal){
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

                    panel.html(id + "<br>" + eth + "<br>" + gen + "<br>" + age + "<br>" + loc + "<br>" + bbtype + "<br>" + wfreq);
                }
            }
        }

        d3.select("#selDataset").on("change", init());

        init();
    }
);