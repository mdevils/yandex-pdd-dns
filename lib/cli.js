var vow = require('vow');
var Domain = require('..').Domain;
var DomainRecord = require('..').DomainRecord;
var Api = require('..').Api;
var getExternalIp = require('..').getExternalIp;

var inputParams = {};

var args = process.argv.slice(2);
var command = args.shift();

while (args.length > 0) {
    var argName = args.shift().replace('--', '');
    var argValue = args.shift();
    inputParams[argName] = argValue;
}

if (!inputParams.token) {
    throw new Error('Token is not defined');
}

if (!inputParams.domain) {
    throw new Error('Domain is not defined');
}

var domain = new Domain(new Api(
    inputParams.domain,
    inputParams.token
));

switch (command) {
    case 'list':
        domain.getRecords().then(function (records) {
            records.forEach(function (record) {
                var json = record.toJSON();
                console.log(Object.keys(json).map(function (key) {
                    return key + ': ' + json[key];
                }).join(', '));
            });
        }).done();
        break;
    case 'dyndns':
        var subdomain = inputParams.subdomain || '@';
        getExternalIp().then(function (ip) {
            console.log('External IP: ' + ip);
            return domain.getRecords().then(function (records) {
                var foundRecord;
                records.forEach(function (record) {
                    if (record.getType() === 'A' && record.getSubdomain() === subdomain) {
                        foundRecord = record;
                    }
                });
                if (foundRecord) {
                    if (foundRecord.getContent() !== ip) {
                        foundRecord.setContent(ip);
                        return domain.updateRecord(foundRecord).then(function () {
                            console.log('DNS Record was updated');
                        });
                    } else {
                        console.log('DNS Record is up to date');
                    }
                } else {
                    return domain.addRecord(DomainRecord.fromJSON({
                        type: 'A',
                        subdomain: subdomain,
                        content: ip
                    })).then(function () {
                        console.log('DNS Record was added');
                    });
                }
            });
        }).done();
        break;
}
