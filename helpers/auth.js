module.exports = {
    ensureAuthenticated: function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash('e_msg', 'You need to login first');
        res.redirect('/user/login')
    }
}