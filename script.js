var app;

d3.queue()
  .defer(d3.json, 'data/data.json')
  .awaitAll(function (error, results) {
    if (error) { throw error; }
    app.initialize(results[0]);

  });

app = {
  data: [],
  components: [],

  options: {
    value: 'Reports',
    filtered: true,
    form: 'all',
    cycle: 2014,
  },

  initialize: function (data) {
    app.data = data;

    parseDate = d3.timeParse("%Y-%m-%d"); //https://bl.ocks.org/d3noob/0e276dc70bb9184727ee47d6dd06e915

    data.forEach(function(d) {
        d.date = parseDate(d.date)
    });

    app.components = [
      new Chart('#chart')
    ];
    
    d3.select('window').on('resize', app.resize);

    // Data Scale Transformations Reports / Pages / Dollars
    d3.select("#cy2012").on("click", function() { 
      if (app.options.cycle !== 2012) {app.options.cycle = 2012;
       app.components.forEach(function (d) {d.update(); });
      }});

    d3.select("#cy2014").on("click", function() { 
      if (app.options.cycle !== 2014) {app.options.cycle = 2014;
      app.components.forEach(function (d) {d.update(); });
      }
    });

    d3.select("#cy2016").on("click", function() { 
      if (app.options.cycle !== 2016) {app.options.cycle = 2016;
      app.components.forEach(function (d) {d.update(); });
      }
    });

    // Data Scale Transformations Reports / Pages / Dollars
    d3.select("#Reports").on("click", function() { 
      if (app.options.value !== 'Reports') {app.options.value = 'Reports';
       app.components.forEach(function (d) {d.update(); });
      }});

    d3.select("#Pages").on("click", function() { 
      if (app.options.value !== 'Pages') {app.options.value = 'Pages';
      app.components.forEach(function (d) {d.update(); });
      }
    });

    d3.select("#Dollars").on("click", function() { 
      if (app.options.value !== 'Dollars') {app.options.value = 'Dollars';
      app.components.forEach(function (d) {d.update(); });
      }
    });

    // Highlight specific report type
    d3.select('#f3b').on("click", function() {
      if (app.options.form !== 'f3') {app.options.form = 'f3';
      app.components.forEach(function (d) {d.update(); });
      }
    });

    d3.select('#f3xb').on("click", function() {
      if (app.options.form !== 'f3X') {app.options.form = 'f3X';
      app.components.forEach(function (d) {d.update(); });
      }
    });

    d3.select('#f5b').on("click", function() {
      if (app.options.form !== 'f5') {app.options.form = 'f5';
      app.components.forEach(function (d) {d.update(); });
      }
    });

   d3.select('#all').on("click", function() {
      if (app.options.form !== 'all') {app.options.form = 'all';
      app.components.forEach(function (d){d.update(); })
    }
    });
  },

  resize: function () {
    app.components.forEach(function (c) { if (c.resize) { c.resize(); }});
  },

}


function Chart(selector) {
  var chart = this;

  // SVG and MARGINS

  var margin = {
    top: 15, right: 25, bottom: 40, left: 75
  };

  chart.width = 1400 - margin.left - margin.right;
  chart.height = 400 - margin.top - margin.bottom;

  chart.svg = d3.select(selector)
    .append('svg')
    .attr('width', chart.width + margin.left + margin.right)
    .attr('height', chart.height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  // SCALES

  chart.x = d3.scaleTime()
    .domain([d3.min(app.data, function (d) { return d.date; }), d3.max(app.data, function (d) { return d.date; })])
    .range([0, chart.width])
    .nice();

  chart.y = d3.scaleLinear()
    .domain([0, 0]) // temporary y scale holder until update function runs.
    .range([chart.height, 0])
    .nice();

  // AXES

  var xAxis = d3.axisBottom()
    .scale(chart.x);

  var yAxis = d3.axisLeft()
    .scale(chart.y)

  chart.svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + chart.height + ')')
    .call(xAxis)
    .append('text')
    .attr('y', 30)
    .attr('x', chart.width)
    .style('text-anchor', 'end')
    .style('fill', '#000')
    .style('font-weight', 'bold')
    .text('Date');

  chart.svg.append('g')
    .attr('class', 'y axis')
    .call(yAxis)
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', -65)
    .attr('x', 0)
    .style('text-anchor', 'end')
    .style('fill', '#000')
    .style('font-weight', 'bold')
    .text("Quantity (sq root)");

  pathF3X = chart.svg.append("path");
  pathF3 = chart.svg.append("path");
  pathF5 = chart.svg.append("path");

// tooltip attempt (https://bl.ocks.org/mbostock/3902569)

  focus = chart.svg.append("g")
      .attr("class", "focus")
      .style("display", "none");

  focus.append("circle")
      .attr('id',"f3xcirc")
      .attr("r", 4.5);

  focus.append("circle")
      .attr('id',"f3circ")
      .attr("r", 4.5);

  focus.append("circle")
      .attr('id',"f5circ")
      .attr("r", 4.5);

  focus.append("text")
      .attr("x", 9)
      .attr("dy", ".35em");

  chart.svg.append("rect")
      .attr("class", "overlay")
      .attr("width", chart.width)
      .attr("height", chart.height);

  chart.update();

}

Chart.prototype = {
  update: function () {
    var chart = this;

    // TRANSFORM DATA

    var txData = app.data.slice();

    if (app.options.filtered) {
      txData = txData.filter(function (d){ return d.value === app.options.value &&
       d.cycle ===  app.options.cycle ;
      })
    }

    var maxF3 = d3.max(txData, function (d) { return d.f3; })
    var maxF3X = d3.max(txData, function (d) { return d.f3x; })

    chart.x = d3.scaleTime()
      .domain([d3.min(txData, function (d) { return d.date; }), d3.max(txData, function (d) { return d.date; })])
      .range([0, chart.width])
      .nice();

    var xAxis = d3.axisBottom()
      .scale(chart.x);

    chart.svg.select('.x.axis').call(xAxis);

    chart.y = d3.scaleSqrt()
      .domain([0, d3.max([maxF3,maxF3X])])
      .range([chart.height, 0])
      .nice();

    var yAxis = d3.axisLeft()
      .scale(chart.y)
      .tickSize(-chart.width);

    chart.svg.select('.y.axis')
      .transition().duration(2000).call(yAxis);

    // UPDATE CHART ELEMENTS

    lineF3 = d3.line()
      .x(function (d) { return chart.x(d.date)})
      .y(function (d) { return chart.y(d.f3)})

    lineF3X = d3.line()
      .x(function (d) { return chart.x(d.date)})
      .y(function (d) { return chart.y(d.f3x)})

    lineF5 = d3.line()
      .x(function (d) { return chart.x(d.date)})
      .y(function (d) { return chart.y(d.f5)})

    pathF3X.datum(txData)
        .attr("class", function () { 
          if (app.options.form === "f3X"|| app.options.form === "all") {return "f3x"} else {return "inactivef3x"}
        })  
        .attr("d",lineF3X);

    pathF3.datum(txData)
        .attr("class", function () { 
          if (app.options.form === "f3"|| app.options.form === "all") {return "f3"} else {return "inactivef3"}
        })
        .attr("d",lineF3);

    pathF5.datum(txData)
        .attr("class", function () { 
          if (app.options.form === "f5"|| app.options.form === "all") {return "f5"} else {return "inactivef5"}
        })
        .attr("d",lineF5);

    var bisectDate = d3.bisector(function(d) { return d.date; }).right;

    formatTime = d3.timeFormat("%0m/%0d/%Y")
    percFormat = d3.format(",.1%") 

    minDate = d3.min(txData,function (d) {return d.date})
    maxDate = d3.max(txData,function (d) {return d.date})

    totDays = (maxDate - minDate)/1000/60/60/24;
    totF3 = d3.sum(txData, function (d) { return d.f3; });
    totF3X = d3.sum(txData, function (d) { return d.f3x; });
    totF5 = d3.sum(txData, function (d) { return d.f5; });

    chart.svg
        .on("mouseover", function() { focus.style("display", null); })
        .on("mouseout", function() { focus.style("display", "none"); })
        .on('mousemove', mousemove);

      function mousemove() {

          var x0 = chart.x.invert(d3.mouse(this)[0]),
          i = bisectDate(txData, x0, 1),
          d0 = txData[i - 1],
          d1 = txData[i],
          d = x0 - d0.date > d1.date - x0 ? d1 : d0,
          percDays = ((d1.date-minDate)/1000/60/60/24)/totDays;

          toolData = app.data.slice();

          if (app.options.filtered) {
            toolData = toolData.filter(function (d){ return d.value === app.options.value &&
             d.cycle ===  app.options.cycle &&
             d.date <= d1.date
            })
          };

          ectdF3 = d3.sum(toolData,function (d) {return d.f3});
          ectdF3X = d3.sum(toolData,function (d) {return d.f3x});
          ectdF5 = d3.sum(toolData,function (d) {return d.f5});

          percF3 = ectdF3/totF3;
          percF3X = ectdF3X/totF3X;
          percF5 = ectdF5/totF5;

          var formatCurrency = d3.format("$,.2f");
          var formatNumber = d3.format(",");

          focus.select("#f3xcirc").attr("transform", "translate(" + chart.x(d.date) + "," + chart.y(d.f3x) + ")");
          focus.select("#f3circ").attr("transform", "translate(" + chart.x(d.date) + "," + chart.y(d.f3) + ")");
          focus.select("#f5circ").attr("transform", "translate(" + chart.x(d.date) + "," + chart.y(d.f5) + ")");
          
          d3.select("#date").html(function (d){return formatTime(d0.date)});
          d3.select("#percentDates").html(function (d){return percFormat(percDays)});
          d3.select("#percentF3").html(percFormat(percF3));
          d3.select("#percentF3X").html(percFormat(percF3X));
          d3.select("#percentF5").html(percFormat(percF5));
          
          d3.select("#numF3").html(function (d) { if (app.options.value === "Reports") {return formatNumber(d0.f3)};
          if (app.options.value === "Pages") {return formatNumber(d1.f3)};
          if (app.options.value === "Dollars") {return formatCurrency(d1.f3)}; } );
          
          d3.select("#numF3X").html(function (d) { if (app.options.value === "Reports") {return formatNumber(d0.f3x)};
          if (app.options.value === "Pages") {return formatNumber(d1.f3x)};
          if (app.options.value === "Dollars") {return formatCurrency(d1.f3x)}; } );
          
          d3.select("#numF5").html(function (d) { if (app.options.value === "Reports") {return formatNumber(d0.f5)};
          if (app.options.value === "Pages") {return formatNumber(d1.f5)};
          if (app.options.value === "Dollars") {return formatCurrency(d1.f5)}; } );

          d3.select("#ectdF3").html(function () { if (app.options.value === "Reports") {return formatNumber(ectdF3)};
          if (app.options.value === "Pages") {return formatNumber(ectdF3)};
          if (app.options.value === "Dollars") {return formatCurrency(ectdF3)}; } );
          
          d3.select("#ectdF3X").html(function () { if (app.options.value === "Reports") {return formatNumber(ectdF3X)};
          if (app.options.value === "Pages") {return formatNumber(ectdF3X)};
          if (app.options.value === "Dollars") {return formatCurrency(ectdF3X)}; } );
          
          d3.select("#ectdF5").html(function () { if (app.options.value === "Reports") {return formatNumber(ectdF5)};
          if (app.options.value === "Pages") {return formatNumber(ectdF5)};
          if (app.options.value === "Dollars") {return formatCurrency(ectdF5)}; } );

    };
  
      d3.selectAll("#type").html(function(){return app.options.value});

  }
}


