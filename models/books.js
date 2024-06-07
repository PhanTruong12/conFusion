const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

var commentSchema = new Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});
const bookSchema = new Schema({
    isbn: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    subTitle: {
        type: String,
        required: true
    },
    publish_date: {
        type: String,
        required: true
    },
    publisher: {
        type: String,
        default: ''
    },
    pages: {
        type: Currency,
        required: true,
        min: 0
    },
    price: {
        type: Currency,
        required: true,
        min: 0
    },
    description: {
        type: String,
        required: true
    },
    website: {
        type: String,
        required: true
    },
    
    comments:[commentSchema],
    genre:{
        type: String,
        required:true
    }
}, {
    timestamps: true

});




var Books = mongoose.model('book', bookSchema);

module.exports = Books;
