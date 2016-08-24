# voo-config
------
Manage properties from a json with several environments.

## Install
```
$ npm install git+https://github.com/Epiconcept-Paris/voo-config.git#2.0.0
```

## Usage with file (NodeJS server)
> Application.json
```
{
  "production": {
    "port": 8002,
    "host": "localhost"
  },
  "production:development": {
    "port": 8080,
    "admin": {
      "name": "root",
      "password": "secret",
      "locales": ["en", "fr"]
    }
  }
}
```

```
// using an ES2015 transpiler, like babel
import Config from 'voo-config';
import fs from 'fs';
import path from 'path';

// not using an ES6 transpiler
var Config = require('voo-config');
var fs = require('fs');
var path = require('path');

var oConfig = Config.fromFile(fs, path.join(__dirname, 'application.json'));
oConfig.setEnv('development');

// return 8080
oConfig.get('port');
```
## Usage with JS object
```
// using an ES2015 transpiler, like babel
import Config from 'voo-config';

// not using an ES6 transpiler
var Config = require('voo-config');

var oConfig = Config.fromObject({
  development: {
    name: "test"
  }
});

oConfig.setEnv('development');
// return 'test'
oConfig.get('name');
```
## How to get property ? (es2015)
```
oConfig.setEnv('development');
// return 8080
oConfig.get('port');
// return 'localhost'
oConfig.get('host');

oConfig.setEnv('production');
// return 8002
oConfig.get('port');
// return 'localhost'
oConfig.get('host');
```
### How to get property with default value? (es2015)
```
// return 'default value'
oConfig.get('inexistant-property', 'default value');
```
### How to get severals properties with default values? (es2015)
```
// return {
//    'inexistant-property': 'default value',
//    'port': 8002
// }
oConfig.setEnv('production');
oConfig.get(['inexistant-property', 'port'], ['default value']);
```
### How to get from a sub-object? (es2015)
```
// return {
//    'name': 'root',
//    'password': 'secret',
//    'locales': ['en', 'fr']
// }
oConfig.setEnv('development');
oConfig.get('admin');

// return 'root'
oConfig.get('admin.name');
// return ['en', 'fr']
oConfig.get('admin.locales');
```
