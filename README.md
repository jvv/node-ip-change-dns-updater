# node-ip-change-dns-updater

NodeJS script to update the DNS when your ISP changes your external IP address.

Note: Only transip.nl (currently) supported

## Installation

- clone repository
- cd into repository directory
- ```npm install```
- ```mkdir data```

## Configuration

```mv config.example.js config.js```

Edit the config. The TransIP key can be requested at the control panel of TransIP.

| Key                | Value                                                                                                                     |
|--------------------|---------------------------------------------------------------------------------------------------------------------------|
| domain             | The tld domain you own & want to use for VPN.                                                                             |
| dnsEntry           | The `name` field of the DNS entry you want to use. (e.g. 'vpn').                                                          |
| cacheValid         | In minutes: how long local cache should be honored (e.g. when to call TransIP's API for retrieving of your DNS settings). |
| ttl                | In seconds: TTL setting of the DNS entry.                                                                                 |
| dataDir            | Path to the directory where your cached version of the DNS will be saved.                                                 |
| transip            | Object holding login & privateKey                                                                                         |
| transip.login      | The username you use to login into TransIP's control panel.                                                               |
| transip.privateKey | The private key that you can retrieve from TransIP's control panel.                                                       |

## Running the script

``` node ./index.js```

I'm running this script every hour through cron as such:

```* */1 * * * /usr/bin/node /path/to/node-ip-change-dns-updater/index.js >> /path/to/logs/node-ip-change-dns-updater.log```

### Features

- Checks the external IP of your connection.
- Gets DNS entries from chosen domain (config.js) from TransIP.
- Verifies this IP with the IP address of the DNS entry of your liking (config.js).
- Updates DNS entries at TransIP if the external IP address differs from the DNS entry.