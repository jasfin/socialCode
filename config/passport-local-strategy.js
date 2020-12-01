const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

//user authentication using passport - user is authenticated here
passport.use(new LocalStrategy({
      usernameField: 'email'
    },
    function(email,password,done){
        User.findOne({email:email},function(err,userFound){
            if(err){
                console.log('Error finding user from passport');
                return done(err);
            }

            if(!userFound || userFound.password != password){
                console.log("Invalid username/password");
                return done(null,false);
            }
            console.log('hurray!!, found the user');
            return done(null,userFound); //successfully authenticated, here we pass the user object to the serializeUser function
        });
    }
));


passport.checkAuthentication = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    console.log('you cant view profile page as not signed in');
    return res.redirect('/users/signin');
}

passport.setAuthenticatedUser = function(req,res,next){
    //console.log('print req here22:',req);
    if(req.isAuthenticated()){
        //if req.user contains the signed in user in the session cookie, we send this to the locals for being available to the views
        res.locals.userFound = req.user;
    }
    next();
}


//serializing the user to decide which key to be put up in the cookies
//here we are setting the userId to the cookie, passport stores it in encrypted format
passport.serializeUser(function(userFound,done){ //here serializer will put the userId in the session cookie, which is in turn encrypted by express session middleware 
    console.log('inside serialize fn');
    done(null,userFound.id);
});


//deserializing the user from key in cookie
//here from the userId we get from the browser request our browser has to identify which user is on the other side
passport.deserializeUser(function(id,done){
    console.log('inside deserialize fn');
    User.findById(id, function(err,userFound){
        if(err){
            console.log('Error in finding user - this from deserialize passport');
            return done(err);
        }
        console.log('user found after deserialized id check in db is:',userFound);
        return done(null,userFound);
    })
});

module.exports = passport;