"use strict";

const express = require("express");
const historyController = require("./../controllers/history-controller");
const mdAuth = require("./../middlewares/authenticated");

const api = express.Router();

api.post(
    "/:idU/setTripHistory/:idTG/:idPC/:idTP", [mdAuth.ensureAuth, mdAuth.ensureAuthTourist],
    historyController.setTripHistory
);
api.post(
    "/getHistory/:idU", [mdAuth.ensureAuth, mdAuth.ensureAuthTourist],
    historyController.getHistory
);

module.exports = api;