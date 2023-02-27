const express = require('express');
const app = express();
const cors = require("cors");
const http = require('http');
const bodyParser = require("body-parser");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(cors(corsOptions));
var corsOptions = {
  origin: "*",
  corsOptions: 200
};
global.__basedir = __dirname;
app.use(bodyParser.json());
app.use(bodyParser.json({limit: '500mb'}));
app.use(bodyParser.urlencoded({limit: '500mb', extended: true}));
app.use(express.static(__dirname + "./public/icon/"));
app.use(express.static(__dirname + "./public/brandlogo/"));
app.get('/', (req, res) => {
  //sres.sendFile(__dirname + '/index.html');
});

let thisRoom = "";
io.on("connection", function (socket) {
 // console.log("connected")
  socket.on("join room", (data) => {
   // console.log("in room");
    let newUser = joinUser(socket.id, data.username, data.roomname);
    socket.emit('send data', { id: socket.id, username: newUser.username, roomName: newUser.roomname })
    thisRoom = newUser.roomname
    console.log('roomname for socket',newUser.roomname);
    socket.join(newUser.roomname)
  })

  socket.on("chat message", (data) => {
    message.create({
      room_id: data.room_id,
      message: data.message,
      result: data.result,
      status : 1
    })
      .catch((err) => {
     //   console.log(err);
      })
    const obj = {
      room_id: data.room_id,
      message: data.message,
      result: data.result,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }
   // console.log('message obj',obj)
    io.to(thisRoom).emit("chat message", obj)
  })
  socket.on("typing", (user) => {
    //    console.log("typing");
    io.to(thisRoom).emit("typing", { userName: user });
  });
  //new update
  socket.on("stoptyping", (user) => {
    io.to(thisRoom).emit("stoptyping", { userName: user });
  });
})
let db = require("./app/models/");
db.sequelize.sync();






require("./app/routes/routes")(app);

app.get('/h1', (req, res) => {
  res.send('welcome to core web application')
});


const PORT = process.env.PORT || 8081;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});