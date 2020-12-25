const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.createPost = async function(req,res){
    //converting below one to async await format
    // Post.create({
    //     content: req.body.content,
    //     user:req.user._id
    // },function(err,post){
    //     if(err){
    //         console.log('Error while creating a post');
    //         return;
    //     }
    //     return res.redirect('back');
    // });
    try {
            let createdPost = await Post.create({
                content: req.body.content,
                user:req.user._id
            });   
            console.log('created post22 is',createdPost);
            //the below if is added after converting the post creation part to ajax
            if(req.xhr){
                //bug fix for post owner name coming as undefined
                createdPost = await createdPost.populate('user').execPopulate();
                return res.status(200).json({
                    data: {
                        post: createdPost
                    },
                    message: 'Post created successfully!!'
                })
            }

            req.flash('success','post created');
            return res.redirect('back');
    } catch (error) {
            req.flash('error', error);
            console.log('Error while creating a post');
            return;
    }    
}

module.exports.deletePost = async function(req, res){
    //converted below one to async await format
    // console.log('inside delete post');
    // Post.findById(req.params.id, function(err, post){
    //     // here we are using user.id, bcs it converts the id to string
    //     if (post.user == req.user.id){ //post owner should match the user who wants to delete it
    //         post.remove();

    //         Comment.deleteMany({post: req.params.id}, function(err){
    //             return res.redirect('back');
    //         });
    //     }else{
    //         return res.redirect('back');
    //     }

    // });

    try {
            console.log('inside delete post');
            let postFound = await Post.findById(req.params.id);
            
            // here we are using user.id, bcs it converts the id to string
            if(postFound.user == req.user.id){ //post owner should match the user who wants to delete it

                await postFound.remove();
                await Comment.deleteMany({post: req.params.id});

                if(req.xhr){
                    console.log('deletion req is xhr');
                    return res.status(200).json({
                        data: {
                            post_id: req.params.id
                        },
                        message: 'Post deleted successfully'
                    });
                }
                else{
                    console.log('deletion req is not xhr');
                }

                req.flash('success','post deleted');
                return res.redirect('back');
            
            }  
            else{
                req.flash('error','You cannot delete this post');
                return res.redirect('back');
            }  
    } catch (error) {
        req.flash('error', error);
            return res.redirect('back');               
    }


}