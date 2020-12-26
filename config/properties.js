const rfs = require("rotating-file-stream");
const fs = require('fs');
const path = require('path');

const logDirectory = path.join(__dirname,'../logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
const stream = rfs.createStream("file.log", {
    size: "10M", // rotate every 10 MegaBytes written
    interval: "1d", // rotate daily
    compress: "gzip", // compress rotated files
    path: logDirectory
});


const development = {
    name: 'DEV_ENV',
    assets_path: '/assets',
    session_cookie_key: 'blahsomething',
    db_name: 'socialCode_development',
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'jasfin1995',
            pass: 'trollingktu'
        }
    },
    jwt_secret_key: 'socialCode',
    morgan: {
        mode: "dev",
        mode: "combined",
        options: { stream: stream}
    }
}

const production =  {
    name: 'PROD_ENV',
    assets_path: process.env.assets_path, //add the key-value pairs in the system vars of env variable
    session_cookie_key: process.env.session_cookie_key,
    db_name: process.env.db_name,
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.GMAIL_USERNAME,
            pass: process.env.GMAIL_PASS
        }
    },
    jwt_secret_key: process.env.JWT_SECRET_KEY,
    morgan: {
        mode: "combined",
        options: { stream: stream}
    }
}

      //       = eval(process.env.exec_mode) == undefined ? development:production;
module.exports = production; //check if exec_mode which is the env var we set in package.json is there or not, if yes
                                // export variable production else export development


// npm install --global gulp-cli - to install gulp
// npm install --save-dev gulp - this is to add devDependency in our project
// npm install gulp-sass - this lib is used to convert sass to CSS
// npm install gulp-cssnano - this is to compress the css file
// npm install gulp-rev - this is to rename the css file with some hash, to prevent css caching