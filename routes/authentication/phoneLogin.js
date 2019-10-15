var express = require('express');
var Router = express.Router();
var connection = require('../../connection.js');
var bcrypt = require('bcrypt');
var twilio = require('twilio');
var otpGenerator = require('otp-generator');

var app = express();

Router.use(express.urlencoded({extended: false}));

Router.use(express.static("public"));

Router.get('/', (req, res) => {
    res.render('phoneLogin.hbs');
});

Router.post('/', (req, res) => {
    connection.query('SELECT * FROM users', (err, rows, field) => {
        if(!err) {
            for(let i = 0; i < rows.length; i++) {
                if(rows[i].phone === Number(req.body.phone)) {
                    var otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });
                    const accountSid = process.env.ACCOUNT_SID;
                    const authToken = process.env.AUTH_TOKEN;
                    const client = new twilio(accountSid, authToken);

                    client.messages.create({
                        body: `${otp} is your one time password`,
                        to: '+918919022733',  // Text this number
                        from: '+18126754732' // From a valid Twilio number
                    })
                    .then((message) => console.log(message))
                    global.otp = otp;
                    global.phone = req.body.phone;
                    res.render('otpVerification.hbs');
                }
            }
        } else {
            console.log(err);
        }
    })

});

module.exports = Router;