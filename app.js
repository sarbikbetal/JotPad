const express = require('express');
const exphbs  = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const path = require('path');
const passport = require('passport');

const app = express();

//Load Routes
const todo = require('./routes/todo');
const user = require('./routes/user');

//Load Passport
require('./config/passport')(passport)

// DB Config
const db = require('./config/database')

//Mongoose Connection
mongoose.Promise = global.Promise;

mongoose.connect(db.mongoURI,{
    useNewUrlParser: true
})
.then(()=> console.log('MongoDB Connected...'))
.catch(err => console.log(err));


//Handlebars Middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Boody Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static Folder
app.use(express.static(path.join(__dirname, "public")));


// Method Override
app.use(methodOverride('_method'));

// Express sessions
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Passport sessions middleware
app.use(passport.initialize());
app.use(passport.session());


app.use(flash());

// Global Variables
app.use(function(req, res, next){
    res.locals.s_msg = req.flash('s_msg');
    res.locals.e_msg = req.flash('e_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});



//Index Route
app.get('/', (req, res)=>{
    const title = "Welcome hey";
    res.render('index', {
        title: title
    });
});

//About Route
app.get('/about', (req, res)=>{
    res.render('about');
});




// Use Routes
app.use('/todo', todo);
app.use('/user', user);


//Server Init
const port = process.env.PORT || 5000;

app.listen(port, ()=>{
    console.log(`Server started on port ${port}`);
});