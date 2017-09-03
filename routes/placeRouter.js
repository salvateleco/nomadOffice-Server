var express = require('express');

var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Verify = require('./verify');

var Places = require('../models/places');

var placeRouter = express.Router();
placeRouter.use(bodyParser.json());

placeRouter.route('/')

    .get(function(req, res, next){
        Places.find(req.query)
          .populate('comments.postedBy')
          .exec(function(err, place) {
            if (err) return next(err);
            res.json(place);
        });
    })

    .post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
        Places.create(req.body, function(err, place) {
            if (err) return next(err);
            console.log('Place created!');
            var response = { status: "Added place with id: " + place._id };
            res.json(response);
        });
    })

    .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
        Places.remove({}, function(err, resp) {
            if (err) return next(err);
            res.json(resp);
        });
    });

placeRouter.route('/:placeId')

    .get(function(req, res, next){
        Places.findById(req.params.placeId)
          .populate('comments.postedBy')
          .exec(function(err, place) {
            if (err) return next(err);
            res.json(place);
        });
    })

    .put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
        Places.findByIdAndUpdate(req.params.placeId, {
            $set: req.body
        }, {
            new: true
        }, function (err, place) {
            if (err) return next(err);
            res.json(place);
        });
    })

    .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
        Places.findByIdAndRemove(req.params.placeId, function(err, resp) {
            if (err) return next(err);
            res.json(resp);
        });
    })
;

placeRouter.route('/:placeId/comments')

    .get(function (req, res, next) {
        Places.findById(req.params.placeId)
          .populate('comments.postedBy')
          .exec(function (err, place) {
            if (err) return next(err);
            res.json(place.comments);
        });
    })

    .post(Verify.verifyOrdinaryUser, function (req, res, next) {
        Places.findById(req.params.placeId, function (err, place) {
            if (err) return next(err);
            req.body.postedBy = req.decoded._id;
            place.comments.push(req.body);
            place.save(function (err, place) {
                if (err) return next(err);
                console.log('Updated Comments!');
                res.json(place);
            });
        });
    })

    .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
        Places.findById(req.params.placeId, function (err, place) {
            if (err) return next(err);
            for (var i = (place.comments.length - 1); i >= 0; i--) {
                place.comments.id(place.comments[i]._id).remove();
            }
            place.save(function (err, result) {
                if (err) return next(err);
                res.writeHead(200, {
                    'Content-Type': 'text/plain'
                });
                res.end('Deleted all comments!');
            });
        });
    });

placeRouter.route('/:placeId/comments/:commentId')

    .get(Verify.verifyOrdinaryUser, function (req, res, next) {
        Places.findById(req.params.placeId)
          .populate('comments.postedBy')
          .exec(function (err, place) {
            if (err) return next(err);
            res.json(place.comments.id(req.params.commentId));
        });
    })

    .put(Verify.verifyOrdinaryUser, function (req, res, next) {
        // We delete the existing commment and insert the updated
        // comment as a new comment
        Places.findById(req.params.placeId, function (err, place) {
            if (err) return next(err);
            place.comments.id(req.params.commentId).remove();
            req.body.postedBy = req.decoded._id;
            place.comments.push(req.body);
            place.save(function (err, place) {
                if (err) return next(err);
                console.log('Updated Comments!');
                res.json(place);
            });
        });
    })

    .delete(Verify.verifyOrdinaryUser, function (req, res, next) {
        Places.findById(req.params.placeId, function (err, place) {
            if (place.comments.id(req.params.commentId).postedBy != req.decoded._id) {
              var err = new Error('You are not authorized to perform this operation!');
              err.status = 403;
              return next(err);
            }
            place.comments.id(req.params.commentId).remove();
            place.save(function (err, resp) {
                if (err) return next(err);
                res.json(resp);
            });
        });
    });

module.exports = placeRouter;
