const queue = require('../config/kue');
const commentsMail = require('../emails/comments_mail');

//kue worker will process jobs in the email queue one by one and sends the email
//whenever a job is pushed to the queue - email, that job is processed here
queue.process('email', function(job, done){
    commentsMail.mailNewComment(job.data);
    done();
});