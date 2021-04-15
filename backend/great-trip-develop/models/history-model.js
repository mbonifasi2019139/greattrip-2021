"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const historySchema = Schema({
    tripTitle: String,
    price: Number,
    start_date: Date,
    end_date: Date,
    tourist_guide: { type: Schema.ObjectId, ref: "user" },
    transportation_cost: Number,
    payment_card: { type: Schema.ObjectId, ref: "payment_card" },
    pay_date: { type: Date, default: Date.now },
    total_amount: Number,
});

module.exports = mongoose.model("history", historySchema);