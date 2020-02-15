const https = require('https');
const ipifyOptions = {
  hostname: 'api.ipify.org',
  port: 443,
  path: '/?format=json',
  method: 'GET'
}

const getIp = function() {
    return new Promise((resolve, reject) => {
        const req = https.request(ipifyOptions, (res) => {
            res.on('data', (data) => {
                const ip = JSON.parse(data).ip;
                resolve(ip);
              });
        });
        req.on('error', (e) => {
            reject(e);
        });
        req.end();
    });
}

exports.getIp = getIp;