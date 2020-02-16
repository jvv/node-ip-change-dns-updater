const fs = require('fs-extra');
const dnsEntries = require('./app/dns-entries');
const externalIp = require('./app/external-ip');
const config  = require('./config');

const output = {
    knownIp: '',
    externalIp: '',
    dnsEntries: []
}

function doLog(level, message) {
    const now = new Date();
    switch(level) {
        case 'info':
        console.log(now, message);
        break;
        case 'warn':
        console.warn(now, message);
        break;
        case 'error':
        console.error(now, message);
        break;
    }
}

function setDnsEntries(output) {
    dnsEntries.setDnsEntries(output)
        .then((response) => {
            doLog('info', `DNS updated succesfully: ${response}`);
        })
        .catch((error) => {
            doLog('error', error);
        })
}

externalIp.getIp()
    .then((ip) => {
        doLog('info', `The current external IP address is ${ip}`);
        output.externalIp = ip;
        
        doLog('info', 'Set DNS entries after externalIp.getIp()');
        setDnsEntries(output);
    }).catch(error => {
        doLog('error', error);
    });

dnsEntries.getDnsEntries()
    .then((data) => {
        doLog('info', `DNS entries from ${config.domain} succesfully returned`);
        output.dnsEntries = data;
        if(output.dnsEntries.find(entry => entry.name === config.dnsEntry)) {
            output.knownIp = output.dnsEntries.find(entry => entry.name === config.dnsEntry).content;
        }

        doLog('info', 'Set DNS entries after dnsEntries.getDnsEntries()');
        setDnsEntries(output);
    })
    .catch(error => {
        doLog('error', error);
    })