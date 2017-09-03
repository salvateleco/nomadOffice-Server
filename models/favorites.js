// Grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var favoriteSchema = new Schema({
    places: [{
        type: Schema.Types.ObjectId,
        ref: 'Place',
        unique: true
    }],
    postedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// The schema is useless so far. We need to create a model using it
var Favorites = mongoose.model('Favorites', favoriteSchema);

// Make this available to our Node applications
module.exports = Favorites;
