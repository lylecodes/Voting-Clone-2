const express = require("express");
const router = express.Router();
const User = require("../models/Users");
const Photo = require("../models/Photos");
const { requiresAuth } = require("express-openid-connect");

router.get("/", requiresAuth(), async (req, res) => {
  const userInfoAuth0 = req.oidc.user;
  const userMongo = await User.findOne({ email: userInfoAuth0.email });

  let user = null;

  if (!userMongo) {
    user = new User({
      email: userInfoAuth0.email,
    });

    user.save((err, result) => {
      if (err) console.log(err);
      else {
        console.log("saved user");
      }
    });
  }

  if (user == null) user = userMongo;

  Photo.find({})
    .then((data) => {
      res.render("index", {
        user: user,
        photoInfos: data,
        dateRegistered: user.date,
      });
    })
    .catch((err) => console.error(err));
});

router.get("/vote/:userId/:photoId", requiresAuth(), (req, res) => {
  const userId = req.params.userId;
  const photoId = req.params.photoId;

  Photo.findByIdAndUpdate(
    { _id: photoId },
    { $inc: { votes: 1 } },
    { new: true },
    (err) => {
      if (err) console.error(err);
    }
  );

  User.findByIdAndUpdate(
    { _id: userId },
    { $set: { photo: photoId } },
    (err) => {
      if (err) console.error(err);
    }
  );

  res.redirect("/");
});

module.exports = router;
