"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const touristPlaceSchema = Schema({
    name: String,
    description: String,
    urlsImages: [],
    reviews: [{
        userId: { type: Schema.ObjectId, ref: "user" },
        review: String,
    }, ],
    country: String,
    address: String,
});

module.exports = mongoose.model("touristplace", touristPlaceSchema);