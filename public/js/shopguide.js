
/* Fire request to FB categories at that page */
if ($('div#cats').length === 1) {
    $.get('/facebook-2', function(data) {
        $('div#cats').html(data);
    })
}

/* Fire request to BBVA data at map page */
if ($('div.map').length > 0) {

    d3.json('/map-data', function(data) {
        nv.addGraph(function() {
        var chart = nv.models.stackedAreaChart()
                             .x(function(d) { return d[0] })
                             .y(function(d) { return d[1] })
                             .clipEdge(true);

        chart.xAxis
             .tickFormat(function(d) { return d3.time.format('%x')(new Date(d)) });

        chart.yAxis
             .tickFormat(d3.format(',.2f'));

        d3.select('#chart svg')
          .datum(data)
          .transition().duration(500).call(chart);

        nv.utils.windowResize(chart.update);

        return chart;
    });
});

}
