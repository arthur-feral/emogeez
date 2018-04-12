var fs = require('fs');
var packageJSON = require('../package.json');
var version = packageJSON.version;

var versionFile = {
  version: version,
};

fs.writeFileSync([__dirname, '../dist/version.json'].join('/'), JSON.stringify(versionFile), 'utf8');
