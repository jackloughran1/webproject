const express = require('express');
const connection = require('./connectionRoute');
const router = express.Router();

// get managecollections - authentication to access page
router.get('/managecollections', (req, res) => {
  let sessionobj = req.session;

  if (sessionobj.authen) {

    let userid = sessionobj.authen;
    let userauthen = `
                SELECT * 
                FROM user 
                WHERE user_id = ?;

                SELECT * 
                FROM collection 
                WHERE user_id = ?;`;
    
    connection.query(userauthen, [userid, userid], (err, rows) => {
      if (err) throw err;
      // assigning userdata to first sql query row 
      let userdata = rows[0][0];
      // seconf sql query and many rows so no specific index
      let usercollection = rows[1];
      // render manage collections and pass these varaiables
      let authenticated = req.session.authen;

      res.render('managecollections', { userdata, usercollection, authenticated });

    });

  } else {
    // render log in if not authenitcated
    res.render('login');
  }


});

// POST for the collection added
router.post('/addcollection', (req, res) => {
  let sessionobj = req.session;

  // if user is authenticated
  if (sessionobj.authen) {

    let userid = sessionobj.authen;
    let collectionname = req.body.collectionName;
    let collectiondescription = req.body.collectionDesc;
    let currentDate = new Date();

    let sqlpost = `INSERT INTO collection (user_id, collection_name, collection_desc, date_collection_added) 
                    VALUES (?, ?, ?, ?)`;

    // insert new collection into database
    connection.query(sqlpost, [userid, collectionname, collectiondescription, currentDate], (err, result) => {
      if (err) throw err;
      // redirect to the managecollections page
      res.redirect('/managecollections');
    });
  } else {
    // render log in if not authenticated
    res.render('login');
  }
});

router.post('/deletecollection', (req, res) => {
  let sessionobj = req.session;
  // if user is authenticated
  if (sessionobj.authen) {

    let userid = sessionobj.authen;
    let collectionid = req.body.collectionId;

    let sqldeletecvtable = `DELETE FROM colllection_vinyl
                        WHERE collection_id = ?;`;  
                        
    let sqldeletereviewtable = `DELETE FROM review
                                WHERE collection_id = ?`;

    let sqldeletecollectiontable = `DELETE FROM collection 
                        WHERE collection_id = ? AND user_id = ?;`;

  
    // delete collection from database
    connection.query(sqldeletecvtable, [collectionid], (err, result) => {
      if (err) throw err;
      
      connection.query(sqldeletereviewtable, [collectionid], (err, result) => {
          if (err) throw err;

      connection.query(sqldeletecollectiontable, [collectionid, userid], (err, result) => {
        if (err) throw err;

        // redirect to the managecollections page
        res.redirect('/managecollections');
      });
    });
  });

  } else {
    // render log in if not authenticated
    res.render('login');
  }

});

module.exports = router;