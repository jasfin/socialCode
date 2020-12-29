const Comment = require('../models/comment');
const Post = require('../models/post');
// const commentsMailer = require('../emails/comments_mail');
const queue = require('../config/kue');
const emailCommentWorker = require('../kueWorker/email_comment_worker');

//first find if the post exists and then only create the comment in db
module.exports.create = async function(req, res){
    // Post.findById(req.body.post, function(err, post){
    //     if (post){
    //         Comment.create({
    //             content: req.body.content,
    //             post: req.body.post,
    //             user: req.user._id
    //         }, function(err, comment){
    //             // handle error
    //             post.comments.push(comment);
    //             post.save();
    //             res.redirect('/');
    //         });
    //     }
    // });
    try {
        let postFound =  await Post.findById(req.body.post);
        if(postFound){
            let commentCreated = await Comment.create({
                    content: req.body.content,
                    post: req.body.post,
                    user: req.user._id
            });
            postFound.comments.push(commentCreated);
            postFound.save();
            console.log('comment created is22:',commentCreated);
            if(req.xhr){
                console.log('is xhr');
                commentCreated = await commentCreated.populate('user').execPopulate();
                //commentsMailer.mailNewComment(commentCreated);

                //commented above line as we are using kue now
                //here we add a job to the email queue which will be processed by the kue worker
                //to view the state of the jobs processed by kue, go to /node_modules/kue/bin/ in a terminal
                    //and do run the js file - kue-dashboard
                let jobCreated = queue.create('email', commentCreated).priority('normal').save( function(error){
                    if(error){
                        return console.log('error while pushing comment-email job to queue:',error);
                    }
                    console.log('job pushed to the queue has id:',jobCreated.id);
                });

                return res.status(200).json({
                    data: {
                        comment: commentCreated
                    },
                    message: 'Comment created successfully'
                });
            }
            else{
                console.log('not xhr here');
            }
            req.flash('success','comment created');
            return res.redirect('back');
        }
    } catch (error) {
        req.flash('error', error);
            console.log('Error creating comment:',error);
            return;    
    }
    
}

module.exports.deleteComment = async function(req, res){
    // Comment.findById(req.params.id, function(err, comment){
    //     if (comment.user == req.user.id){ //ensuring its the comment owner who wants to delete the comment
    //         let postId = comment.post;
    //         comment.remove();
    //         Post.findByIdAndUpdate(postId, { $pull: {comments: req.params.id}}, function(err, post){ //pull will pullOut, ie; delete the req.params.id which is the comment id that we pass from the list of objectIds
    //             return res.redirect('back');
    //         })
    //     }else{
    //         return res.redirect('back');
    //     }
    // });
    let commentToDelete = await Comment.findById(req.params.id);
        if (commentToDelete.user == req.user.id){ //ensuring its the comment owner who wants to delete the comment
            let postId = commentToDelete.post;
            commentToDelete.remove();
            let postModified = await Post.findByIdAndUpdate(postId, { $pull: {comments: req.params.id}});  //pull will pullOut, ie; delete the req.params.id which is the comment id that we pass from the list of objectIds
            if(req.xhr){
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: 'Post deleted successfully'
                });
            }
            req.flash('success','comment deleted');            
            return res.redirect('back');
        }else{
            req.flash('error','You cannot delete this comment');
            return res.redirect('back');
        }
}