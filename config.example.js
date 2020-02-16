var config = {
    "domain": "example.com",
    "dnsEntry": "secure",
    "cacheValid": 180, // minutes
    "ttl": 300, // seconds
    "dataDir": "./data/",
    "transip": {
        "login": "transip_username",
        "privateKey": 
`-----BEGIN PRIVATE KEY-----
****your_transip_key_here****
-----END PRIVATE KEY-----`
    }
}