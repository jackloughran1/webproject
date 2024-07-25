const express = require('express');
const bcrypt = require('bcrypt');
const connection = require('./connectionRoute');
const router = express.Router();


// get route login page
router.get('/login', (req, res) => {
    // render login
    res.render('login')
});


// login post authentication
router.post('/login', (req, res) => {

    let useremail = req.body.emailField;
    let userpassword = req.body.passwordField;

    let checkuserlogin = `SELECT * 
                    FROM user 
                    WHERE email = ?;`;


    
    connection.query(checkuserlogin, [useremail], (err, rows) => {
        
        if (err) throw err;
        let numRows = rows.length;
        // if user exists, start a session
        if (numRows > 0) {

            bcrypt.compare(userpassword, rows[0].password, (err, result) =>{
                if (result) {

            let sessionobj = req.session;
            sessionobj.authen = rows[0].user_id;
            res.redirect('/managecollections');
        } else {
            res.send('Incorrect Email Or Password, Please Try Again');
        }
     });
    
    } else {
        res.send('Incorrect Email Or Password, Please Try Again');
    }

    });
});

module.exports = router;