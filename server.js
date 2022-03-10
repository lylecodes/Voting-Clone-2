const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

io.on("connection", (socket) => {
  console.log("socket connection established");
  socket.on("vote-to-server", (data) => {
    console.log("received vote from client");
    socket.broadcast.emit("vote-to-client", data);
  });
});

server.listen(3000, () => {
  console.log("listening on 3000");
});

const connectionStr =
  "mongodb+srv://lyle:lyle@cluster0.qyxxa.mongodb.net/star-wars?retryWrites=true&w=majority";
MongoClient.connect(connectionStr).then((client) => {
  console.log("connected to database");

  const db = client.db("voting-clone");
  const photosCollection = db.collection("photos");

  app.get("/", (req, res) => {
    photosCollection
      .find()
      .toArray()
      .then((data) => {
        let totalVotes = getTotalVotes(data);

        res.render("index.ejs", { photoInfos: data, votes: totalVotes });
      });
  });

  app.put("/photos", (req, res) => {
    const id = parseInt(req.body.id);

    photosCollection
      .findOneAndUpdate(
        { id: id },
        {
          $inc: {
            votes: 1,
          },
        },
        { upsert: false }
      )
      .then((result) => {
        return res.json("success");
      })
      .catch((err) => console.error(err));
  });
});

const getTotalVotes = (data) => {
  let total = 0;

  data.map((obj) => {
    total += obj.votes;
  });
  return total;
};
