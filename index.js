const express = require('express');
//const cookieParser = require('cookie-parser'); - used for manual auth
const app = express();
const port = 8000;
//importing ejs layout
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
//express session is used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
//mongoStore is used to store session cookie in the database so that each time server restarts the cookies aren't deleted
const MongoStore = require('connect-mongo')(session);

const sassMiddleware = require('node-sass-middleware');

app.use(sassMiddleware({
    src: './assets/scss',
    dest: './assets/css',
    debug: true,
    outputStyle: "expanded",
    prefix: '/css'
}));

//to get the form data submitted by the user in the body of the request
app.use(express.urlencoded({ extended: true })); 
//app.use(cookieParser()); - this is used in case of manual authentication
//include the static files - this should be before even defining the layouts as it would be used there
app.use(express.static('assets'));

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
    secret:'lsdfjlskdjflskdf',
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

//routes should be defined after passport middleware is defined
app.use('/',require('./routes'));


app.listen(port,function(err){
    if(err){
        console.log(`Error in runnings the server: ${err}`);
    }
    console.log(`Server is running on port: ${port}`);
});