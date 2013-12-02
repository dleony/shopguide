
// Config file
var config = require('./config.json');

/*
 * Module dependencies
 */

var express = require('express'),
    stylus = require('stylus'),
    nib = require('nib'),
    Facebook = require('facebook-node-sdk'),
    foursquare = require('node-foursquare')(config.foursquare),
    geolib = require('geolib'),
    async = require('async');

/*
 * Local modules
 */
var catMapper = require('./cat-mapper.js'),
    BBVA = require('./bbva-innova.js');

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

/*
 * Routes
 */

app.get('/', function (req, res) {
    res.session = null;
    res.render('index', {
        title: 'Home'
    });
});

app.get('/facebook', Facebook.loginRequired({
        scope: 'user_birthday,user_likes,user_status'
    }), function (req, res) {
    req.facebook.api('/me', function(err, user) {
        console.log(user);
        req.session.user = {
            name: user.first_name,
            gender: user.gender,
            birthday: user.birthday
        };
        console.log(user);
        res.render('facebook', {
            title: 'Facebook',
            user: req.session.user
        });
    });
});

app.get('/facebook-2', Facebook.loginRequired({
        scope: 'user_birthday,user_likes,user_status'
    }), function (req, res) {
    var categories = {};

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
                res.render('facebook-2', {
                    categories: req.session.categories
                });
            }
        }
    });
});

app.get('/foursquare', function (req, res) {
    res.render('foursquare', {
        title: 'Foursquare',
        fqlink: foursquare.getAuthClientRedirectUrl()
    });
});

app.get('/foursquare-2', function(req, res) {
    // TODO: Detect centroids of foursquare activity with an algorithm like:
    // https://gist.github.com/substack/7373338#comment-950073
    foursquare.getAccessToken({
        code: req.query.code
    }, function(err, token) {
        if (err) {
            console.log('Foursquare error: ' + err);
        } else {
            foursquare.Users.getCheckins('self', {limit: 250}, token, function(err, result) {
                var cities = [
                    {
                        name: 'Madrid',
                        latitude: 40.4167754,
                        longitude: -3.7037902
                    },
                    {
                        name: 'Barcelona',
                        latitude: 41.3850639,
                        longitude: 2.1734035
                    }
                ];
                var maxDist = 10000;
                var places = [];
                var cins = result.checkins.items;
                for (var i = 0; i < cins.length; i++) {
                    var curLoc = {
                        id: i,
                        latitude: cins[i].venue.location.lat,
                        longitude: cins[i].venue.location.lng
                    };
                    for (var j = 0; j < cities.length; j++) {
                        if (geolib.getDistance(curLoc, cities[j], 1000) <= maxDist) {
                            break;
                        }
                    }
                    if (j < cities.length) {
                        places.push(curLoc);
                    }
                }
                // group places by their distance
                var clusters = places.reduce(function(acc, place) {
                    var near = places.filter(function(p) {
                        return geolib.getDistance(p, place, 100) <= 500;
                    });
                    acc[place.id] = {
                        near: near,
                        count: near.length + 1
                    };
                    return acc;
                }, {});

                // sort clusters by size in descending order
                var sorted = Object.keys(clusters).sort(function(a, b) {
                    return clusters[b].count - clusters[a].count;
                });

                // get rid of intersecting clusters
                var seen = {}; 
                var results = [];
                for (var i = 0; i < sorted.length && results.length < 3; i++) {
                    var id = sorted[i];
                    if (seen[id]) continue;
                    seen[id] = true;
                    var p = clusters[id];
                    p.near.forEach(function (x) { seen[x.id] = true; });
                    results.push({
                        center: geolib.getCenter(p.near),
                        count: p.count
                    });
                }
                req.session.places = results;
                res.redirect('/map');
            })
        }
    });
});

app.get('/map', function(req, res) {
    var random = [
        [40.434519, -3.719190],
        [40.419264, -3.705903],
        [40.421127, -3.685603],
        [40.426390, -3.695565],
        [40.428535, -3.667916],
        [40.431081, -3.663259],
        [40.404605, -3.702528]
    ];
    if (req.session && !req.session.places) {
        var n = 3, len = random.length;
        var places = new Array(n), taken = new Array(n);
        while (n--) {
            var x = Math.floor(Math.random() * len);
            var aux = random[x in taken ? taken[x] : x];
            places[n] = {
                center: {
                    latitude: aux[0],
                    longitude: aux[1]
                }
            };
            taken[x] = --len;
        }
        req.session.places = places;
    }

    res.render('map', {
        title: 'Map',
        places: req.session.places
    });
});

app.get('/map-data', function(req, res) {
    var placeId = req.query.id;
    if (placeId === undefined || !req.session.places || !req.session.places[placeId]) {
        res.send('Bad request');
        return(false);
    }

    var bbva = new BBVA(config.bbva);

    var age, gender, hash;

    if (req.session && req.session.user && req.session.user.birthday) {
        age = bbva.getAge(new Date(req.session.user.birthday));
    } else {
        age = Math.floor(Math.random()*40 + 20);
    }
    if (req.session && req.session.user && req.session.user.gender) {
        gender = req.session.user.gender.toLowerCase();
    } else {
        gender = (Math.random() > 0.5) ? 'male' : 'female'; 
    }
    hash = bbva.getHash(gender, age);

    if (req.session && !req.session.categories) {
        req.session.categories = bbva.getRandomCategories(3);
    }

    var place = req.session.places[placeId];
    
    async.mapSeries(req.session.categories, function(category, callback) {
        bbva.getCube({
            latitude: place.center.latitude,
            longitude: place.center.longitude,
            category: category.code,
            group_by: 'month'
        }, function(err, result) {
            var data_array = [];
            if (err) {
                console.log(err);
                data_array = [
                    {
                      "date": "201211",
                      "value": 0
                    },
                    {
                      "date": "201212",
                      "value": 0
                    },
                    {
                      "date": "201301",
                      "value": 0
                    },
                    {
                      "date": "201302",
                      "value": 0
                    },
                    {
                      "date": "201303",
                      "value": 0
                    },
                    {
                      "date": "201304",
                      "value": 0
                    }
                ];
                callback(null, {key: category.description, values: data_array});
                return(false);
            }
            result.forEach(function(data) {
                var pair = { date: data.date, value: 0 };
                for (var i=0; i < data.cube.length && hash !== data.cube[i].hash; i++);
                if (i < data.cube.length) {
                    pair.value = data.cube[i].avg;
                }
                data_array.push(pair);
            });  
            callback(null, {key: category.description, values: data_array});
        }); 
    }, function(err, results) {
        if (!err) {
            res.send(results);
        } else {
            res.send('Error: ' + err);
        }
    });
});

app.listen(config.server.port)
