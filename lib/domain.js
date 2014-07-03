var DomainRecord = require('./domain-record');
var Api = require('./api');
var vow = require('vow');

function Domain(api) {
    this._api = api;
}

Domain.prototype = {
    /**
     * @returns {String}
     */
    getName: function () {
        return this._api.getDomainName();
    },
    /**
     * @returns {vow.Promise<DomainRecord[]>}
     */
    getRecords: function () {
        return this._api.request('get_domain_records.xml').then(function (result) {
            return vow.all(result.page.domains[0].domain[0].response[0].record.map(function (json) {
                json.$.content = json._ ? json._.trim() : undefined;
                return DomainRecord.fromJSON(json.$);
            }));
        });
    },

    /**
     * @param {DomainRecord} record
     * @returns {vow.Promise}
     */
    addRecord: function (record) {
        if (!record.getType()) {
            throw Error('DomainRecord::type is not defined');
        }
        return this._api.request('add_' + record.getType().toLowerCase() + '_record.xml', record.toJSON());
    },

    /**
     * @param {DomainRecord} record
     * @returns {vow.Promise}
     */
    updateRecord: function (record) {
        if (!record.getType()) {
            throw Error('DomainRecord::type is not defined');
        }
        if (!record.getId()) {
            throw Error('DomainRecord::id is not defined');
        }
        return this._api.request('edit_' + record.getType().toLowerCase() + '_record.xml', record.toJSON());
    },

    /**
     * @param {DomainRecord} record
     * @returns {vow.Promise}
     */
    deleteRecord: function (record) {
        if (!record.getId()) {
            throw Error('DomainRecord::id is not defined');
        }
        return this._api.request('delete_record.xml', {record_id: record.getId()});
    }
};

module.exports = Domain;
