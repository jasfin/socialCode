const properties = require('./properties');
const fs = require('fs');
const path = require('path');

module.exports = (app) => {
    app.locals.assetPath = function(filePath){
        if (properties.name == 'DEV_ENV'){
            console.log('returning in dev mode:',filePath);
            return filePath;
        }
        console.log('filepath is',filePath,':and substring is:',filePath.substring(1));
        console.log('returning:','/' + JSON.parse(fs.readFileSync(path.join(__dirname, '../public/assets/rev-manifest.json')))[filePath.substring(1)])
        return '/' + JSON.parse(fs.readFileSync(path.join(__dirname, '../public/assets/rev-manifest.json')))[filePath.substring(1)];
    }
}