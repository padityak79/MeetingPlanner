const mysql = require('mysql');

const db = mysql.createPool({
    host : "localhost",
    user : "root",
    password : "password",
    database : "meetingscheduler"
});

module.exports = db;