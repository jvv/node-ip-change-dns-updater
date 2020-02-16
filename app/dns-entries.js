const config  = require('../config');
const fs = require('fs-extra');
var TransIP = require('transip');
const transipInstance = new TransIP(config.transip.login, config.transip.privateKey);

const getDnsEntries = function(domain) {
    return cachedDnsEntriesValid()
        .then(response => {
            return getDnsEntriesFromCache();
        })
        .catch(error => {
            return getDnsEntriesFromHost(config.domain);
        })
}

const cachedDnsEntriesValid = function() {
    const response = {};
    return new Promise((resolve, reject) => {
        fs.stat(`${config.dataDir}${config.domain}.json`, function(err, stats){
            if(typeof stats === "undefined") {
                // @todo - why do I need return here?
                return reject('File does not exist');
            }
            const minutes = ((new Date().getTime() - stats.mtime) / 1000) / 60;
            if(config.cacheValid > minutes) {
                resolve('Cache available and recent');
            } 
            reject('Cache available but older than allowed');
        });    
    })
}

const getDnsEntriesFromHost = function() {
    return new Promise((resolve, reject) => {
        transipInstance.domainService.getInfo(config.domain)
            .then((info) => {
                setDnsEntriesCache(info.dnsEntries);
                resolve(info.dnsEntries);
            })
            .catch(error => reject(error));
    });
}

const getDnsEntriesFromCache = function() {
    return new Promise((resolve, reject) => {
        fs.readJson(`${config.dataDir}${config.domain}.json`, (err, data) => {
            if (err) {
                reject(err);
            }
            resolve(data);
          })
    });
}

const setDnsEntriesCache = function(dnsEntries) {
    return new Promise((resolve, reject) => {
        fs.writeJson(`${config.dataDir}${config.domain}.json`, dnsEntries, err => {
            if (err) { 
                reject(err)
            } 
            resolve('DNS entries cached.');
          });
    });
}

/**
 * setDnsEntries
 * @input data = {} externalIp, dnsEntries
 * Match externalIp with config.dnsEntry
 * If match, do nothing
 * Else Overwrite IP for config.dnsEntry OR create config.dnsEntry
 */
const setDnsEntries = function(data) {
    return new Promise((resolve, reject) => {
        if(data.dnsEntries.length > 0 && data.externalIp) {
            if(data.knownIp === data.externalIp) {
                return reject(`External IP (${data.externalIp}) matches DNS entry (${data.knownIp}), no need to update DNS host`);
            } else {
                const validatedData = validateDnsEntry(data);
                return setDnsEntriesAtHost(validatedData);
            }
        } else {
            reject('Not enough data to check if DNS entries need to be updated.');
        }    
    });
}

const setDnsEntriesAtHost = function(data) {
    return new Promise((resolve, reject) => {
        transipInstance.domainService.setDnsEntries(config.domain, data.dnsEntries)
            .then((response) => {
                resolve(`DNS updated: ${response}`);
            })
            .catch(error => reject(error));
    })
}

const validateDnsEntry = function(data) {
    if(data.dnsEntries.find(entry => entry.name === config.dnsEntry)) {
        data.dnsEntries.find(entry => entry.name === config.dnsEntry).content = data.externalIp;
    } else {
        data.dnsEntries.push({name: config.dnsEntry, expire: '300', type: 'A', content: data.externalIp});
    }
    return data;
}

exports.getDnsEntries = getDnsEntries;
exports.setDnsEntries = setDnsEntries;