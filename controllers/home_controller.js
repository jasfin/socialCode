const Post = require('../models/post');
const User = require('../models/user');

//async tells that the function is going to have some async operations
module.exports.home = async function(req,res){
    //console.log('Cookies are:', req.cookies);
    //res.cookie('user_id',23); - this will alter the cookie defined in application tab of chrome dev

    // Post.find({},function(err,posts){
    //     return res.render('home',{
    //         title:'Social Media Platform',
    //         posts:posts
    //     });
    // });

    //below code has been written using async and await
    //prepopulate the user when we find each post document
    // Post.find({})
    // .populate('user')
    // .populate({
    //     path: 'comments',
    //     populate: {
    //         path: 'user'
    //     }
    // })
    // .exec(function(err,posts){
    //     console.log('posts found is ',posts);

    //     User.find({}, function(err,users){
    //         return res.render('home',{
    //             title:'Social Media Platform',
    //             posts:posts,
    //             all_users:users
    //         });
    //     })

    // });

    try{
        let posts = await Post.find({}) //this is the first await
            .populate('user')
            .populate({
                path: 'comments',
                populate: {
                    path: 'user'
                }
        });

        let users = await User.find({}); //only after the first await is over, control comes to the second await

        return res.render('home',{ //only when the second await is over, this return statement is executed
            title:'Social Media Platform',
            posts:posts,
            all_users:users
        });
    }catch(err){
        console.log('error:',err);
        return;
    }
    
       
}