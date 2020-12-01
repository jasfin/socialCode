var express = require('express')
var router = express.Router()
const homeController = require('../controllers/home_controller');

console.log('home Router loaded');
// middleware that is specific to this router
// router.use(function timeLog (req, res, next) {
//   console.log('Time: ', Date.now())
//   next()
// });

router.get('/',homeController.home);
router.use('/users',require('./users'));

module.exports = router;

