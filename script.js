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
    value: 'reports',
    filtered: true 
  },

  initialize: function (data) {
    app.data = data;

    var parseDate = d3.timeParse("%m/%d/%Y"); //https://bl.ocks.org/d3noob/0e276dc70bb9184727ee47d6dd06e915

    data.forEach(function(d) {
        d.date = parseDate(d.date)
    });

    app.components = [
      new Chart('#chart')
    ];

    d3.select("#reports").on("click", function() { 
      if (app.options.value !== 'reports') {app.options.value = 'reports';
       app.components.forEach(function (d) {d.update(); });
      }});

    d3.select("#pages").on("click", function() { 
      if (app.options.value !== 'pages') {app.options.value = 'pages';
      app.components.forEach(function (d) {d.update(); });
      }
      });

    d3.select("#dollars").on("click", function() { 
      if (app.options.value !== 'dollars') {app.options.value = 'dollars';
      app.components.forEach(function (d) {d.update(); });
      }
      });

    // app.update();
  },

  update: function () {
    app.components.forEach(function (c) { if (c.update) { c.update(); }});
  }
}

function Chart(selector) {
  var chart = this;

  // SVG and MARGINS

  var margin = {
    top: 15, right: 15, bottom: 40, left: 45
  };

  chart.width = 1000 - margin.left - margin.right;
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
    .attr('y', -35)
    .attr('x', 0)
    .style('text-anchor', 'end')
    .style('fill', '#000')
    .style('font-weight', 'bold')
    .text('Quantity');

  pathF3X = chart.svg.append("path");
  pathF3 = chart.svg.append("path");
  pathF5 = chart.svg.append("path");

  chart.update();

}

Chart.prototype = {
  update: function () {
    var chart = this;

    // TRANSFORM DATA

    var txData = app.data.slice();

    if (app.options.filtered) {
      txData = txData.filter(function (d){ return d.value === app.options.value;
      })
    }

    var maxF3 = d3.max(txData, function (d) { return d.f3; })
    var maxF3X = d3.max(txData, function (d) { return d.f3x; })

    chart.y = d3.scaleLinear()
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
        .attr("class","line f3x")  
        .attr("d",lineF3X)
        .style("opacity",0)
        .style("stroke-width",4)
        .transition().delay(1000).duration(1000)
        .style("opacity",.9);

    pathF3.datum(txData)
        .attr("class","line f3")
        .attr("d",lineF3)
        .style("opacity",0)
        .style("stroke-width",4)
        .transition().duration(1000)
        .style("opacity",.9);

    pathF5.datum(txData)
        .attr("class","line f5")
        .attr("d",lineF5)
        .style("opacity",0)
        .style("stroke-width",4)
        .transition().delay(2000).duration(1000)
        .style("opacity",.9);

    d3.selectAll('path').on('mouseenter', function() {
        this.parentElement.appendChild(this);});
        //Code for reordering elements: http://bl.ocks.org/aharris88/cf29caf142c9592af424


  }
}