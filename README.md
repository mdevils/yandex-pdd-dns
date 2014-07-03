# yandex-pdd-dns

NodeJS API for Yandex PDD DNS (http://api.yandex.ru/pdd/doc/reference/api-dns.xml).

## Installation

`yandex-pdd-dns` can be installed using `npm`:

```
npm install yandex-pdd-dns
```

## CLI Usage

Example:

```javascript
./node_modules/.bin/yandex-pdd-dns list --domain example.com --token d508b88981b8511f8b5051dc631451cd4b000db8d854b1c9d4b4b918
```

DynDNS usage:

```javascript
./node_modules/.bin/yandex-pdd-dns dyndns --domain example.com --token d508b88981b8511f8b5051dc631451cd4b000db8d854b1c9d4b4b918 --subdomain local
```

## API Usage

Example:

```javascript
var dns = require('yandex-pdd-dns');
var Domain = dns.Domain;
var Api = dns.Api;

var domain = new Domain(new Api(
    'example.com',
    'd508b88981b8511f8b5051dc631451cd4b000db8d854b1c9d4b4b918'
));

var ip = '127.0.0.1';
var subdomain = 'local';

domain.getRecords().then(function (records) {
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
```
