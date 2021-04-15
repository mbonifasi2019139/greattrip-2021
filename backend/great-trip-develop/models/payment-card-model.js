"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const paymentCardSchema = Schema({
    card_name: String,
    card_number: String,
    mmaa: String,
    cvv2: Number,
    postal_code: String,
    email_paypal: String,
    password_paypal: String,
});

module.exports = mongoose.model("paymentcard", paymentCardSchema);