var xValue = "Year";
var yColumn = "Violent";
var xAxisLabels = "Year";
var xAxisLabelOffset = 48;
var yAxisLabels = "Crime Stats.";
var yAxisLabelOffset = 50;

var totalWidth = 950;
var totalHeight = 400;

var rMin = 2; // "r" stands for radius
var rMax = 8;

var type = "Refugees";
var paddedW = totalWidth - 90;
var paddedH = totalHeight - 65;

var selectedAttrib = "NULL";



function one(myArrayObject) 
{

   var svg = d3.select("#area1").append("svg")
        .attr("width",  totalWidth)
        .attr("height", totalHeight);
  var g = svg.append("g")
      .attr("transform", "translate(" + 70 + "," + 5 + ")");
  var xScale = d3.scale.linear().range([0, paddedW]);
  var yScale = d3.scale.linear().range([0, paddedH]);
  var rScale = d3.scale.linear().range([2, 7]);

  xScale.domain(d3.extent(myArrayObject, function(d) {   return d[xValue];  }));
  yScale.domain(d3.extent(myArrayObject, function(d) {    return d.Amt;  }));

	

  var tooltip = d3.select("#area1")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "20")
    .style("visibility", "hidden");

  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0]);
    svg.call(tip);


  var xAxisTransform = g.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + paddedH + ")")
  var xAxisLabel = xAxisTransform.append("text")
    .attr("x", paddedW / 2)
    .attr("y", xAxisLabelOffset)
    .attr("class", "label")
    .text(xAxisLabels);
  var yAxisTransform = g.append("g")
    .attr("class", "y axis");
  var yAxisLabel = yAxisTransform.append("text")
    .attr("transform", "translate(-" + yAxisLabelOffset + "," + (paddedH / 2) + ") rotate(-90)")
    .attr("class", "label")
    .text(yAxisLabels);
  var xAxis = d3.svg.axis().scale(xScale).orient("bottom")
    .ticks(15)
    .tickFormat(d3.format("Y"));
    // .outerTickSize(0);
  var yAxis = d3.svg.axis().scale(yScale).orient("left")
    .ticks(10)
    .tickFormat(d3.format("s"))
    .outerTickSize(1);

  xAxisTransform.call(xAxis);
  yAxisTransform.call(yAxis);
  var colorScale = d3.scale.category20();

  var circles = g.selectAll("circle").data(myArrayObject);
  circles.enter().append("circle");
  circles
    .attr("cx", function(d) {

      return xScale(d.Year);
    })
    .attr("cy", function(d) {
      console.log(yScale(d.Amt),d.Amt);
      return (yScale(d.Amt));
    })

  .attr("r", function(d) {
    return 5;

    })

    .style("stroke-width", 2)
    .attr("fill", function(d) {
    if(d.Type=="Murder")
      return "#801a00";
    else if(d.Type=="Rape")
      return "#ff751a";
    else if(d.Type=="Robbery")
      return "#cc6600";
    else if(d.Type=="Assault")
      return "#3333cc";
    else if(d.Type==type)
      return "#55ff00";
    })
    .on("mouseover", function(d) {
        tip.html(d.Type+","+Math.round(d.Amt*100)/100+"%");
        tip.show();

        d3.select(this).attr("r", 10)
          .style("opacity", "1");
      })
      .on("mouseout", function() {
      tip.hide();
      d3.select(this).attr("r", 5) 
});

  circles.exit().remove();


}




function two(myArrayObject) 
{

    var svg2 = d3.select("#area2").append("svg")
        .attr("width",  totalWidth)
        .attr("height", totalHeight);
  var g2 = svg2.append("g")
      .attr("transform", "translate(" + 70 + "," + 5 + ")");
  var xScale = d3.scale.linear().range([0, paddedW]);
  var yScale = d3.scale.linear().range([0, paddedH]);
  var rScale = d3.scale.linear().range([2, 7]);

  xScale.domain(d3.extent(myArrayObject, function(d) {   return d[xValue];  }));
  yScale.domain(d3.extent(myArrayObject, function(d) {    return d.Amt;  }));

  

  var tooltip = d3.select("#area2")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "20")
    .style("visibility", "hidden");

  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0]);
    svg2.call(tip);


  var xAxisTransform = g2.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + paddedH + ")")
  var xAxisLabel = xAxisTransform.append("text")
    .attr("x", paddedW / 2)
    .attr("y", xAxisLabelOffset)
    .attr("class", "label")
    .text(xAxisLabels);
  var yAxisTransform = g2.append("g")
    .attr("class", "y axis");
  var yAxisLabel = yAxisTransform.append("text")
    .attr("transform", "translate(-" + yAxisLabelOffset + "," + (paddedH / 2) + ") rotate(-90)")
    .attr("class", "label")
    .text(yAxisLabels);
  var xAxis = d3.svg.axis().scale(xScale).orient("bottom")
    .ticks(15)
    .tickFormat(d3.format("Y"));
    // .outerTickSize(0);
  var yAxis = d3.svg.axis().scale(yScale).orient("left")
    .ticks(10)
    .tickFormat(d3.format("s"))
    .outerTickSize(1);


  xAxisTransform.call(xAxis);
  yAxisTransform.call(yAxis);
  var colorScale = d3.scale.category20();

  var circles = g2.selectAll("circle").data(myArrayObject);
  circles.enter().append("circle");
  circles
    .attr("cx", function(d) {

      return xScale(d.Year);
    })
    .attr("cy", function(d) {
      console.log(yScale(d.Amt),d.Amt);
      return (yScale(d.Amt));
    })

  .attr("r", function(d) {
    return 5;

    })

    .style("stroke-width", 2)
    .attr("fill", function(d) {
    if(d.Type=="Burglary")
      return "#002b80";
    else if(d.Type=="Larceny")
      return "#000066";
    else if(d.Type=="Motor-vehicle")
      return "#8000ff";
    else if(d.Type==type)
      return "#ffff00";
    })
    .on("mouseover", function(d) {
        tip.html(d.Type+","+Math.round(d.Amt*100)/100+"%");
        tip.show();

        d3.select(this).attr("r", 10)
          .style("opacity", "1");
      })
      .on("mouseout", function() {
      tip.hide();
      d3.select(this).attr("r", 5) 
});

  circles.exit().remove();



}

function Refugeesd3(data)
{
  type = "Refugees";
  data1 = data.filter(function (d)
    { d3.select("svg").remove();  
    d3.select("svg2").remove();
     d3.select("g").remove();  
    d3.select("g2").remove();
      return (d.Type == "Rape" || d.Type =="Murder" || d.Type=="Robbery" || d.Type == "Assault" || d.Type == "Refugees");
  });
 data2 = data.filter(function (d)
    { d3.select("svg").remove();  
    d3.select("svg2").remove();
     d3.select("g").remove();  
    d3.select("g2").remove();
      return (d.Type == "Burglary" || d.Type =="Larceny" || d.Type=="Motor-vehicle" || d.Type == "Refugees");
  }); 
  one(data1);
  two(data2);
}

function Permenant_Residentsd3(data)
{
  type = "Lawfull";
  data1 = data.filter(function (d)
    { d3.select("svg").remove();  
    d3.select("svg2").remove();
     d3.select("g").remove();  
    d3.select("g2").remove();
      return (d.Type == "Rape" || d.Type =="Murder" || d.Type=="Robbery" || d.Type == "Assault" || d.Type == "Lawfull");
  });
 data2 = data.filter(function (d)
    { d3.select("svg").remove();  
    d3.select("svg2").remove();
     d3.select("g").remove();  
    d3.select("g2").remove();
      return (d.Type == "Burglary" || d.Type =="Larceny" || d.Type=="Motor-vehicle" || d.Type == "Lawfull");
  }); 
  one(data1);
  two(data2);
}


function Non_Immigrantsd3(data)
{
  type = "Non-Im";
  data1 = data.filter(function (d)
    { d3.select("svg").remove();  
    d3.select("svg2").remove();
     d3.select("g").remove();  
    d3.select("g2").remove();
      return (d.Type == "Rape" || d.Type =="Murder" || d.Type=="Robbery" || d.Type == "Assault" || d.Type == "Non-Im");
  });
 data2 = data.filter(function (d)
    { d3.select("svg").remove();  
    d3.select("svg2").remove();
     d3.select("g").remove();  
    d3.select("g2").remove();
      return (d.Type == "Burglary" || d.Type =="Larceny" || d.Type=="Motor-vehicle" || d.Type == "Non-Im");
  }); 
  one(data1);
  two(data2);
}

function StudentsF1d3(data)
{
  type = "Students";
  data1 = data.filter(function (d)
    { d3.select("svg").remove();  
    d3.select("svg2").remove();
     d3.select("g").remove();  
    d3.select("g2").remove();
      return (d.Type == "Rape" || d.Type =="Murder" || d.Type=="Robbery" || d.Type == "Assault" || d.Type == type);
  });
 data2 = data.filter(function (d)
    { d3.select("svg").remove();  
    d3.select("svg2").remove();
     d3.select("g").remove();  
    d3.select("g2").remove();
      return (d.Type == "Burglary" || d.Type =="Larceny" || d.Type=="Motor-vehicle" || d.Type == type);
  }); 
  one(data1);
  two(data2);
}


function Aliens_Removedd3(data)
{
  type = "Alien";
  data1 = data.filter(function (d)
    { d3.select("svg").remove();  
    d3.select("svg2").remove();
     d3.select("g").remove();  
    d3.select("g2").remove();
      return (d.Type == "Rape" || d.Type =="Murder" || d.Type=="Robbery" || d.Type == "Assault" || d.Type == type);
  });
 data2 = data.filter(function (d)
    { d3.select("svg").remove();  
    d3.select("svg2").remove();
     d3.select("g").remove();  
    d3.select("g2").remove();
      return (d.Type == "Burglary" || d.Type =="Larceny" || d.Type=="Motor-vehicle" || d.Type == type);
  }); 
  one(data1);
  two(data2);
}


function Refugees() {
  d3.select("svg").remove();
  d3.csv("data/crime-year.csv", Refugeesd3);
}

function Permenant_Residents() {
  d3.select("svg").remove();
  d3.csv("data/crime-year.csv", Permenant_Residentsd3);
}

function Non_Immigrants() {
  d3.select("svg").remove();
  d3.csv("data/crime-year.csv", Non_Immigrantsd3);
}

function StudentsF1() {
  d3.select("svg").remove();
  d3.csv("data/crime-year.csv", StudentsF1d3);
}

function Aliens_Removed() {
  d3.select("svg").remove();
  d3.csv("data/crime-year.csv", Aliens_Removedd3);
}

 d3.csv("data/crime-year.csv", Refugeesd3);