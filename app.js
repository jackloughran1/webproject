// imports
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');


// route handlers
const globalErrHandler = require('./middleware/errorHandler');
const indexRoute = require('./routes/indexRoute');
const loginRoute = require('./routes/loginRoute');
const connectionRoute = require('./routes/connectionRoute');
const signupRoute = require('./routes/signupRoute');
const managecollectionsRoute = require('./routes/managecollectionsRoute');
const browsecollectionsRoute = require('./routes/browsecollectionsRoute');
const collectionsingleRoute = require('./routes/collection-singleRoute');
const vinylRoute = require('./routes/vinylRoute');
const addingvinylsRoute = require('./routes/addingvinylsRoute');
const addingtracksRoute = require('./routes/addingtracksRoute');
const logoutRoute = require('./routes/logoutRoute');
const browsevinylsRoute = require('./routes/browsevinylsRoute');

// sessions
const sessions = require('express-session');
const oneHour = 1000 * 60 * 60 * 1;



app.use(sessions({
   secret: "password",
   saveUninitialized: true,
   cookie: { maxAge: oneHour },
   resave: false
}));



// sessions end

// middleware
app.set('view engine', 'ejs');
app.use(cookieParser());


const path = require('path');
app.use(express.static(path.join(__dirname, './public')));
app.use(express.urlencoded({extended: true})); 

// middleware routes
app.use('/', indexRoute);
app.use('/', loginRoute);
app.use('/', signupRoute);
app.use('/', managecollectionsRoute);
app.use('/', browsecollectionsRoute);
app.use('/', collectionsingleRoute);
app.use('/', vinylRoute);
app.use('/', addingvinylsRoute);
app.use('/', addingtracksRoute);
app.use('/', logoutRoute);
app.use('/', browsevinylsRoute);

// middleware for errors
app.use(globalErrHandler);




// server 
app.listen(process.env.PORT || 3000);
console.log(" Server is listening on http://localhost:3000/ ");