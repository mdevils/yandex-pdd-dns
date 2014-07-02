require('chai').should();
var parseString = require('xml2js').parseString;
var vow = require('vow');
var vowFs = require('vow-fs');
var Domain = require('..').Domain;
var DomainRecord = require('..').DomainRecord;
var types = ['A', 'AAAA', 'CNAME', 'MX', 'NS', 'SRV', 'TXT'];

describe('Domain', function () {
    var domain;
    var altDomain;
    var domainWithFailApi;
    beforeEach(function () {
        domain = new Domain(new ApiMock(__dirname + '/fixtures/ok'));
        altDomain = new Domain(new ApiMock(__dirname + '/fixtures/alt'));
        domainWithFailApi = new Domain(new ApiMock(__dirname + '/fixtures/errors'));
    });
    describe('getRecords()', function () {
        it('should return domain list ', function (done) {
            domain.getRecords().then(function (records) {
                records[0].getType().should.equal('A');
                records[0].getSubdomain().should.equal('@');
                records[0].getId().should.equal('66732204');
                records[0].getPriority().should.equal('');
                records[0].getTtl().should.equal('21600');
                records[0].getContent().should.equal('22.78.32.2');

                records[2].getType().should.equal('SRV');
                records[2].getSubdomain().should.equal('_xmpp-client._tcp');
                records[2].getId().should.equal('66732206');
                records[2].getPriority().should.equal('20');
                records[2].getTtl().should.equal('21600');
                records[2].getPort().should.equal('5222');
                records[2].getWeight().should.equal('0');
                records[2].getContent().should.equal('domain-xmpp.yandex.net.');

                done();
            }).fail(done);
        });

        it('should return single domain', function (done) {
            altDomain.getRecords().then(function (records) {
                records.length.should.equal(1);
                records[0].getType().should.equal('A');
                records[0].getSubdomain().should.equal('@');
                records[0].getId().should.equal('66732204');
                records[0].getPriority().should.equal('');
                records[0].getTtl().should.equal('21600');
                records[0].getContent().should.equal('22.78.32.2');

                done();
            }).fail(done);
        });

        it('should throw error on error', function (done) {
            domainWithFailApi.getRecords().done(function () {
                done(new Error('Error was not thrown'));
            }, function (e) {
                e.message.should.equal('failed');
                done();
            });
        });
    });
    describe('getDomainName()', function () {
        it('should return domain name from Api', function () {
            domain.getName().should.equal('example.com');
        });
    });
    describe('updateRecord()', function () {
        it('should not save record with no type', function () {
            (function () {
                return domain.updateRecord(DomainRecord.fromJSON({id: '123123'}));
            }).should.throw('DomainRecord::type is not defined');
        });
        it('should not save record with no id', function () {
            (function () {
                return domain.updateRecord(DomainRecord.fromJSON({type: 'A'}));
            }).should.throw('DomainRecord::id is not defined');
        });
        types.map(function (type) {
            it('should save record "' + type + '"', function (done) {
                var record = new DomainRecord();
                record.setId('4432231');
                record.setType(type);
                record.setSubdomain('hello');
                record.setContent('127.0.0.1');
                return domain.updateRecord(record).then(function () {
                    done();
                }, done);
            });
            it('should fail on record "' + type + '"', function (done) {
                var record = new DomainRecord();
                record.setId('4432231');
                record.setType(type);
                record.setSubdomain('hello');
                record.setContent('127.0.0.1');
                return domainWithFailApi.updateRecord(record).fail(function () {
                    done();
                });
            });
        });
    });
    describe('addRecord()', function () {
        it('should not add record with no type', function () {
            (function () {
                return domain.addRecord(DomainRecord.fromJSON({}));
            }).should.throw('DomainRecord::type is not defined');
        });
        types.map(function (type) {
            it('should add record "' + type + '"', function (done) {
                var record = new DomainRecord();
                record.setType(type);
                record.setSubdomain('hello');
                record.setContent('127.0.0.1');
                return domain.addRecord(record).then(function () {
                    done();
                }, done);
            });
            it('should fail adding record "' + type + '"', function (done) {
                var record = new DomainRecord();
                record.setType(type);
                record.setSubdomain('hello');
                record.setContent('127.0.0.1');
                return domainWithFailApi.addRecord(record).fail(function () {
                    done();
                });
            });
        });
    });
    describe('deleteRecord()', function () {
        it('should not delete record with no id', function () {
            (function () {
                return domain.deleteRecord(DomainRecord.fromJSON({type: 'A'}));
            }).should.throw('DomainRecord::id is not defined');
        });
        types.map(function (type) {
            it('should delete record "' + type + '"', function (done) {
                var record = new DomainRecord();
                record.setId('4432231');
                return domain.deleteRecord(record).then(function () {
                    done();
                }, done);
            });
            it('should fail on record "' + type + '"', function (done) {
                var record = new DomainRecord();
                record.setId('4432231');
                return domainWithFailApi.deleteRecord(record).fail(function () {
                    done();
                });
            });
        });
    });
});

function ApiMock(dir) {
    this._dir = dir;
}

ApiMock.prototype = {
    getDomainName: function () {
        return 'example.com';
    },
    request: function (path) {
        return vowFs.read(this._dir + '/' + path, 'utf8').then(function (data) {
            var defer = vow.defer();
            parseString(data, function (err, result) {
                if (err) {
                    defer.reject(err);
                } else {
                    if (result.page.domains[0].error[0] === 'ok') {
                        defer.resolve(result);
                    } else {
                        defer.reject(new Error(result.page.domains[0].error[0]));
                    }
                }
            });
            return defer.promise();
        });
    }
};
