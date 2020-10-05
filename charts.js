function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
    buildCharts(firstSample);
    bubblechart(firstSample);
    gaugechart(firstSample)
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  bubblechart(newSample);
  gaugechart(newsample)
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
         var sData = data.samples;
        
    // 4. Create a variable that filters the samples for the object with the desired sample number.
         let sfData = sData.filter(d =>d.id == sample)

    //  5. Create a variable that holds the first sample in the array.
         fristData = sfData[0]

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    
          fristData.sample_values.sort((a,b)=>b-a)
          
          otu_ids = fristData.otu_ids.map(d=>'otu' +' '+d.toString());
          otu_labels = fristData.otu_labels;
          sample_values = fristData.sample_values;
    

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    
    var yticks = otu_ids.slice(0,10).reverse()
   

    // 8. Create the trace for the bar chart. 
    var barData = [{
        type:'bar',
        x:sample_values.slice(0,10),
        y:yticks.reverse(),
        orientation: 'h'
    } 
    ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
        title: 'top 10 otu',
        xaxis:{title: 'sample values'},
        yaxis:{title: 'smaple names',autorange:'reversed'}
        
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot(
     'bar',
      barData,
      barLayout
    )
  });
}
colorScale = d3.scaleOrdinal(d3.schemeCategory10)

function bubblechart(sample){
  
  d3.json('samples.json').then(d=>{
   console.log(d);
        dataSample = d.samples;
         datachoosed = dataSample.filter(d => d.id ==sample)
        
         datachoosed =datachoosed[0]
         
         otu_ids = datachoosed.otu_ids.slice(0,10);
         otu_labels = datachoosed.otu_labels.slice(0,10);
         sample_values = datachoosed.sample_values.slice(0,10);
         colorId = datachoosed.otu_ids.map(d=>{if(d>3350){
            return 'a'
     }else if(d>2900) {
       return 'b'
     }else if(d>2450){
       return 'c'
     }else if(d>2000) {
       return 'd'
     }else if (d>1500) {
       return 'e'
     }else if (d>1050){
       return 'g'
     }else if (d>700){
       return 'f'
     }else if (d>350){
      return 'h'
     }else{
       return 'i'
     }
   }
         )
         let trace = {
             x:datachoosed.otu_ids,
             y:datachoosed.sample_values,
             mode: 'markers',
             type: 'scatter',
             text: otu_labels,
             marker:{
               size:datachoosed.sample_values.map(d=>d*0.85),
               colorscale:datachoosed.otu_ids.map(d=>colorScale(d)),
               color: colorId.map(d =>colorScale(d))
             
             
             
             
             }
                          
             }
             

         
         labels = {
           title:'bacterial cuture per Sample',
           xaxis:{title:'otuid'},
           
           
         }


  Plotly.newPlot('bubble',[trace],labels)

  })
 }
 function gaugechart(sample){

  d3.json('samples.json').then(d =>{
     testD = d.metadata;

     retriveD = testD.filter(d =>d.id == sample);
     dataLast = retriveD[0].wfreq;
console.log(retriveD)

  trace = {
    mode:'number+gauge',
    value:dataLast,
    title:{text: 'frequncy of washing by week'},
    type:'indicator',
    gauge:{
    axis:{range :[0,10],tickwidth:1,thickcolor:'black'},
    bar:{color:'black'},
    steps:[
      {range: [0,2],color: 'red'},
      {range: [2,4],color: 'coral'},
      {range: [4,6],color: 'yellow'},
      {range: [6,8],color: 'lightgreen'},
      {range: [8,10],color: 'green'}
    ]
    

  }
 }
 var layout = {
   width: 400,
   height: 400,
   
   margin: { t: 60, r: 25, l: 25,b:0},
   font: { color: "darkblue", family: "Arial" }
 };
     Plotly.newPlot('gauge',[trace],layout)

  })


}



