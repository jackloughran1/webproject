const express = require('express');
const mysql = require('mysql');
const connection = require('./connectionRoute');
const router = express.Router();


//vinyl
router.get('/vinyl', (req, res) => {

  let vinylId = req.query.vinyl_id;

    // vinyl sql query for each collection 
    let read = `SELECT vinyl.vinyl_id, vinyl_name, img_path, track_name, artist_name, genre_name, year_released
                FROM vinyl
                INNER JOIN track
                ON track.vinyl_id = vinyl.vinyl_id
                INNER JOIN genre
                ON genre.genre_id = vinyl.genre_id
                INNER JOIN artist
                ON artist.artist_id = vinyl.artist_id
                WHERE vinyl.vinyl_id = ?`;

    connection.query(read, [vinylId], (err, vinyldata)=>{

        if (err) throw err

        let authentication = req.session.authen;
        
      res.render('vinyl', {vinyldata, authentication});
});
 });

 module.exports = router;