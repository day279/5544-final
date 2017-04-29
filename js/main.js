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
	    height = 200 - margin.top - margin.bottom;

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
				.filter(function(d) { var answer = (d.year > 0 && NaN != d.year && d.value > 0 && NaN != d.value); return answer;}),
				
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

var part1a_id = "#Part1a";
buildImmigrationOverview(part1a_id);
