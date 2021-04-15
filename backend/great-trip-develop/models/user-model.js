"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = Schema({
    name: String,
    lastname: String,
    nationality: String,
    address: String,
    identification: String,
    phone: String,
    email: String,
    role: { type: String, default: "ROL_TURISTA" },
    history: [{ type: Schema.ObjectId, ref: "history" }],
    payment_methods: [{
        type: Schema.ObjectId,
        ref: "paymentcard",
    }, ],
    rate: { type: Number, default: 0 },
    birthday: Date,
    username: String,
    password: String,
    available: { type: Boolean, default: true },
    avatar: {type: String, default: "av-1.png"}
});

module.exports = mongoose.model("user", userSchema);