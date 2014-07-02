var parseString = require('xml2js').parseString;
var request = require('request');
var vow = require('vow');

var YandexPddBaseUrl = 'https://pddimp.yandex.ru/nsapi';

function Api(domain, token) {
    this._domain = domain;
    this._token = token;
}

Api.prototype = {
    getToken: function () {
        return this._token;
    },
    getDomainName: function () {
        return this._domain;
    },
    request: function (path, data) {
        data = data || {};
        var params = {};
        Object.keys(data).forEach(function (key) {
            params[key] = data[key];
        });
        params.domain = this._domain;
        params.token = this._token;
        var query = '?' + Object.keys(params).map(function (key) {
            return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
        }).join('&');
        var url = YandexPddBaseUrl + '/' + path + query;
        var defer = vow.defer();
        request(url, function (error, response, body) {
            if (error) {
                defer.reject(error);
            } else {
                parseString(body, function (error, result) {
                    if (error) {
                        defer.reject(error);
                    } else {
                        if (result.page.domains[0].error[0] === 'ok') {
                            defer.resolve(result);
                        } else {
                            defer.reject(new Error(result.page.domains[0].error[0]));
                        }
                    }
                });
            }
        });
        return defer.promise();
    }
};

module.exports = Api;
