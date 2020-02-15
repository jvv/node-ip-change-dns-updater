const fs = require('fs-extra');
const transip = require('./app/transip');
const cachedEntries = require('./app/cached-entries');
const externalIp = require('./app/external-ip');


const domain = 'pixe.nl';
const dnsEntry = 'vpn';

const output = {
    knownIp: '',
    externalIp: '',
    dnsEntries: []
}

// function getKnownIp() { 
//     return new Promise((resolve, reject) => {
//         fs.readJson('./data/ip.json')
//             .then( knownIp => {
//                 const ip = knownIp.ip;
//                 doLog('info', `Known IP address = ${ip}`);
//                 output.knownIp = ip;   
//                 resolve(ip);
//             })
//             .catch(error => {
//                 doLog('error', error);
//                 reject(error);
//             }) ;
//     });
// }

// function validateIpAddresses() {
//     let knownIp = '';
//     doLog('info', `Mathing: ${output.knownIp} with ${output.externalIp}`);
//     if(output.knownIp !== output.externalIp) {
//         doLog('warn', 'IP addresses do not match');
//         getDnsEntry();
//     } else {
//         doLog('info', 'IP the same');
//     }
// }

// function getDnsEntry() {
//     doLog('info', `Getting DNS entries for ${domain}`);
//     transipInstance.domainService.getInfo(domain)
//     .then( (info) => {
//         output.dnsEntries = info.dnsEntries;
//         setDnsEntries();
//     });
// }

// function setDnsEntries() {
//     // see if we have entry with name: ${dnsEntry}
//     // const dnsMatch = output.dnsEntries.filter((e) => {
//     //     return e.name === dnsEntry;
//     // })
//     try {
//         if(output.dnsEntries.find(entry => entry.name === dnsEntry)) {
//             output.dnsEntries.find(entry => entry.name === dnsEntry).content = output.externalIp;
//         } else {
//             output.dnsEntries.push({name: dnsEntry, expire: '86400', type: 'A', content: output.externalIp});
//         }
//         doLog('info', output.dnsEntries);
//     } catch(error) {
//         doLog('error', error);
//     }
//     // add if not

//     // update if have
// }

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

externalIp.getIp()
    .then((ip) => {
        doLog('info', `The current external IP address is ${ip}`);
        output.externalIp = ip;
    }).catch(error => {
        doLog('error', error);
    });

cachedEntries.cachedEntries(domain)
    .then((data) => {
        doLog('info', data);
    })
    .catch(error => {
        doLog('error', error);
    })

transip.getDnsEntries(domain)
    .then((data) => {
        doLog('info', `DNS entries from ${domain} succesfully returned`);
        output.dnsEntries = data;
    })
    .catch(error => {
        doLog('error', error);
    })