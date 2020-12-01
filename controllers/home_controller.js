module.exports.home = function(req,res){
    //console.log('Cookies are:', req.cookies);
    //res.cookie('user_id',23); - this will alter the cookie defined in application tab of chrome dev
    return res.render('home',{
        title:'Social Media Platform'
    });
}