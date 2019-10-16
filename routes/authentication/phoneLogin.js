var express = require('express');
var Router = express.Router();
var connection = require('../../connection.js');
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
                    const accountSid = 'AC34c32b2b88459b3e78c128e285893a43';
                    const authToken = '9f69f98dc710ddc0970f2235434c5a52';
                    const client = new twilio(accountSid, authToken);

                    client.messages.create({
                        body: `${otp} is your one time password`,
                        to: '+918919022733',  // Text this number
                        from: '+18126754732' // From a valid Twilio number
                    })
                    .then((message) => console.log(message))
                    console.log(otp);
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