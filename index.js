'use strict';

var express = require("express");
var mysql = require('mysql');
var bodyParser = require("body-parser");
var session = require("express-session");
var twilio = require('twilio');

const bcrypt = require('bcrypt');
const saltRounds = 10;

var userLogin = require("./routes/authentication/userLogin.js");

var app = express();

// app settings
app.set("view engine", "hbs");
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
        console.log("connected :)");
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
                        var sql = "INSERT INTO users (`username`, `password`, `email`, `contact number`) VALUES ('"+values[i][0]+"', '"+values[i][1]+"', '"+values[i][2]+"', '"+values[i][3]+"')";
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
        console.log("Failed to connect :(", err);
    }
});


// Download the helper library from https://www.twilio.com/docs/node/install
// Your Account Sid and Auth Token from twilio.com/console
// DANGER! This is insecure. See http://twil.io/secure
const accountSid = 'AC34c32b2b88459b3e78c128e285893a43';
const authToken = '9f69f98dc710ddc0970f2235434c5a52';
const client = new twilio(accountSid, authToken);

client.messages.create({
    body: 'Hello from Node',
    to: '+918919022733',  // Text this number
    from: '+18126754732' // From a valid Twilio number
})
.then((message) => console.log(message))


app.get("/", (req, res) => {
    res.render('userLogin.hbs');
});

app.get("/userSignup", (req, res) => {
    res.render('userSignup.hbs');
});

app.get("/phoneLogin", (req, res) => {
    res.render('phoneLogin.hbs');
});
app.post("/", indexPage.postData);

app.get("/userLogin", userLogin.getData);
app.post("/userLogin", userLogin.postData);

app.get("/userLogout", userLogin.logout);

console.log('app running!');

app.listen(3000);