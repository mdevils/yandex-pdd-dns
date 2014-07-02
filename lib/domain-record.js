/**
 * @constructor
 */
function DomainRecord() {}

DomainRecord.prototype = {
    getId: function () {
        return this._id;
    },

    setId: function (id) {
        this._id = id;
    },

    getType: function () {
        return this._type;
    },

    setType: function (type) {
        this._type = type;
    },

    getSubdomain: function () {
        return this._subdomain;
    },

    setSubdomain: function (subdomain) {
        this._subdomain = subdomain;
    },

    getPriority: function () {
        return this._priority;
    },

    setPriority: function (priority) {
        this._priority = priority;
    },

    getTtl: function () {
        return this._ttl;
    },

    setTtl: function (ttl) {
        this._ttl = ttl;
    },

    getContent: function () {
        return this._content;
    },

    setContent: function (content) {
        this._content = content;
    },

    getPort: function () {
        return this._port;
    },

    setPort: function (port) {
        this._port = port;
    },

    getWeight: function () {
        return this._weight;
    },

    setWeight: function (weight) {
        this._weight = weight;
    },

    getRefresh: function () {
        return this._refresh;
    },

    setRefresh: function (refresh) {
        this._refresh = refresh;
    },

    getRetry: function () {
        return this._retry;
    },

    setRetry: function (retry) {
        this._retry = retry;
    },

    getExpire: function () {
        return this._expire;
    },

    setExpire: function (expire) {
        this._expire = expire;
    },

    getMinTtl: function () {
        return this._minTtl;
    },

    setMinTtl: function (minTtl) {
        this._minTtl = minTtl;
    },

    getAdminMail: function () {
        return this._adminMail;
    },

    setAdminMail: function (adminMail) {
        this._adminMail = adminMail;
    },

    getNegCache: function () {
        return this._negCache;
    },

    setNegCache: function (negCache) {
        this._negCache = negCache;
    },

    getTarget: function () {
        return this._target;
    },

    setTarget: function (target) {
        this._target = target;
    },

    toJSON: function () {
        var result = {};
        PROP_LIST.forEach(function (prop) {
            var propName = prop[0];
            var exportName = prop[1];
            if (this[propName] !== undefined) {
                result[exportName] = this[propName];
            }
        }, this);
        return result;
    }
};

DomainRecord.fromJSON = function (json) {
    var result = new DomainRecord();
    PROP_LIST.forEach(function (prop) {
        var propName = prop[0];
        var exportName = prop[1];
        var altExportName = prop[2];
        if (json[exportName] !== undefined) {
            result[propName] = json[exportName];
        }
        if (altExportName && json[altExportName] !== undefined) {
            result[propName] = json[altExportName];
        }
    });
    return result;
};

var PROP_LIST = [
    ['_type', 'type'],
    ['_content', 'content'],
    ['_id', 'record_id', 'id'],
    ['_subdomain', 'subdomain'],
    ['_ttl', 'ttl'],
    ['_port', 'port'],
    ['_weight', 'weight'],
    ['_priority', 'priority'],
    ['_refresh', 'refresh'],
    ['_retry', 'retry'],
    ['_expire', 'expire'],
    ['_minTtl', 'minttl'],
    ['_adminMail', 'admin_mail'],
    ['_negCache', 'neg_cache'],
    ['_target', 'target']
];

module.exports = DomainRecord;
