var vow = require('vow');
var request = require('request');

module.exports = function () {
    var defer = vow.defer();
    request('http://myexternalip.com/raw', function (error, response, body) {
        if (error) {
            defer.reject(error);
        } else {
            defer.resolve(body.trim());
        }
    });
    return defer.promise();
};
