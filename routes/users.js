var express = require('express')
var router = express.Router();
const passport = require('passport');

const usersController = require('../controllers/users_controller');

console.log('Users router loaded');

router.get('/profile/:id', passport.checkAuthentication ,usersController.profile);
router.get('/signin',usersController.getSignInPage);
router.get('/signup',usersController.getSignUpPage);
router.post('/signin',usersController.signIn);
router.post('/signup',usersController.register);
router.post('/update/:id',usersController.update);

router.post('/create-session', passport.authenticate(
    'local',
    {failureRedirect: '/users/signin'},
),
    usersController.createSession);

router.get('/sign-out',usersController.destroySession);
module.exports=router;