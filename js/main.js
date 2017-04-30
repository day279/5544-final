$('body').scrollspy({
    target: '.bs-docs-sidebar',
    offset: 40
});
$("#sidebar").affix({
    offset: {
      top: 60
    }
});

function buildImmigrationOverview(section_id) {
    var margin = {top: 30, right:20, bottom:30, left:80};
    var legendSize = {width: 20, height: 30};
    var legendRectSize = 10, legendSpacing = 4;
    var width = 600 - margin.left - margin.right - legendSize.width,
	    height = 400 - margin.top - margin.bottom;

    var xScale = d3.scaleLinear().range([0, width]);
    var yScale = d3.scaleLog().range([height, 0]);
    var seriesScale = d3.scaleOrdinal(d3.schemeCategory10);

    var xAxis = d3.axisBottom().scale(xScale);
    xAxis.tickFormat(d3.format("d"));
    var yAxis = d3.axisLeft().scale(yScale);
    yAxis.ticks(10, "d");

    var svg = d3.select(section_id).append("svg")
        .attr("width",  width + margin.left + margin.right + legendSize.width)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    function render(data) {
    	var series = data.columns.slice(1).map(function(id) {
    		var temp = {
    			id: id,
    			values: data.map(function(d) { return {year: d.Year, value: d[id]}; })
				.filter(function(d) { var answer = (d.year > 0 && NaN != d.year && d.value > 0 && NaN != d.value); return answer;})
				
    		};
		temp.domain = d3.extent(temp.values, function(d) {return d.year;});
                return temp;
    	});

    	xScale.domain( [d3.min(data, function(d) {return d.Year}) - 1, d3.max(data, function(d) {return d.Year;})]);
    	yScale.domain( [1, d3.max(data, function(d) {return d.Population;})]);
    	seriesScale.domain(series.map(function(s) {return s.id;}));

    	var line = d3.line()
	    	.curve(d3.curveBasis)
	    	.x(function(d) {return xScale(d.year);})
	    	.y(function(d) {return yScale(d.value);});

    	svg.append("g")
    		.attr("class", "axis axis--x")
    		.attr("transform", "translate(0," + height + ")")
    		.call(xAxis);

    	svg.append("g")
    		.attr("class", "axis axis--y")
    		.call(yAxis)
    		.append("text")
    		.attr("transform", "rotate(-90) ")
    		.attr("y", 6)
    		.attr("dy", "0.71em")
    		.attr("fill", "#000")
    		.text("Number of Persons");

    	var trends = svg.selectAll(".trend")
    		.data(series)
    		.enter().append("g")
    		.attr("class", "trend");
    	trends.append("path")
    		.attr("class", "line")
    		.attr("d", function(d) {var temp = line(d.values); return temp; })
    		.style("stroke", function(d) {return seriesScale(d.id); });
    	trends.append("text")
    		.datum(function(d) {return {id: d.id, value: d.values[d.values.length-1]}; })
    		.attr("transform", function(d) {return "translate(" + xScale(d.value.year) + "," + yScale(d.value.value) + ")";})
    		.attr("x", 3)
    		.attr("dy", "0.35em")
    		.style("font", "10px sans-serif")
    		.text(function(d) {return d.id;});

        var mouseG = svg.append("g").attr("class", "mouse-over-effects");
        mouseG.append("path")
		.attr("class", "mouse-line")
		.style("stroke", "black")
		.style("stroke-width", "1px")
		.style("opacity", "0");
	var lines = document.getElementsByClassName('line');

        var mousePerLine = mouseG.selectAll('.mouse-per-line')
           .data(series)
           .enter()
           .append("g")
           .attr("class", "mouse-per-line");

        mousePerLine.append("circle")
           .attr("r", 7)
           .style("stroke", function(d) {
	     return seriesScale(d.id);
           })
          .style("fill", "none")
          .style("stroke-width", "1px")
          .style("opacity", "0");

        mousePerLine.append("text")
          .attr("transform", "translate(10,3)");

        mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
          .attr('width', width) // can't catch mouse events on a g element
          .attr('height', height)
          .attr('fill', 'none')
          .attr('pointer-events', 'all')
          .on('mouseout', function() { // on mouse out hide line, circles and text
	    d3.select(".mouse-line")
	      .style("opacity", "0");
	    d3.selectAll(".mouse-per-line circle")
	      .style("opacity", "0");
	    d3.selectAll(".mouse-per-line text")
	      .style("opacity", "0");
          })
          .on('mouseover', function() { // on mouse in show line, circles and text
	    d3.select(".mouse-line")
	      .style("opacity", "1");
	    d3.selectAll(".mouse-per-line circle")
	      .style("opacity", "1");
	    d3.selectAll(".mouse-per-line text")
	      .style("opacity", "1");
          })
          .on('mousemove', function() { // mouse moving over canvas
	    var mouse = d3.mouse(this);
	    d3.select(".mouse-line")
	      .attr("d", function() {
	        var d = "M" + mouse[0] + "," + height;
	        d += " " + mouse[0] + "," + 0;
	        return d;
	      });

	    d3.selectAll(".mouse-per-line")
	      .attr("transform", function(d, i) {
	        var xDate = Math.round(xScale.invert(mouse[0]));
		if (xDate < series[i].domain[0] || xDate > series[i].domain[1]){
		  d3.select(this).style("opacity", "0");
		  return "translate(0,0)";
		} else {
		  d3.select(this).style("opacity", "1");
		  var actual_val = series[i].values.filter(function(d) { return d.year == xDate;})[0];
                  if (actual_val == undefined){
		 	d3.select(this).style("opacity", "0");
		  	return "";
		  }
		  d3.select(this).select('text')
	              .text(actual_val.value);
	      
		  return "translate(" + mouse[0] + "," + yScale(actual_val.value) +")";
		}
	  });
      });

    }

    d3.csv("data/cps-TableA1-with-dhs.csv", function(d){
    	return {
    		Year: +d.Year,
    		Population: +d.Population * 1000,
    		Movers_from_abroad: +d.Movers_from_abroad,
    		Permanent_Residents: +d.Permanent_Residents,
    		Refugee_Arrivals: +d.Refugee_Arrivals,
    		Asylum: +d.Asylum
    	};
    }, render);

}



function buildImmigrationState(section_id) {
    var width = 600,
	height = 400;

    var color = d3.scaleQuantile().range([d3.interpolateOranges(0), d3.interpolateOranges(0.25), d3.interpolateOranges(0.5), d3.interpolateOranges(0.75), d3.interpolateOranges(1)]);

    var svgTop = d3.select(section_id).append("svg")
          .attr("width",  width)
          .attr("height", height);
    var svg = svgTop.append("g")
	  .attr("transform", "scale(" + width/1000 + ")");

    svg.append("g")
	.attr("class", "states")
	.attr("id", "stateG");

    var path = d3.geoPath();
    var topology = null; 
    var immigrationData = null;
    var variables = [];
    var activeVariable = null,
	activeYear = null;

    var stateNameMap = {};
    var stateNameMapReversed = {};

    d3.tsv("data/us-state-names.tsv", function(error, data) {
	data.forEach(function (d) {
		stateNameMap[d.name] = +d.id;
		stateNameMapReversed[+d.id] = d.name;
	});
    });

    function render() {
        var variableData = immigrationData.filter(function(d) { return d.id == activeVariable;})[0];
	color.domain(variableData.valueDomain);
        var variableDataPerYearMap = variableData.values[activeYear];

	//console.log(activeYear);
	//console.log(activeVariable);
	//console.log(variableDataPerYearMap);

	var paths = d3.select("#stateG")
	  .selectAll("path")
	    .data(topojson.feature(topology, topology.objects.states).features)
	    .attr("fill", function(d) {return color(variableDataPerYearMap[+d.id]);});
	paths.enter().append("path")
	    .attr("class", "states")
	    .attr("fill", function(d) {return color(variableDataPerYearMap[+d.id]);})
            .attr("d", path);
	paths.exit()
	    .attr("fill", "#000");
    }

    function appendOptions(){
	var yearDomain = immigrationData.filter(function(d) { return d.id == activeVariable;})[0].yearDomain;

	var yearSlider = d3.select("#yearSlider")
	    .attr("min", yearDomain[0])
	    .attr("max", yearDomain[1])
	    .attr("value", activeYear)
	    .attr("step", 1);
	d3.select("#yearSlider-value").text(activeYear);

	yearSlider.on("input", function() {
		activeYear = +this.value;
		d3.select("#yearSlider-value").text(activeYear);
		render();
	    });

	var variableSelect = d3.select("#variableOptions")
	    .append("select")
	      .attr("name", "variableOptions");
	variableSelect.selectAll("option")
	      .data(variables)
		.enter()
		.append("option")
    		.attr("value", function(d) {return d;})
		.text(function(d) {return d;});
	variableSelect.on("input", function() {
		activeVariable = this.value;
		render();
	});
    }

    function process(data) {
	return data.columns.slice(2).map(function(id) {
	    var v = data.map(function(d) { return {year: d.Year, state: d.State, value: d[id]}; })
		    .filter(function(d) { var answer = (d.value > 0 && NaN != d.value); return answer;});
	    var yDom = d3.extent(v, function(d) {return d.year;});
	    var vDom = d3.extent(v, function(d) {return d.value;});
	    var valuesByYear = {};

            for (var y = yDom[0]; y <= yDom[1]; y++) {
		var map = {}
		v.filter(function(d) { return d.year == y; })
		    .forEach(function (d) {map[stateNameMap[d.state]] = d.value;});
		valuesByYear[y] = map;
	    }

	    return {
		id: id,
		values: valuesByYear,
		yearDomain: yDom,
		valueDomain: vDom
	    };
    	});
    }

    d3.json("https://d3js.org/us-10m.v1.json", function(error, us) {
	if (error) throw error;

        topology = us;

	svg.append("path")
	    .attr("class", "state-borders")
	    .attr("d", path(topojson.mesh(topology, topology.objects.states, function(a, b) { return a !== b; })) );

        d3.csv("data/acs-with-dhs.csv", function(d){
        //d3.csv("data/short.csv", function(d){
    	    return {
    		Year: +d.Year,
    		State: d.State,
    		Population: +d.Population,
    		Foreign_Residents: +d.Foreign_Residents,
    		Permanent_Residents: +d.Permanent_Residents,
    		Naturalized: +d.Naturalized,
    		Nonimmigrant_Admissions: +d.Nonimmigrant_Admissions,
    		Visa_Waiver_Tourists_Travelers: +d.Visa_Waiver_Tourists_Travelers,
    		Other_Tourists_Travelers: +d.Other_Tourists_Travelers,
    		Students: +d.Students,
    		Temporary_Workers: +d.Temporary_Workers,
    		Diplomats: +d.Diplomats,
    		Other: +d.Other,
    		Unknown: +d.Unknown,
    		Violent_Crime: +d.Violent_Crime,
    		Property_Crime: +d.Property_Crime,
    		Income_per_capita: +d.Income_per_capita,
    		Poverty_Rate: +d.Poverty_Rate,
    		Food_Insecure_Rate: +d.Food_Insecure_Rate,
    		Very_low_food_secure_rate: +d.Very_low_food_secure_rate,
    		Unemployment_Rate: +d.Unemployment_Rate
    	    };
        }, function(data) {
		immigrationData = process(data);
		immigrationData.forEach(function(d){
		    variables.push(d.id);
		});
		activeVariable = immigrationData[0].id;
		activeYear = immigrationData[0].yearDomain[0];
		render();
		appendOptions();
	});
    }); 

}

var part1a_id = "#Part1aVis";
buildImmigrationOverview(part1a_id);
buildImmigrationState("#Part1bVis");
