const express = require('express');
const Router = express.Router();
const connection = require('../../connection.js');

Router.use(express.urlencoded({extended: false}));

Router.use(express.static("public"));

Router.get('/', (req, res) => {
    res.render('otpVerification.hbs');
});

Router.post('/', (req, res) => {
    if(req.body.otp === global.otp) {
        connection.query('SELECT * FROM users', (err, rows, field) => {
            if(!err) {
                for(let i = 0; i < rows.length; i++) {
                    if(rows[i].phone === Number(global.phone)) {
                        res.render('dashboard.hbs', {email:rows[i].email,name:rows[i].username});
                    }
                }
            } else {
                console.log(err);
            }
        })
    } else {
        res.redirect('/otpVerification');
    }

});

module.exports = Router;