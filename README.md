# node-ip-change-dns-updater

NodeJS script to update the DNS when your ISP changes your external IP address.

Note: Only transip.nl (currently) supported

## Installation

- clone repository
- ```npm install```

## Configuration

```mv config.example.js config.js```

Edit the config. The TransIP key can be requested at the control panel of TransIP.

## Running the script

``` node ./index.js```

I'm running this script every 5 minutes through cron

### Features

- Checks the external IP of your connection.
- Gets DNS entries from chosen domain (config.js) from TransIP.
- Verifies this IP with the IP address of the DNS entry of your liking (config.js).
- Updates DNS entries at TransIP if the external IP address differs from the DNS entry.