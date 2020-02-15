const fs = require('fs-extra');

const cachedEntries = function(domain) {
    return new Promise((resolve, reject) => {
        fs.readJson(`./data/ip.json`) // ${domain}
            .then((data) => {
                console.log(data);
                resolve(data);
            })
            .catch(error => {
                reject(error);
            })
    });
}

exports.cachedEntries = cachedEntries;