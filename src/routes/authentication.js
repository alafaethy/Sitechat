//PUXADO E MOSTRA COM BASE NA PASTA AUTH

const express = require('express')
const router = express.Router();

const passport = require('passport')
const { isLoggedIN, isNotloggedin } = require('../lib/auth')


//PAGE DE CADASTRO
router.get('/cadastro', isNotloggedin, (req, res) => {
    res.render('auth/cadastro');
})

router.post('/cadastro', passport.authenticate('local.cadastro', {
    successRedirect: '/profile',
    failureRedirect: '/cadastro',
    failureflash: true
}))



//PAGE DE LOGIN
router.get('/login', isNotloggedin, (req, res) => {
    res.render('auth/login');
})

router.post('/login', isNotloggedin, (req, res, next) => {
    passport.authenticate('local.login', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next)
});





router.get('/profile', isLoggedIN, (req, res) => {
    res.render('profile')
})


router.get('/logout', isLoggedIN, (req, res) => {
    req.logOut();
    res.redirect('/');
})



module.exports = router;