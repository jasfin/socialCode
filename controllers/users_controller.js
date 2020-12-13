const UserModel = require('../models/user');
const fs = require('fs');
const path = require('path');


module.exports.profile = function(req,res){
    console.log('Req here is',req);
    console.log('user sent to view is:', req.user);
    UserModel.findById(req.params.id, function(err,user){
        return res.render('user_profile',{
            title: 'User profile',
            friend_profile: user
            //userFound: req.user
        });
    });
}

module.exports.update = async function(req,res){
    // if(req.user.id == req.params.id){
    //     user.findByIdAndUpdate(req.params.id,req.body,function(err,user){
    //         req.flash('success','Updated the details successfully');
    //         return res.redirect('back');
    //     });
    // }
    // else{
    //     req.flash('error','Unauthorised operation');
    //     return res.status(401).send('Unauthorized');
    // }
    if(req.user.id == req.params.id){
        try {
            let userToUpdate = await UserModel.findById(req.params.id);
            //req.body not accessbile here as we have encType as multipart formdata
            console.log('req.body.name here is:',req.body.name);
            UserModel.uploadDp(req, res, function(err){ //on calling uploadDp we will save the file in the uploads directory, path to the file is linked to the user object in the callback fn
                if(err){
                    console.log('Error from multer:',err);
                    return;
                }
                console.log(req.file);
                userToUpdate.name = req.body.name;
                userToUpdate.email = req.body.email;
                if(req.file){
                    if(userToUpdate.dp && fs.existsSync(path.join(__dirname,'..',userToUpdate.dp))){
                        fs.unlinkSync(path.join(__dirname,'..',userToUpdate.dp));
                    }
                    userToUpdate.dp = UserModel.pathToDp + '\\' + req.file.filename;
                }
                userToUpdate.save();
                return res.redirect('back');
            });
        } catch (error) {
            req.flash('error', error);
            return res.redirect('back');
        }
    }
    else{
        req.flash('error','Unauthorised operation');
        return res.status(401).send('Unauthorized');
        //return res.status(401).send('Unauthorized');
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
    let userToCreate = new UserModel(req.body);
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
    UserModel.findOne({email:req.body.email},function(err,userFound){
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

