const user = require('../models/user');
const userModel = require('../models/user');



module.exports.profile = function(req,res){
    console.log('Req here is',req);
    console.log('user sent to view is:', req.user);
    user.findById(req.params.id, function(err,user){
        return res.render('user_profile',{
            title: 'User profile',
            friend_profile: user
            //userFound: req.user
        });
    });
}

module.exports.update = function(req,res){
    if(req.user.id == req.params.id){
        user.findByIdAndUpdate(req.params.id,req.body,function(err,user){
            return res.redirect('back');
        });
    }
    else{
        return res.status(401).send('Unauthorized');
    }
}


// module.exports.profile = function(req,res){ - this is used in case of manual auth
//     //if userId is present in cookies render the profile page else go to sign in page
//     if(req.cookies.user_id){
//         userModel.findById(req.cookies.user_id,function(err,user){
//             if(user){
//                 return res.render('user_profile',{
//                     title: 'User profile',
//                     user: user
//                 })
//             }
//             return res.render('user_sign_in',{title:'Sign in here'});
//         })
//     }
//     else{
//         return res.render('user_sign_in',{title:'Sign in here'});
//     }
// }

module.exports.register = function(req,res){
    let userToCreate = new userModel(req.body);
    userToCreate.save(function(err,newUser){
        if(err){
            console.log('error creating a user');
            return ;
        }
        console.log('user created successfully');
        return res.redirect('back');
        // return res.render('home',{
        //     title:'Signed up page'
        // });
    });
}

module.exports.createSession = function(req,res){
    req.flash('success',"You have logged in successfully"); //we created a flash message, nxt step is to take this flash message and put it into the response, for this we create a middleware flashMiddleware.js
    return res.redirect('/');
}

module.exports.signIn = function(req,res){   //- this used for manual auth
    console.log('trying to find email:',req.body.email);
    userModel.findOne({email:req.body.email},function(err,userFound){
        if(err){
            console.log('error trying to sign in ', err);
            return;
        }
        if(userFound==null){
            console.log('No user found with this email Id');
            return res.end('User not found');
        }
        console.log('user found is:',userFound);
        console.log('response on signing is:',userFound.email);
        if(userFound.password===req.body.password){
            //setting the user_id key in cookies
            res.cookie('user_id',userFound.id);
            return res.redirect('/users/profile');
        } 
        else{
            res.end('Wrong Password');
        }       
    }); 
}

module.exports.getSignInPage = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile')
    }
    return res.render('user_sign_in',{
            title:'Sign in here'  
    })
}

module.exports.getSignUpPage = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile')
    }
    return res.render('user_sign_up',{
            title:'Sign up here'  
    })
}

module.exports.destroySession = function(req,res){
    req.logout();
    req.flash('success','You have logged out successfully');
    return res.redirect('/');    
}

