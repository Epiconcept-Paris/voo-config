# voo-config
------
Manage properties from a json with several environments.

## Install
```
$ npm install git+https://github.com/Epiconcept-Paris/voo-config.git#1.0.0
```

## Usage with file
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

// not using an ES6 transpiler
var Config = require('voo-config');

Config.fromFile(path.join(__dirname, 'application.json'));
Config.setEnv('development');

// return 8080
Config.get('port');
```
## Usage with JS object
```
// using an ES2015 transpiler, like babel
import Config from 'voo-config';

// not using an ES6 transpiler
var Config = require('voo-config');

Config.fromObject({
  development: {
    name: "test"
  }
});

Config.setEnv('development');
// return 'test'
Config.get('name');
```
## How to get property ? (es2015)
```
Config.setEnv('development');
// return 8080
Config.get('port');
// return 'localhost'
Config.get('host');

Config.setEnv('production');
// return 8002
Config.get('port');
// return 'localhost'
Config.get('host');
```
### How to get property with default value? (es2015)
```
// return 'default value'
Config.get('inexistant-property', 'default value');
```
### How to get severals properties with default values? (es2015)
```
// return {
//    'inexistant-property': 'default value',
//    'port': 8002
// }
Config.setEnv('production');
Config.get(['inexistant-property', 'port'], ['default value']);
```
### How to get from a sub-object? (es2015)
```
// return {
//    'name': 'root',
//    'password': 'secret',
//    'locales': ['en', 'fr']
// }
Config.setEnv('development');
Config.get('admin');

// return 'root'
Config.get('admin.name');
// return ['en', 'fr']
Config.get('admin.locales');
```
