/*
 * Module dependencies
 */

var express = require('express'),
    stylus = require('stylus'),
    nib = require('nib'),
    Facebook = require('facebook-node-sdk');

/*
 * Local modules
 */
var catMapper = require('./cat-mapper.js');

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
    secret: config.facebook.secret,
    scope: 'user_birthday,user_likes,user_status'
}));

/*
 * Routes
 */

app.get('/', function (req, res) {
    res.render('index', {
        title: 'Home',
        user: req.session.user,
        categories: req.session.categories
    });
});

app.get('/facebook', Facebook.loginRequired(), function (req, res) {
    var categories = {};
    var processes = 2;
    req.facebook.api('/me/likes', function localLikes(err, likes) {
        var pending_cats = likes.data.length; 
        if (likes.data) {
            for (var i = 0; i < likes.data.length; i++) {
                var code = catMapper.findCode(likes.data[i].category);
                if (code) {
                    if (categories[code]) {
                        categories[code]++;
                    } else {
                        categories[code] = 1;
                    }
                }
            }
            if (likes.paging && likes.paging.next) {
                req.facebook.api('/me/likes?after=' + likes.paging.cursors.after, localLikes);
            } else {
                var sorted = Object.keys(categories).sort(function(a, b) {
                    return categories[a] < categories[b] ? 1 : -1;
                });
                req.session.categories = sorted.slice(0, 3).map(catMapper.getCategory);
                if (--processes === 0) {
                    res.redirect('/');
                }
            }
        }
    });
    req.facebook.api('/me', function(err, user) {
        req.session.user = {
            name: user.first_name,
            gender: user.gender,
            birthday: user.birthday
        };
        if (--processes === 0) {
            res.redirect('/');
        }
    });
});

app.get('/foursquare', function(req, res) {
    // TODO: Detect centroids of foursquare activity with an algorithm like:
    // https://gist.github.com/substack/7373338#comment-950073
});

app.listen(config.server.port)
