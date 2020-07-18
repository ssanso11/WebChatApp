const express = require("express");
const mongoose = require("mongoose");
var routes = require("./routes/router");
var fetchRouter = require("./routes/fetchRouter");
var uploadRouter = require("./routes/uploadRouter");
var addRouter = require("./routes/addRouter");
var modifyRouter = require("./routes/modifyRouter");
const session = require("express-session");
var MongoStore = require("connect-mongo")(session);
var bodyParser = require("body-parser");
var cors = require("cors");
const cookieParser = require("cookie-parser");
var cookieSession = require("cookie-session");

require("dotenv").config({ path: "variables.env" });
const app = express();

const port = process.env.PORT || 3001;
const whitelist = [
  process.env.ORIGIN,
  "https://fierce-island-45554.herokuapp.com/",
];

//change later possibly
app.use(
  cors({
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    }, //frontend server localhost:3000
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // enable set cookie
  })
);
//app.options('*', cors());
app.use(cookieParser(process.env.SESSION_SECRET));

console.log("===== Connecting to DB ... =====", process.env.MONGODB_URL);
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);
mongoose.connect(process.env.MONGODB_URI || process.env.MONGODB_URL, {
  useNewUrlParser: true,
});
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  // we're connected!
  console.log("Yayyy");
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    cookie: {
      maxAge: 999999999,
      httpOnly: false,
      secure: false,
    },
    store: new MongoStore({
      mongooseConnection: db,
    }),
  })
);

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// serve static files from template

app.use("/", routes);
app.use("/get", fetchRouter);
app.use("/upload", uploadRouter);
app.use("/add", addRouter);
app.use("/modify", modifyRouter);

app.use(function (req, res, next) {
  var err = new Error("File Not Found");
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
  return res.send(err.message);
});

var server = app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
var io = require("socket.io")(server);

io.sockets.on("connection", function (socket) {
  console.log("We have a new client: " + socket.id);
  socket.on("mouseDown", function (data) {
    console.log("Received: 'mouseDown' " + JSON.stringify(data));

    socket.broadcast.emit("mouseDown", data);
  });
  socket.on("mouseMoved", function (data) {
    console.log("Received: 'mouseMoved' " + JSON.stringify(data));

    socket.broadcast.emit("mouseMoved", data);

    // This is a way to send to everyone including sender
    // io.sockets.emit('message', "this goes to everyone");
  });

  socket.on("disconnect", function () {
    console.log("Client has disconnected");
  });
});
