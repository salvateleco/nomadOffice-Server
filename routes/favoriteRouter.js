var express = require('express');
var bodyParser = require('body-parser');

var Favorites = require('../models/favorites');
var Verify = require('./verify');

var favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.all(Verify.verifyOrdinaryUser)

.get(function (req, res, next) {
    var userId = req.decoded._id;
    Favorites.findOne({postedBy: userId})
    .populate('postedBy places')
    .exec(function (err, favorite) {
      if (err) return next(err);
      res.json(favorite);
    });
})

.post(function (req, res, next) {
    var userId = req.decoded._id;
    Favorites.findOneAndUpdate(
      {postedBy: userId},
      {$addToSet: {places: req.body}},
      {upsert: true,  new: true}, function (err, favorite) {
        if (err) return next(err);
        res.json(favorite);
    });
})

.delete(function (req, res, next) {
    var userId = req.decoded._id;
    Favorites.findOneAndRemove(
      {postedBy: userId}, function (err, resp) {
        if (err) return next(err);
        res.json(resp);
    });
});

favoriteRouter.route('/:placeId')
.all(Verify.verifyOrdinaryUser)

.delete(function (req, res, next) {
    var userId = req.decoded._id;
    Favorites.findOneAndUpdate(
      {postedBy: userId},
      {$pull: {places: req.params.placeId}},
      {new: true}, function (err, favorite) {
        if (err) return next(err);
        res.json(favorite);
    });
});

module.exports = favoriteRouter;
