const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { requiresAuth } = require("express-openid-connect");
const Photo = require("../models/Photos");

router.get("/", requiresAuth(), (req, res) => {
  res.send("candidates");
});

router.get("/create", requiresAuth(), (req, res) => {
  res.render("create");
});

router.post("/create", requiresAuth(), (req, res) => {
  const name = req.body.name;
  const url = req.body.url;

  const candidate = new Photo({
    name: name,
    srcUrl: url,
  });

  candidate.save((err, result) => {
    if (err) console.error(err);
    else {
      console.log("saved photo");
    }
  });

  res.redirect("/");
});

router.get("/delete/:id", requiresAuth(), (req, res) => {
  const photoId = req.params.id;
  console.log(photoId);

  Photo.findById({ photoId }).then((result) => {
    res.render("/delete");
  });
  res.redirect("/");
});

module.exports = router;
