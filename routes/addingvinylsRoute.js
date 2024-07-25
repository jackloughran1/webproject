const express = require('express');
const connection = require('./connectionRoute');
const router = express.Router();

//get route addingvinylform
router.get('/addingvinylsform', (req, res) => {
  let sessionobj = req.session;
  // if user is authenticated
  if (sessionobj.authen) {

    let getid = req.query.collection_id;
    let getrow = `SELECT collection.collection_id, collection.collection_name, artist_name, genre_name, img_path, year_released, vinyl_name, vinyl.vinyl_id 
                 FROM collection 
                 INNER JOIN colllection_vinyl 
                 ON collection.collection_id = colllection_vinyl.collection_id
                 INNER JOIN vinyl
                 ON vinyl.vinyl_id = colllection_vinyl.vinyl_id
                 INNER JOIN genre
                 ON genre.genre_id = vinyl.genre_id
                 INNER JOIN artist
                 ON artist.artist_id = vinyl.artist_id
                 WHERE collection.collection_id = ?;

                 SELECT *
                 FROM collection
                 WHERE collection_id = ?;
                 
                 SELECT * 
                 FROM genre;`;

    connection.query(getrow, [getid, getid], (err, row) => {
      if (err) throw err;

      // accesses the first result set
      let collectiondetails = row[0];
      // access to the second result set and first column - collection_name
      let collectionname = row[1][0];
      let genrename = row[2];
      let authenticated = req.session.authen;


      res.render('addingvinylsform', { collectionname, collectiondetails, genrename, collectionId: getid, authenticated });

    });
  } else {
    // render log in if not authenticated
    res.render('login');
  }
});

// POST for the vinyl added
router.post('/addvinyl', (req, res) => {
  let sessionobj = req.session;
  // if user is authenticated
  if (sessionobj.authen) {

    let artist = req.body.vinylartist;
    let genre = req.body.genre;
    let vinylname = req.body.vinylname;
    let dateadded = new Date();
    let url = req.body.vinylurl;
    let year_released = req.body.yearreleased;

    let collectionId = req.body.collectionId;


    let sqlpost = `INSERT INTO artist (artist_name) VALUES (?);
                SET @artist_id = LAST_INSERT_ID();
                SET @genre_id = (SELECT genre_id FROM genre WHERE genre_name = ?);
                INSERT INTO vinyl (genre_id, artist_id, vinyl_name, date_vinyl_added, img_path, year_released) 
                VALUES (@genre_id, @artist_id, ?, ?, ?, ?);
                SET @vinyl_id = LAST_INSERT_ID();
                INSERT INTO colllection_vinyl (collection_id, vinyl_id) 
                VALUES (?, @vinyl_id);`;



    // insert new vinyl and its association to the collection into database
    connection.query(sqlpost, [artist, genre, vinylname, dateadded, url, year_released, collectionId], (err, result) => {
      if (err) throw err;


      // redirect to the addingvinyls page
      res.redirect(`/addingvinylsform?collection_id=${collectionId}`);
    });
  } else {
    // render log in if not authenticated
    res.render('login');
  }
});

router.post('/deletevinyl', (req, res) => {
  let sessionobj = req.session;
  // if user is authenticated
  if (sessionobj.authen) {

    let vinylId = req.body.vinylId;
    let collectionId = req.body.collectionId;
    let sqldelete = `DELETE FROM colllection_vinyl 
                     WHERE vinyl_id = ?;
                     DELETE FROM track
                     WHERE vinyl_id = ?;
                     DELETE FROM vinyl 
                     WHERE vinyl_id = ?;`;

    // delete vinyl from database
    connection.query(sqldelete, [vinylId, vinylId, vinylId], (err, result) => {
      if (err) throw err;



      // redirect to the addingvinyls page
      res.redirect(`/addingvinylsform?collection_id=${collectionId}`);
    });
  } else {
    // render log in if not authenticated
    res.render('login');
  }
});
module.exports = router;