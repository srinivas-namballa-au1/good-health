'use strict';

const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const dotenv = require('dotenv');
var mysql = require('mysql');

dotenv.config();

var userLogin = require('./routes/authentication/userLogin.js');
var phoneLogin = require('./routes/authentication/phoneLogin.js');
var otpVerification = require('./routes/authentication/otpVerification.js');

const bcrypt = require('bcrypt');
const saltRounds = 10;

var app = express();

// app settings
app.set("view engine", ".hbs");
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({secret: "marskey" }));

// serve static files
app.use(express.static('public'));

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'good-health'
})

connection.connect((err) => {
    if(!err) {
        var values = [
            ['Srinivas', 'srinu123', 'namballasrinivas902@gmail.com', '9441464121'],
            ['Srinivas Namballa', 'srinu223', 'namballasrinivas920@gmail.com', '8919022733'],
            ['Hannah', 'hannah1234', 'hannah@gmail.com', '45678857645'],
            ['Michael', 'michael1234', 'michael@gmail.com', '875987778777'],
            ['Sandy', 'sandy1234', 'sandy@gmail.com', '98748838471']
        ];
        
        for(let i = 0; i < values.length; i++) {
            let password = values[i][1];
                bcrypt.hash(password, saltRounds, function(err, hash) {
                    if(!err) {
                        values[i][1] = hash;
                        var sql = "INSERT INTO users (`username`, `password`, `email`, `phone`) VALUES ('"+values[i][0]+"', '"+values[i][1]+"', '"+values[i][2]+"', '"+values[i][3]+"')";
                        connection.query(sql, function (err, result) {
                            if (err) throw err;
                            console.log("1 record inserted");
                        });
                    } else {
                        console.log(err);
                    }
                });
        }
    } else {
        console.log(err);
    }
});

app.use('/', userLogin);
app.use('/phoneLogin', phoneLogin);
app.use('/otpVerification', otpVerification);

app.listen(3000, () => console.log('app running on port 3000'));