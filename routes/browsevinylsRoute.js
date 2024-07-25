const express = require('express');
const connection = require('./connectionRoute');
const router = express.Router();

router.get('/browsevinyls', (req, res) => {
    let authentication = req.session.authen;
    let filter = req.query.filter || 'allvinyls';
    let sql = `SELECT vinyl_id, vinyl_name, genre_name, artist_name, img_path
                FROM vinyl
                INNER JOIN genre 
                ON genre.genre_id = vinyl.genre_id
                INNER JOIN artist
                ON artist.artist_id = vinyl.artist_id`;

    if (filter === 'genre') {
        sql += ' ORDER BY genre_name';
    } else if (filter === 'artist') {
        sql += ' ORDER BY artist_name';
    }
    connection.query(sql, (err, row) => {
        if (err) throw err;
        let vinyldata = row;
        res.render('browsevinyls', {authentication, vinyldata, filter}); // pass filter value to the template
    });
});

module.exports = router;