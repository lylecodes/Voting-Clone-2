const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const connectionStr =
  "mongodb+srv://lyle:lyle@cluster0.qyxxa.mongodb.net/star-wars?retryWrites=true&w=majority";
MongoClient.connect(connectionStr).then((client) => {
  console.log("connected to database");
  const db = client.db("voting-clone");
  const photosCollection = db.collection("photos");
  //schema
  app.listen(3000, () => {
    console.log("listening on 3000");
  });

  app.get("/", (req, res) => {
    photosCollection
      .find()
      .toArray()
      .then((data) => {
        res.render("index.ejs", { photoInfos: data });
      });
  });

  app.put("/photos", (req, res) => {
    const id = parseInt(req.body.id);
    const votes = parseInt(req.body.votes);

    photosCollection
      .findOneAndUpdate(
        { id: id },
        {
          $set: {
            votes: votes,
          },
        },
        { upsert: false }
      )
      .then((result) => {
        res.json("Success");
        console.log(id);
        console.log(votes);
      })
      .catch((err) => console.error(err));
  });
});
