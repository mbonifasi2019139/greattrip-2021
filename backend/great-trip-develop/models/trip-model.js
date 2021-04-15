"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tripSchema = Schema({
    title: String,
    description: String,
    price: Number,
    country: String,
    start_date: Date,
    end_date: Date,
    imageUrl: String,
    tourists_places: [{ type: Schema.ObjectId, ref: "touristplace" }],
    tourists_guide: [{ type: Schema.ObjectId, ref: "user" }],
    type_of_trip: {type: String, default: "Great Trip"},
    coupons: Number,
});

module.exports = mongoose.model("trip", tripSchema);