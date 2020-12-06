
//this flash obj that we have set here will be accessed in layout.js as its common file for all views
module.exports.setFlash = function(req,res,next){
    res.locals.flash = {
        "success": req.flash('success'),
        "error": req.flash('error')
    }
    next();
}