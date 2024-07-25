const express = require('express');
const mysql = require('mysql');

// database set up
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'stackofwax',
    port: '3306',
    multipleStatements: true

});

// connection confirmation
connection.connect((err, mysql)=>{

    if(!err){
        console.log("Database is connected");
    } else {
        console.log("Error while connecting with database");
    }

});

module.exports = connection;