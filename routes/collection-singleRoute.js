const express = require('express');
const connection = require('./connectionRoute');
const router = express.Router();

// get route collection-single
router.get('/collection-single', (req, res) => {

    let collectionId = req.query.collection_id;
    let getrow =        `SELECT collection.collection_id, collection.collection_name, artist.artist_name, genre.genre_name, img_path, year_released, vinyl.vinyl_name, vinyl.vinyl_id 
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

                         SELECT collection_name
                         FROM collection
                         WHERE collection_id = ?;
                         
                         SELECT review_title, review_desc, review_timestamp, username
                         FROM review 
                         INNER JOIN user
                         ON review.user_id = user.user_id
                         WHERE review.collection_id = ?`;

    connection.query(getrow, [collectionId, collectionId, collectionId], (err, row) => {

        if (err) throw err

        // accesses the firs t result set
        let collectiondetails = row[0];
        let collectionname = row[1].collection_name;
        let reviews = row[2];
        let authentication = req.session.authen;

        res.render('collection-single', { collectionname, collectiondetails, reviews, authentication });

    });
});

router.post('/addreview', (req, res) => {
    let sessionobj = req.session;
  
    if (sessionobj.authen) {
      let reviewtitle = req.body.reviewtitle;
      let reviewdesc = req.body.reviewdesc;
      let collection_id = req.body.collection_id;
      let user_id = sessionobj.authen;
      let review_timestamp = new Date();
      let sqlpost = `INSERT INTO review (collection_id, review_desc, review_timestamp, review_title, user_id) 
                      VALUES (?, ?, ?, ?, ?)`;
  
      connection.query(sqlpost, [collection_id, reviewdesc, review_timestamp, reviewtitle, user_id], (err, result) => {
        if (err) throw err;
        res.redirect(`/collection-single?collection_id=${collection_id}`);
      });
    } else {
      res.render('login');
    }
  });
  

module.exports = router;