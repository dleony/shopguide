
/* Fire request to FB categories at that page */
if ($('div#cats').length === 1) {
    $.get('/facebook-2', function(data) {
        $('div#cats').html(data);
    })
}

/* Fire request to BBVA data at map page */
var maps = $('div.map').length;
if (maps > 0) {

    for (var i=0; i < maps; i++) {
        (function(image) {
            d3.json('/map-data?id=' + image, function(data) {
                nv.addGraph(function() {
                    var chart = nv.models.stackedAreaChart()
                                         .x(function(d) { return d ? d3.time.format('%Y%m').parse(d.date) : '' })
                                         .y(function(d) { return d ? d.value : 0 })
                                         .clipEdge(true);
    
                    chart.xAxis
                        .tickFormat(function(d) { return d3.time.format('%b %Y')(new Date(d)) });
    
                    chart.yAxis
                        .tickFormat(function(d) { return '€' + d3.format(',.2f')(d); });
                    var selector = '#chart' + image + ' svg';
                    d3.select(selector)
                      .datum(data)
                      .transition().duration(500).call(chart);
    
                    nv.utils.windowResize(chart.update);
                    return(chart);
                });
            });
        })(i);
    }

    $('div.cycle-slideshow').on('cycle-after', function(ev, hash, slideHash, current) {
        console.log(hash.nextSlide);
        nv.graphs[hash.nextSlide].update();
    });

}
