const Post = require('../../../models/post');
const Comment = require('../../../models/comment');

module.exports.index = async function(req,res){
    let posts = await Post.find({}) //this is the first await
            .sort('-createdAt') // - b4 createdAt is used for desc order
            .populate('user')
            .populate({
                path: 'comments',
                populate: {
                    path: 'user'
                }
        });

    return res.json(200,{
        message: "this is the list of posts",
        posts: posts
    });
}

//test the below api with a delete req from post man by having the header- Authorization : Bearer token_value
module.exports.deletePost = async function(req, res){

    try {
            console.log('inside delete post');
            let postFound = await Post.findById(req.params.id);
            console.log('user of the post:',postFound.user);
            console.log('user of the post:',req.user.id);

            // here we are using user.id, bcs it converts the id to string
            if(postFound.user == req.user.id){ //post owner should match the user who wants to delete it

                await postFound.remove();
                await Comment.deleteMany({post: req.params.id});

                return res.json(200,{
                    message:"Post and its comments are deleted"
                });
            }
            else{
                return res.json(401,{
                    message:"Unauthorized deletion operation"
                });   
            }
                
    } catch (error) {
        //req.flash('error', error);
        console.log('error:',err);
        return res.json(500,{
            message:"Internal Server Error"
        });           
    }


}