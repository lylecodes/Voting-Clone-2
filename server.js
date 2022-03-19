const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

require("dotenv").config();

const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Photo = require("./models/Photos");
const User = require("./models/Users");
const app_routes = require("./routes/app_routes");
const candidate_routes = require("./routes/candidate_routes");

const { auth } = require("express-openid-connect");

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET,
  baseURL: "http://localhost:3000",
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: process.env.AUTH0_ISSUER_URL,
};

app.use(auth(config));

const connectionStr = process.env.MONGO_CONNECTION;

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "/public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/", app_routes);
app.use("/candidate", candidate_routes);
// app.use(cors());

mongoose
  .connect(connectionStr, { useNewUrlParser: true })
  .then(console.log("Mongo connected"))
  .catch((err) => console.log(err));

server.listen(3000, () => {
  console.log("listening on 3000");
});

io.on("connection", (socket) => {
  console.log("socket connection established");
  socket.on("vote-to-server", (data) => {
    socket.broadcast.emit("vote-to-client", data);
  });
});

app.get("/profile", async (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});

app.put("/vote", async (req, res) => {
  const userEmail = req.oidc.user.email;
  const photoId = parseInt(req.body.id);
  const query = { id: photoId };

  try {
    await Photo.findOneAndUpdate(query, {
      $inc: {
        votes: 1,
      },
    });

    await User.findOneAndUpdate(
      { email: userEmail },
      {
        $set: {
          photoVoteId: photoId,
        },
      }
    );
    res.json("Photo vote id added to user");
  } catch (error) {
    console.error(error);
  }
});
