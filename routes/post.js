var express = require('express');
var router = express.Router();
const passport = require('passport');

const postController = require('../controllers/posts_controller');

router.post('/create', passport.checkAuthentication, postController.createPost);
router.get('/delete/:id', passport.checkAuthentication, postController.deletePost);


module.exports = router;