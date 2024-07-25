const express = require('express');
const connection = require('./connectionRoute');
const router = express.Router();

// get route browsecollections page
router.get('/browsecollections', (req, res) => {

    let sessionobj = req.session;
    let search = req.query.search;
    let userId = sessionobj.authen;

    // vinyl sql query for each collection
    let getCollectionsQuery = `SELECT collection.collection_id, date_collection_added, username, collection_name, profile_photo_url, genre_name, artist_name, 
                                COALESCE(like_counts.like_number, 0) AS like_number
                                FROM collection
                                INNER JOIN user ON user.user_id = collection.user_id
                                INNER JOIN colllection_vinyl cv ON cv.collection_id = collection.collection_id
                                INNER JOIN vinyl ON vinyl.vinyl_id = cv.vinyl_id
                                INNER JOIN artist ON artist.artist_id = vinyl.artist_id
                                INNER JOIN genre ON genre.genre_id = vinyl.genre_id
                                LEFT JOIN (
                                SELECT liked_collection.collection_id, 
                                COUNT(*) AS like_number
                                FROM user_liked_collection
                                INNER JOIN liked_collection 
                                ON user_liked_collection.liked_collection_id = liked_collection.liked_collection_id
                                GROUP BY liked_collection.collection_id)
                                AS like_counts ON collection.collection_id = like_counts.collection_id `;

    // parameter variable params to be used for search variables passing into ?
    let params = [];
    // if search is entered this will be used
    if (search) {
        // this will be the second half of search depending whether a search is entered
        getCollectionsQuery += ` WHERE artist_name LIKE ? OR genre_name LIKE ?
                        GROUP BY collection.collection_id, date_collection_added, username, collection_name, profile_photo_url;`;

        params = [`%${search}%`, `%${search}%`];

    } else {
        getCollectionsQuery += `GROUP BY collection.collection_id, date_collection_added, username, collection_name, profile_photo_url, collection.like_number;`
    }
        connection.query(getCollectionsQuery, params, (err, collectiondata) => {
            if (err) throw err;

            let authentication = req.session.authen;
            res.render('browsecollections', { collectiondata, authentication, userId });
        });
    });



router.post('/likecollection', (req, res) => {

    let sessionobj = req.session
    let collectionId = req.body.collection_id;
    let userId = sessionobj.authen;
    let sqlpost = `INSERT INTO liked_collection (liked_collection_id, collection_id)
                        VALUES (NULL , ?);
                
                        SET @liked_collection_id = LAST_INSERT_ID();
                
                        INSERT INTO user_liked_collection (user_liked_collection_id, user_id, liked_collection_id)
                        VALUES (NULL, ?, @liked_collection_id);`

    connection.query(sqlpost, [collectionId, userId], (err, rows) => {

        if (err) throw err;

        res.redirect('browsecollections');


    });


});

module.exports = router;

