/*
 * Module dependencies
 */

var express = require('express'),
    stylus = require('stylus'),
    nib = require('nib'),
    Facebook = require('facebook-node-sdk');

// Config file
var config = require('./config.json');

var app = express();
function compile(str, path) {
    return stylus(str)
        .set('filename', path)
        .use(nib())
}
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(stylus.middleware(
    {
        src: __dirname + '/public',
        compile: compile
    }
));
app.use(express.static(__dirname + '/public'));
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({ 'secret': 'ukr-2-0-fra' }));
app.use(Facebook.middleware({
    appId: config.facebook.appId, 
    secret: config.facebook.secret
}));

app.get('/', Facebook.loginRequired(), function (req, res) {
    req.facebook.api('/me', function(err, user) {
        var salut = ( user.gender == 'male' ) ? 'Mr. ' : 'Ms. ';
        res.render('index', {
            title: 'Home',
            name: salut + user.first_name
        });
    });
});
app.listen(config.server.port)
