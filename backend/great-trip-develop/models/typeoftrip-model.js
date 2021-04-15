"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const typeOfTripSchema = Schema({
    name: String,
});

module.exports = mongoose.model("typeoftrip", typeOfTripSchema);