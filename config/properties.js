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
    name: 'development_environment',
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
        //mode: "dev",
        mode: "combined",
        options: { stream: stream}
    }
}

const production =  {
    name: 'production_environment',
    assets_path: process.env.assets_path, //add the key-value pairs in the system vars of env variable
    session_cookie_key: '1NwMuiXxykm1tJc8YvPQhA0KfWMqWw2D',
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
    jwt_secret_key: 'LFw1bBqzoQ4i3EdH7ba8LNHTrVCU6JDn',
    morgan: {
        mode: "combined",
        options: { stream: stream}
    }
}

      //       = eval(process.env.exec_mode) == undefined ? development:production;
module.exports = development; //check if exec_mode which is the env var we set in package.json is there or not, if yes
                                // export variable production else export development