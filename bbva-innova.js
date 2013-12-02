var request = require('request');

/*
 * Function defining a BBVAInnova instance
 */
function BBVAInnova(config) {
    this.host = 'https://api.bbva.com';
    this.auth = {
        user: config.appId,
        pass: config.appKey
    };
}

BBVAInnova.prototype.getCube = function(params, callback) {
    fillRequiredParams(params);

    var catUri = this.host + '/apidatos/zones/cards_cube.json?';
    catUri += querystring.stringify(params);

    request({
        uri: catUri,
        auth: this.auth
    }, function(error, response, body) {
        if (error) {
            callback(error);
            return false;
        }
        var bodyJson = JSON.parse(body),
            stats = bodyJson.data.stats;

        callback(null, stats);
    });        
}

BBVAInnova.prototype.getPattern = function(params, callback) {
    fillRequiredParams(params);

    var catUri = this.host + '/apidatos/zones/consumption_pattern.json?';
    catUri += querystring.stringify(params);

    request({
        uri: catUri,
        auth: this.auth
    }, function(error, response, body) {
        if (error) {
            callback(error);
            return false;
        }
        var bodyJson = JSON.parse(body),
            stats = bodyJson.data.stats;

        callback(null, stats);
    });        
}

BBVAInnova.prototype.getZipcodes = function(params, callback) {
    fillRequiredParams(params);
    params.by = params.by || 'cards';

    var catUri = this.host + '/apidatos/zones/customer_zipcodes.json?';
    catUri += querystring.stringify(params);

    request({
        uri: catUri,
        auth: this.auth
    }, function(error, response, body) {
        if (error) {
            callback(error);
            return false;
        }
        var bodyJson = JSON.parse(body),
            stats = bodyJson.data.stats;

        callback(null, stats);
    });        
}

BBVAInnova.prototype.getCategories = function(callback) {
    var catUri = this.host + '/apidatos/info/merchants_categories.json';
    request({
        uri: catUri,
        auth: this.auth
    }, function(error, response, body) {
        if (error) {
            callback(error);
            return false;
        }

        var bodyJson = JSON.parse(body),
            categories = bodyJson.data.categories;

        callback(null, categories);
    });        
}

function fillRequiredParams(params) {
    params.date_min = params.date_min || '20121101';
    params.date_max = params.date_max || '20130430';
    params.group_by = params.group_by || 'month';
    params.zoom = 2;
    params.depth = params.depth || 0;
}

module.exports = BBVAInnova;
