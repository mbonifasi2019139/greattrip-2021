"use strict";

const express = require("express");
const paymentCardController = require("./../controllers/payment-card-controller");
const mdAuth = require("./../middlewares/authenticated");

const api = express.Router();

api.post(
    "/setPaymentCard/:idU", [mdAuth.ensureAuth, mdAuth.ensureAuthTourist],
    paymentCardController.setPaymentCard
);
api.post(
    "/getUserPaymentCards/:idU", [mdAuth.ensureAuth, mdAuth.ensureAuthTourist],
    paymentCardController.getUserPaymentCards
);
api.post(
    "/:idU/updatePaymentCard/:idPC", [mdAuth.ensureAuth, mdAuth.ensureAuthTourist],
    paymentCardController.updatePaymentCard
);
api.delete(
    "/:idU/deletePaymentCard/:idPC", [mdAuth.ensureAuth, mdAuth.ensureAuthTourist],
    paymentCardController.deletePaymentCard
);

module.exports = api;