const express = require('express');
const bcrypt = require('bcrypt');
const connection = require('./connectionRoute');
const router = express.Router();
const saltRounds = 10;


// get route signup page
router.get('/signup', (req, res) => {
    // render signup page
    res.render('signup')
});


// POST route which handles the form from the signup.ejs page
router.post('/signup', (req, res) => {

    let signupFirstName = req.body.firstNameField;
    let signupLastName = req.body.lastNameField;
    let signupUserName = req.body.userNameField;
    let signupEmail = req.body.emailField;
    let signupPassword = req.body.passwordField;
    let profileURL = req.body.profilePhotoURL;
    let currentDate = new Date();


    bcrypt.hash(signupPassword, saltRounds, (err, hash) =>{
        
        if (err) throw err;
    


    let insertsql = `INSERT INTO user (username, email, password, first_name, last_name, date_account_created, profile_photo_url)
                    VALUES (?, ?, ?, ?, ?, ?, ?);`;

    connection.query(insertsql, [signupUserName, signupEmail, hash, signupFirstName, signupLastName, currentDate, profileURL], (err, result) => {

        if (err) throw err

        res.redirect('/login');

    });
});
});

module.exports = router;
