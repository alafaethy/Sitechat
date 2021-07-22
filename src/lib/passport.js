const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy


const pool = require('../database')
const helpers = require('../lib/helper')

// PUXAR OS DADOS PARA FAZER LOGIN
passport.use('local.login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    const rows = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length > 0) {
        const user = rows[0];
        const validPassword = await helpers.matchPassword(password, user.password);
        if (validPassword) {
            done(null, user, req.flash('success', 'Welcome ' + user.username))
        } else {
            done(null, false, req.flash('message', 'Incorrect Password'));
        }
    } else {
        return done(null, false, req.flash('message', 'The username does not exists'))
    }//validação da senha 
}))



// SALVAR OS DADOS DO CADASTRO
passport.use('local.cadastro', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true

}, async (req, email, password, done) => {
    const { fullname } = req.body;
    const { username } = req.body;
    const newUser = {
        email,
        password,
        fullname,
        username

    };

    newUser.password = await helpers.encryptPassword(password)
    const result = await pool.query('INSERT INTO users SET ?', [newUser]);
    newUser.id = result.insertId;
    return done(null, newUser);
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
})

passport.deserializeUser(async (id, done) => {
    const rows = await pool.query('SELECT * FROM users Where id = ?', [id])
    done(null, rows[0]);
})