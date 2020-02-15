const config  = require('../config');
var TransIP = require('transip');
const transipInstance = new TransIP(config.transip.login, config.transip.privateKey);


const getDnsEntries = function(domain) {
    return new Promise((resolve, reject) => {
        transipInstance.domainService.getInfo(domain)
            .then((info) => {
                resolve(info.dnsEntries);
            })
            .catch(error => reject(error));
    });
}

exports.getDnsEntries = getDnsEntries;

// module.exports.tiApi = {

  

//     setDnsEntries = (domain, dnsEntries) => {
//         console.log(`Setting DNS entries for ${domain}`);
//         console.log(dnsEntries);
//     }
// }