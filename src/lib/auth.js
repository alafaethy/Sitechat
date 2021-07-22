module.exports = {
    isLoggedIN(req, res, next) {
        if (req.isAuthenticated()) {
            return next()
        }
        return res.redirect('/login')
    },
    isNotloggedin(req, res, next) {
        if (!req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/profile')
    }
}