const express = require('express');
const router = express.Router();

// get route index page
router.get('/', (req, res) => {

    let sessionobj = req.session;
    let authenticated = sessionobj.authen;

    // render index
    res.render('index', {authenticated});
});


module.exports = router;