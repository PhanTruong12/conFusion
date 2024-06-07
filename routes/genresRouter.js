const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const genres = require("../models/genres");

const genresRouter = express.Router();
genresRouter.use(bodyParser.json());

genresRouter
  .route("/")
  .get((req, res, next) => {
    let filter = {};
    if (req.query.category) {
      filter.category = req.query.category;
    }

    genres
      .find(filter)
      .then(
        (genres) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(genres);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    genres
      .create(req.body)
      .then(
        (genres) => {
          console.log("genres Created ", genres);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(genres);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /genres");
  })
  .delete((req, res, next) => {
    genres
      .deleteMany({})
      .then(
        (resp) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.send("sach da bi xoa");
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

genresRouter
  .route("/:genresId")
  .get((req, res, next) => {
    genres.findById(req.params.genresId)
      .then(
        (genres) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(genres);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    res.statusCode = 403;
    res.end("POST operation not supported on /genres/" + req.params.genresId);
  })
  .put((req, res, next) => {
    genres.findByIdAndUpdate(
      req.params.genresId,
      {
        $set: req.body,
      },
      { new: true }
    )
      .then(
        (genres) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(genres);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .delete((req, res, next) => {
    genres.findByIdAndDelete(req.params.genresId)
      .then(
        (resp) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.send('Delete Successfully');
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });
module.exports = genresRouter;