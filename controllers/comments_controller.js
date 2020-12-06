const Comment = require('../models/comment');
const Post = require('../models/post');

//first find if the post exists and then only create the comment in db
module.exports.create = function(req, res){
    Post.findById(req.body.post, function(err, post){
        if (post){
            Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            }, function(err, comment){
                // handle error
                post.comments.push(comment);
                post.save();
                res.redirect('/');
            });
        }
    });
}

module.exports.deleteComment = function(req, res){
    Comment.findById(req.params.id, function(err, comment){
        if (comment.user == req.user.id){ //ensuring its the comment owner who wants to delete the comment
            let postId = comment.post;
            comment.remove();
            Post.findByIdAndUpdate(postId, { $pull: {comments: req.params.id}}, function(err, post){ //pull will pullOut, ie; delete the req.params.id which is the comment id that we pass from the list of objectIds
                return res.redirect('back');
            })
        }else{
            return res.redirect('back');
        }
    });
}