const passport = require('passport');
//importing the strategy
const JwtStrategy = require('passport-jwt').Strategy;
//below import is used to extract jwt from the header
const ExtractJwt = require('passport-jwt').ExtractJwt;
const UserModel = require('../models/user');

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'secretKeyToEncrypt22';

//to read the JWT from the http Authorization header 
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    console.log('trying to authenticate the user');
    console.log('payload start:');
    console.log(jwt_payload);
    console.log('payload end');
    UserModel.findById(jwt_payload._id, function(err, user) {
        if (err) {
            console.log('errr finding user in jwt');
            return done(err, false);
        }
        console.log('user found in jwt-strategy is:',user);
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    });
}));

module.exports=passport;

// for jwt auth token method, install the strategy via npm and then setup this config file
// next create the users_api file in controller directory, followed by setting up the router
