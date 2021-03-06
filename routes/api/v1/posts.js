var express = require('express');
const passport = require('passport');
var router = express.Router();

const postsApi = require('../../../controllers/api/v1/posts_api');

router.get('/',postsApi.index);
router.delete('/:id', passport.authenticate('jwt',{session:false}), postsApi.deletePost);

module.exports=router;