const nodeMailer = require('../config/nodemailer');

module.exports.mailNewComment = function(comment) {
    console.log('comment arg is:', comment);
    let htmlToMail = nodeMailer.renderTemplate({comment:comment});
    nodeMailer.transporter.sendMail({
       from: 'jasfin1995@gmail.com',
       to: comment.user.email,
       subject: "New comment published",
       html: htmlToMail//'<h3>Hurray!! Your comment is published</h3>' 
    },
    (err, msg) => {
        if (err){
           console.log('Error in sending mail', err);
           return;
        }
        console.log('Message sent', msg);
        return;
    });
}