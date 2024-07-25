const express = require('express');
const connection = require('./connectionRoute');
const router = express.Router();

//get route addingcollectionform
router.get('/addingtracksform', (req, res) => {

    let getid = req.query.vinyl_id;
    let sql = `SELECT vinyl.vinyl_name, vinyl.img_path, vinyl.year_released, genre_name, artist_name
                FROM vinyl
                INNER JOIN genre
                ON genre.genre_id = vinyl.genre_id
                INNER JOIN artist
                ON artist.artist_id = vinyl.artist_id
                WHERE vinyl.vinyl_id = ?;
                
                SELECT *
                FROM track
                INNER JOIN vinyl
                ON vinyl.vinyl_id = track.vinyl_id
                WHERE vinyl.vinyl_id = ?`;

    connection.query(sql, [getid, getid], (err, row) => {
        if (err) throw err;

        let vinyldetails = row[0][0];

        let tracks = row[1];

        let authentication = req.session.authen;




        res.render('addingtracksform', { vinyldetails, tracks, vinylId: getid, authentication });
    });

});

// POST for the vinyl added
router.post('/addtrack', (req, res) => {
    let sessionobj = req.session;
    // if user is authenticated
    if (sessionobj.authen) {

        let trackname = req.body.track_name;
        let vinylId = req.body.vinylId;

        let sqlpost = `INSERT INTO track (track_name, vinyl_id)
                        VALUES (?,?);`;


        connection.query(sqlpost, [trackname, vinylId], (err, result) => {
            if (err) throw err;

            // redirect to the addingtracks page
            res.redirect(`/addingtracksform?vinyl_id=${vinylId}`);
        });
    } else {
        // render log in if not authenticated
        res.render('login');
    }
});

router.post('/deletetrack', (req, res) => {
    let sessionobj = req.session;
    // if user is authenticated
    if (sessionobj.authen) {

        let vinylId = req.body.vinylId;
        let trackId = req.body.trackId;

        let sqldelete = `DELETE FROM track
                       WHERE track_id = ?;`;

        // delete vinyl from database
        connection.query(sqldelete, [trackId], (err, result) => {
            if (err) throw err;

            // redirect to the addingvinyls page
            res.redirect(`/addingtracksform?vinyl_id=${vinylId}`);
        });
    } else {
        // render log in if not authenticated
        res.render('login');
    }
});

module.exports = router;