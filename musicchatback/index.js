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
var Call = require("./models/Call");

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
//will an array be good for this??
clients = [];
io.sockets.on("connection", function (socket) {
  console.log("We have a new client: " + socket.id);
  socket.on("storeClientInfo", function (socketData) {
    //store userId and respective socket.id to array
    console.log(socketData.userId);
    var clientInfo = new Object();
    clientInfo.userId = socketData.userId;
    clientInfo.socketId = socket.id;
    clients.push(clientInfo);
  });
  socket.on("subscribe/calls", function (socketData) {
    console.log("change stream started");
    //pipeline to filter data
    const pipeline = [{ $match: { "fullDocument.to_id": socketData.userId } }];
    Call.watch(pipeline).on("change", (data) => {
      //somehow we have to push data to "to_id"
      console.log("new call for a user...");
      for (var i in clients) {
        if (clients[i].userId == socketData.userId) {
          console.log(clients[i].socketId);
          io.to(clients[i].socketId).emit("subscribe/calls", data.fullDocument);
        }
      }
    });
  });
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

  socket.on("disconnect", function (data) {
    for (var i = 0, len = clients.length; i < len; ++i) {
      var c = clients[i];
      if (c.userId == socket.id) {
        clients.splice(i, 1);
        break;
      }
    }
  });
});
