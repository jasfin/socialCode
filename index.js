const express = require('express');
const properties = require('./config/properties');
const path = require('path');
const LOGGER = require('morgan');
const cookieParser = require('cookie-parser'); //- used for manual auth
const app = express();
const port = 8000;
require('./config/view-helper')(app);
//importing ejs layout
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
//express session is used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
//for using jwt strategy
const passportJwt = require('./config/passport-jwt-strategy');
//mongoStore is used to store session cookie in the database so that each time server restarts the cookies aren't deleted
const MongoStore = require('connect-mongo')(session);

const sassMiddleware = require('node-sass-middleware');
const connectFlash = require('connect-flash');
const customFlashMiddleware = require('./config/flashMiddleware');

//for testing CORS error - Not reqd
const cors = require('cors');
app.use(cors());

//here we are setting up the chat server which is to be used in socket.io
const httpServerForChat = require('http').createServer(app);
const chatSocket = require('./config/chat_socket_BE').chatSocket(httpServerForChat);
httpServerForChat.listen(5000);

if(properties.name == 'DEV_ENV'){ 
    console.log('inside dev env');
    app.use(sassMiddleware({
        src:  path.join(__dirname, properties.assets_path, 'scss'),//'./assets/scss',
        dest: path.join(__dirname, properties.assets_path, 'css'),//'./assets/css',
        debug: true,
        outputStyle: "expanded",
        prefix: '/css'
    }));
}


//to get the form data submitted by the user in the body of the request
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser()); //- this is used in case of manual authentication
//include the static files - this should be before even defining the layouts as it would be used there
app.use(express.static(path.join(__dirname, properties.assets_path)));
//below middleware is to make the uploads directory path to be available at /uploads, to ejs for renderning to browser
app.use('/uploads', express.static('./uploads'));

//including the log just b4 routing
app.use(LOGGER(properties.morgan.mode,properties.morgan.options));

//before any routing happens tell the app to use the layout
app.use(expressLayouts);

//when some page with css or js is supplied to the layout, those css or js supplied must be extracted
//and put in the layout when that page is rendered to the browser, ie; include the <link ..> tag 
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);

//setup the view engine
app.set('view engine','ejs'); 
app.set('views','./views'); //path.join(__dirname,'views')

app.use(session({
    name: 'socialCode',
    //should change the secret key later
    secret: properties.session_cookie_key,
    saveUninitialized: false,
    resave:false,
    cookie: {
        maxAge: (6000*1000)
    },
    store: new MongoStore( //define mongo store and connect mongoStore to mongoDb we have configured
        {
            mongooseConnection: db,
            autoRemove: 'disabled'

        },
        function(err){
            console.log(err || 'connection to mongoStore is okay');
        }
    )

}));

//tell the app to use passport
app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

//after session we are using connect-flash as we have to store flash messages in the session
app.use(connectFlash());
//we have put this custom middleware after flash so as to set the res.locals.flash from the request-req.flash, that we set in the controller
app.use(customFlashMiddleware.setFlash);

//routes should be defined after passport middleware is defined
app.use('/',require('./routes'));


app.listen(port,function(err){
    if(err){
        console.log(`Error in runnings the server: ${err}`);
    }
    console.log(`Server is running on port: ${port}`);
});