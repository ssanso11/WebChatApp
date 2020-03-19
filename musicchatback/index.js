const express = require("express");
const mongoose = require("mongoose");
var routes = require("./routes/router");
const session = require("express-session");
var MongoStore = require("connect-mongo")(session);
var bodyParser = require('body-parser');
var cors = require("cors");
const cookieParser = require('cookie-parser');

require('dotenv').config({ path: 'variables.env' });
const app = express();

const port = process.env.PORT || 3001;
const whitelist = [process.env.ORIGIN, 'https://fierce-island-45554.herokuapp.com/']

 //change later possibly
app.use(cors({
  origin: function(origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },//frontend server localhost:3000
  methods:['GET','POST','PUT','DELETE'],
  credentials: true // enable set cookie
}));
//app.options('*', cors());
app.use(cookieParser(process.env.SESSION_SECRET));


console.log('===== Connecting to DB ... =====', process.env.MONGODB_URI);
mongoose.connect(process.env.MONGODB_URI || process.env.MONGODB_URL, {
  useNewUrlParser: true,
});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
  console.log("Yayyy");
});

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    cookie: { 
      maxAge:36000,
      httpOnly:false,
      secure: false 
    },
    store: new MongoStore({
      mongooseConnection: db
    })
}));

// app.use(function(req, res, next) {
//   res.header('Access-Control-Allow-Credentials', "true");
//   res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
//   res.header("Access-Control-Allow-Origin", process.env.ORIGIN);
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-   Type, Accept, Authorization");
//   next();
// });
  // parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
  
  
  // serve static files from template

app.use("/", routes);
app.use(function (req, res, next) {
    var err = new Error('File Not Found');
    err.status = 404;
    next(err);
});
  
  // error handler
  // define as the last app.use callback
app.use(function (err, req, res, next) {
    return res.send(err.message);
});

app.listen(port, () => {console.log(`Listening on port ${port}...`)});