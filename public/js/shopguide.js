
/* Fire request to FB categories at that page */
if ($('div#cats').length === 1) {
    $.get('/facebook-2', function(data) {
        $('div#cats').html(data);
    })
}
