const express = require('express');
const Router = express.Router();
const connection = require('../../connection.js');
const bcrypt = require('bcrypt');

Router.use(express.urlencoded({extended: false}));

Router.use(express.static("public"));

Router.get('/', (req, res) => {
    res.render('userLogin.hbs');
});

Router.post('/', (req, res) => {
    connection.query('SELECT email, password, username FROM users', (err, rows, field) => {
        if(!err) {
            for(let i = 0; i < rows.length; i++) {
                if(rows[i].email === req.body.email) {
                    bcrypt.compare(req.body.password, rows[i].password, (err, result) => {
                        if(result) {
                            res.render('dashboard.hbs', {email:rows[i].email,name:rows[i].username});
                        } else {
                            res.redirect('/');
                        }
                    });
                } 
            }
        } else {
            console.log(err);
        }
    })
});

module.exports = Router;