
//Width and height of map
var width = 960;
var height = 500;





		
// Define linear scale for output
// var color = d3.scale.linear()
// 			  .range(["rgb(213,222,217)","rgb(69,173,168)","rgb(84,36,55)","rgb(217,91,67)"]);

// var legendText = ["Cities Lived", "States Lived", "States Visited", "Nada"];

//Create SVG element and append map to the SVG
// Load in my states data!

// def update(profession) {
// 	data = data.filter(function (d1)
//       {
//       return d1.Profession == "Sales";

//       });
// }
var selected = "Management";
var csv = "data/names2012.csv";
// document.getElementById("option").onchange = function() {
function runstates(data) 
{

	// D3 Projection
var projection = d3.geo.albersUsa()
				   .translate([width/2, height/2])    // translate to center of screen
				   .scale([1000]);          // scale things down so see entire US
        
// Define path generator
var path = d3.geo.path()               // path generator that will convert GeoJSON to SVG paths
		  	 .projection(projection);  // tell path generator to use albersUsa projection
var svg = d3.select("body")
			.append("svg")
			.attr("width", width)
			.attr("height", height);
        
// Append Div for tooltip to SVG
var div = d3.select("body")
		    .append("div")   
    		.attr("class", "tooltip")               
    		.style("opacity", 0);
var heatmapColor = d3.scale.linear()
  .range(["#ffe6e6", "#1a0000"])//d3.range(0, 1, 1.0 / (colors.length - 1)))
  .domain(d3.extent(data, function(d1) {console.log("prop:",d1.Total);	if(d1.Total>5000) return 5000; else return d1.Total;  }))
  .interpolate(d3.interpolateLab);// 

// var colors = ["#000000","#080000","#100000","#180000","#200000","#280000","#300000","#380000","#400000",
// 			"#480000","#500000","#580000","#600000","#680000","#700000","#780000","#800000","#880000",
// 			"#900000","#980000","#A00000","#A80000","#B00000","#B80000","#C00000","#C80000","#D00000",
// 			"#D80000","#E00000","#E80000","#F00000","#F80000","#FF0000"];
//["#ffe6e6", "#ff0000", "#1a0000"]
// var cc = ["#6363ff", "#6373ff", "#63A3ff", "#63E3ff", "#63fffb", "#63ffcb",
//          "#63ff9b", "#63ff6b", "#7bff63", "#bbff63", "#dbff63", "#fbff63", 
//          "#ffd363", "#ffb363", "#ff8363", "#ff7363", "#ff6364"];
 //colors);
 // d3.scale.linear(data)
 //    .domain(d3.extent(data, function(d1) {  console.log("d1 "+d1.Total); return d1.Total;  }))//;(d3.range(0, 1, 1.0 / (colors.length - 1)))
 //    .range(["#6363FF", "#6373FF", "#63A3FF", "#63E3FF", "#63FFFB", "#63FFCB",
 //           "#63FF9B", "#63FF6B", "#7BFF63", "#BBFF63", "#DBFF63", "#FBFF63", 
 //           "#FFD363", "#FFB363", "#FF8363", "#FF7363", "#FF6364"])//(["#d7191c", "#ffffbf", "#2c7bb6"])
 //   .interpolate(d3.interpolateHcl);
 // Load GeoJSON data and merge with states data
d3.json("us-states.json", function(json) {

// Loop through each state data value in the .csv file
for (var i = 0; i < data.length; i++) {

	// Grab State Name
	var dataState = data[i].State;
	// console.log(dataState);
	// Grab data value 
	var dataValue = data[i].Total;
// console.log(dataValue);
	// Find the corresponding state inside the GeoJSON
	for (var j = 0; j < json.features.length; j++)  {
		var jsonState = json.features[j].properties.NAME;

		if (dataState == jsonState) {

		// Copy the data value into the JSON
		json.features[j].properties.Total = dataValue; 

		break;
		}
	}
}


  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0]);
    svg.call(tip);

// Bind the data to the SVG and create one path per GeoJSON feature
// console.log("came here 3");
svg.selectAll("path")
	.data(json.features)
	.enter()
	.append("path")
	.attr("d", path)
	.style("stroke", "#fff")
	.style("stroke-width", "1")
	.style("fill", function(d) {

	// Get data value
	var value = heatmapColor(d.properties.Total);
	//console.log("Val:"+heatmapColor(d.properties.Total)+d.properties.Total);
	if (value) {
	return heatmapColor(d.properties.Total);//heatmapColor(d.properties.Total);
	} else {
	return "rgb(1,1,1)";
	}
	})	
	.on("mouseover", function(d) {  
    
		tip.html(d.properties.Total+" State:"+d.properties.NAME+heatmapColor(d.properties.Total));
        tip.show();
    
	})   
            
    .on("mouseout", function(d) {       
    	tip.hide();
        div.transition()        
           .duration(500)      
           .style("opacity", 0);   
    });


d3.csv("data/fbiall.csv", function(data) {
data = data.filter(function (d1)
    {	//console.log("h:",d1.Year,csv.substring(10,14)); 
    return d1.Year == csv.substring(10,14);});

svg.selectAll("circle")
	.data(data)
	.enter()
	.append("circle")
	.attr("cx", function(d) {
		return projection([d.Long, d.Lat])[0];
	})
	.attr("cy", function(d) {
		return projection([d.Long, d.Lat])[1];
	})
	.attr("r", function(d) {
		return Math.sqrt(d.Violent) / 8;
	})
	.style("fill", "#80ffff")	
	.style("opacity", 0.5)
	.on("mouseover", function(d) {  
    
		tip.html(d.Metropoliton+" (%):"+Math.round(d.Property/d.Violent*100)/100);
        tip.show();
    
	})   
            
    .on("mouseout", function(d) {       
    	tip.hide();})
} );
        

	});

}



function typeManagement(data){
	d3.select("svg").remove();	
 	data = data.filter(function (d1)
    {	return d1.Profession == "Management";});
	runstates(data);
}

function typeService(data){
	d3.select("svg").remove();	
 	data = data.filter(function (d1)
    {	return d1.Profession == "Service";});
	runstates(data);
}

function typeSales(data){
	d3.select("svg").remove();	
 	data = data.filter(function (d1)
    {	return d1.Profession == "Sales";});
	runstates(data);
}
  
function typeFarming(data){
	d3.select("svg").remove();	
 	data = data.filter(function (d1)
    {	return d1.Profession == "Farming";});
	runstates(data);
}

function typeConstruction(data){
	d3.select("svg").remove();	
 	data = data.filter(function (d1)
    {	return d1.Profession == "Construction";});
	runstates(data);
}

function typeProduction(data){
	d3.select("svg").remove();	
	// console.log("over");
 	data = data.filter(function (d1)
    {	return d1.Profession == "Production";});
	runstates(data);
}

function typeMilitary(data){
 		d3.select("svg").remove();	
 	data = data.filter(function (d1)
    {return d1.Profession == "Military";});
	runstates(data);
}

function typeStudents(data){
		d3.select("svg").remove();	
 	data = data.filter(function (d1)
    {return d1.Profession == "Students";});
	runstates(data);
}

function typeRetirees(data){
		d3.select("svg").remove();	
 	data = data.filter(function (d1)
    {return d1.Profession == "Retirees";});
	runstates(data);
}

function typeNo(data){
		d3.select("svg").remove();	
 	data = data.filter(function (d1)
    {return d1.Profession == "No";});
	runstates(data);
}

function typeHomemakers(data){
		d3.select("svg").remove();	
 	data = data.filter(function (d1)
    {return d1.Profession == "Homemakers";});
	runstates(data);
}

function typeUnemployed(data){
		d3.select("svg").remove();	
 	data = data.filter(function (d1)
    {return d1.Profession == "Unemployed";});
	runstates(data);
}

function typeUnknown(data){
		d3.select("svg").remove();	
 	data = data.filter(function (d1)
    {return d1.Profession == "Unknown";});
	runstates(data);
}

d3.select("#option").on("input", function() {
    selected =this.value;
    	d3.select("svg").remove();	
    	d3.select("path").remove();
    	d3.select("heatmapColor").remove();
    	// d3.select("div").remove();
    //var str1 = "type";
    // var selected2 = str1.concat(selected);
    // console.log(selected2);
    // d3.csv("names.csv", selected2);

//console.log("came here");
if(selected=="Management") 
	d3.csv(csv, typeManagement);
else if(selected=="Service") 
	d3.csv(csv, typeService);
else if(selected=="Sales") 
	d3.csv(csv, typeSales);
else if(selected=="Farming") 
	d3.csv(csv, typeFarming);
else if(selected=="Construction") 
	d3.csv(csv, typeConstruction);
else if(selected=="Production") 
	d3.csv(csv, typeProduction);
else if(selected=="Military") 
	d3.csv(csv, typeMilitary);
else if(selected=="Students") 
	d3.csv(csv, typeStudents);
else if(selected=="Retirees") 
	d3.csv(csv, typeRetirees);
else if(selected=="No") 
	d3.csv(csv, typeNo);
else if(selected=="Homemakers") 
	d3.csv(csv, typeHomemakers);
else if(selected=="Unemployed")
	d3.csv(csv, typeUnemployed);
else if(selected=="Unknown") 
	d3.csv(csv, typeUnknown);

  });
d3.select("#nh").on("input", function() {
    	
    	csv = "data/names"+this.value+".csv";
    	console.log(csv);
    	d3.select("svg").remove();	
    	d3.select("path").remove();
    	d3.select("heatmapColor").remove();
    	// d3.select("div").remove();

if(selected=="Management") 
	d3.csv(csv, typeManagement);
else if(selected=="Service") 
	d3.csv(csv, typeService);
else if(selected=="Sales") 
	d3.csv(csv, typeSales);
else if(selected=="Farming") 
	d3.csv(csv, typeFarming);
else if(selected=="Construction") 
	d3.csv(csv, typeConstruction);
else if(selected=="Production") 
	d3.csv(csv, typeProduction);
else if(selected=="Military") 
	d3.csv(csv, typeMilitary);
else if(selected=="Students") 
	d3.csv(csv, typeStudents);
else if(selected=="Retirees") 
	d3.csv(csv, typeRetirees);
else if(selected=="No") 
	d3.csv(csv, typeNo);
else if(selected=="Homemakers") 
	d3.csv(csv, typeHomemakers);
else if(selected=="Unemployed")
	d3.csv(csv, typeUnemployed);
else if(selected=="Unknown") 
	d3.csv(csv, typeUnknown);
});
d3.csv("data/names2012.csv", typeManagement);