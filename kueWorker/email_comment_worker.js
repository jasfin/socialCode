const queue = require('../config/kue');
const commentsMail = require('../emails/comments_mail');

//kue worker will process jobs in the email queue one by one and sends the email
queue.process('email', function(job, done){
    commentsMail.mailNewComment(job.data);
    done();
});