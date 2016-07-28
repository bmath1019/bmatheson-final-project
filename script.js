var app;

// d3.queue() enables us to load multiple data files. Following the example below, we make
// additional .defer() calls with additional data files, and they are returned as results[1],
// results[2], etc., once they have all finished downloading.
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
    type: 'reports'
  },

  initialize: function (data) {
    app.data = data;

    var parseDate = d3.timeParse("%m/%d/%Y"); //https://bl.ocks.org/d3noob/0e276dc70bb9184727ee47d6dd06e915

    data.forEach(function(d) {
        d.date = parseDate(d.date)
        d.reports = +d.reports;
    });

    // Here we create each of the components on our page, storing them in an array
    app.components = [
      new Chart('#chart')
    ];

    // Add event listeners and the like here
    d3.select('#type').on('change', function () {
      options.type = d3.event.target.value;
      charts.forEach(function (chart) {chart.update();});
    });

    app.update();
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

  var maxF3 = d3.max(app.data, function (d) { return d.f3; })
  var maxF3X = d3.max(app.data, function (d) { return d.f3x; })

  chart.y = d3.scaleLinear()
    .domain([0, d3.max([maxF3,maxF3X])])
    .range([chart.height, 0])
    .nice();

  // AXES

  var xAxis = d3.axisBottom()
    .scale(chart.x);

  var yAxis = d3.axisLeft()
    .scale(chart.y);

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
    .attr('dy', '.71em')
    .attr('y', -35)
    .attr('x', 0)
    .style('text-anchor', 'end')
    .style('fill', '#000')
    .style('font-weight', 'bold')
    .text('Log Number of Reports');

  chart.update();
}

Chart.prototype = {
  update: function () {
    var chart = this;

    // TRANSFORM DATA

    var txData = app.data.slice();

      // var txData = app.data.filter(function (d) { return d.reports === app.options.reports; });

    // UPDATE CHART ELEMENTS

    var lineF3 = d3.line()
      .x(function (d) { return chart.x(d.date)})
      .y(function (d) { return chart.y(d.f3)})

    var lineF3X = d3.line()
      .x(function (d) { return chart.x(d.date)})
      .y(function (d) { return chart.y(d.f3x)})

    var lineF5 = d3.line()
      .x(function (d) { return chart.x(d.date)})
      .y(function (d) { return chart.y(d.f5)})

    chart.svg.append("path")
        .datum(txData)
        .attr("class","line f3")
        .attr("d",lineF3)
        .style("opacity",.5)
        .style("stroke-width",3);    

    chart.svg.append("path")
        .datum(txData)
        .attr("class","line f3x")
        .attr("d",lineF3X)
        .style("opacity",.5)
        .style("stroke-width",3);

    chart.svg.append("path")
        .datum(txData)
        .attr("class","line f5")
        .attr("d",lineF5)
        .style("opacity",.5)
        .style("stroke-width",3);        

  }
}
