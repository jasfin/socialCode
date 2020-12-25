const nodemailer = require("nodemailer");
const path = require('path');
const ejs = require('ejs');
const properties = require('./properties');

//create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport(properties.smtp);

//using ejs template for sending the email, data is rendered to the template and returned
let renderTemplate = (data) => {
    let htmlToMail;
    ejs.renderFile(
        path.join(__dirname, '../views/email_template/comment_template.ejs'),
        data,
        function(err, templateResult){
        if (err) {
            console.log('error while setting up template');
            return;
        }         
        htmlToMail = templateResult;
        }
    );
    return htmlToMail;
}


module.exports = {
    transporter: transporter,
    renderTemplate: renderTemplate
}