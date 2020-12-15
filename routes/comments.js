var express = require('express');
var router = express.Router();
const passport = require('passport');

const commentsController = require('../controllers/comments_controller');

router.post('/create', passport.checkAuthentication, commentsController.create);
router.get('/delete/:id', passport.checkAuthentication, commentsController.deleteComment);

module.exports = router;