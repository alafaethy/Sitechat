const express = require('express');
const router = express.Router();

const pool = require('../database')
const { isLoggedIN } = require('../lib/auth')

// ROTA de DADOS
router.get('/add', isLoggedIN, (req, res) => {
    res.render('links/add');
})

router.post('/add', isLoggedIN, async (req, res) => {
    const { title, description, url } = req.body;
    const newLink = {
        title,
        description,
        url,
        user_id: req.user.id
    }; // puxar os dados de email e senha 
    await pool.query('INSERT INTO links set ?', [newLink]);
    req.flash('success', 'Links Saved Successfully');
    res.redirect('/links') //<----rederecionamento para a pagina do acessos
})

router.get('/', isLoggedIN, async (req, res) => {
    const user = await pool.query('SELECT * FROM links WHERE user_id = ?', [req.user.id]);
    res.render('links/list', { user });

}) // seleciona os usuario do banco

router.get('/delete/:id', isLoggedIN, async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM links WHERE ID = ?', [id]);
    req.flash('success', 'Link Removed Successfully');
    res.redirect('/links')
}) //deletar usuario do banco 

router.get('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const links = await pool.query('SELECT * FROM links WHERE id = ?', [id]);
    res.render('links/edit', { link: links[0] });
});

router.post('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, url } = req.body;
    const newLink = {
        title,
        description,
        url
    };
    await pool.query('UPDATE links set ? WHERE id = ?', [newLink, id]);
    req.flash('success', 'Link Updated Successfully');
    res.redirect('/links');
}); // Atualizar os dados e volta para pagina dos acessos 


module.exports = router;



