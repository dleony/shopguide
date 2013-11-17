/*
 * Category mapper module
 */

var cats = require('./extended-cats.json');

exports.findCode = function(label) {
    var looked = label.toLowerCase();
    var found = null;
    for (var i = 0; i < cats.length && !found; i++) {
        if (cats[i].fb_cats.indexOf(looked) > -1) {
            found = cats[i].id;
        }
    }
    return found;
};

exports.getCategory = function(code) {
    for (var i = 0; i < cats.length; i++) {
        if (cats[i].id === code) {
            return {
                code: code,
                description: cats[i].name
            };
        }
    }
    return null;
}
