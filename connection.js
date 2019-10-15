var mysql = require('mysql');

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'good-health'
})

connection.connect((err) => {
    if(!err) {
        console.log("connected :)");
        
    } else {
        console.log("Failed to connect :(", err);
    }
});

module.exports = connection;