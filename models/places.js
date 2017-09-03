// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);
var Currency = mongoose.Types.Currency;

var commentSchema = new Schema({
    rating:  {
        type: String, /*Number,*/
      /*  min: 1,
        max: 5, */
        required: true
    },
    comment:  {
        type: String,
        required: true
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId, // Reference to a usuar (in other document)
        ref: 'User'
    }
}, {
    timestamps: true
});

// create a schema
var placeSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    label: {
        type: String,
        required: false,
        default: ''
    },
    priceDay: {
        type: Currency,
        required: false
    },
    priceMonth: {
        type: Currency,
        required: false
    },
    priceMeetingRoom: {
        type: Currency,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    feature1: {
        type: String,
        required: false
    },
    feature2: {
        type: String,
        required: false
    },
    feature3: {
        type: String,
        required: false
    },
    feature4: {
        type: String,
        required: false
    },
    comments:[commentSchema]
}, {
    timestamps: true
});

// the schema is useless so far
// we need to create a model using it
var Places = mongoose.model('Place', placeSchema);

// make this available to our Node applications
module.exports = Places;
