"use strict";

var express = require("express");
var touristPlaceController = require("../controllers/tourist-place-controller");
//var mdAuth = require("../middlewares/authenticated");
var api = express.Router();

api.post(
    "/addTouristPlace",
    /*[mdAuth.ensureAuth,mdAuth.ensureAuthAdmin],*/
    touristPlaceController.addTouristPlace
);
api.post(
    "/addImagesTouristPlace/:id",
    /*[mdAuth.ensureAuth,mdAuth.ensureAuthAdmin],*/
    touristPlaceController.addImagesTouristPlace
);
api.put(
    "/updateTouristPlace/:id",
    /*[mdAuth.ensureAuth,mdAuth.ensureAuthAdmin],*/
    touristPlaceController.updateTouristPlace
);
api.delete(
    "/removeTouristPlace/:id",
    /*[mdAuth.ensureAuth,mdAuth.ensureAuthAdmin],*/
    touristPlaceController.removeTouristPlace
);
api.get(
    "/getTouristPlaces",
    /*[mdAuth.ensureAuth,mdAuth.ensureAuthAdmin],*/
    touristPlaceController.getTouristPlaces
);
api.post(
    "/getTouristPlace/:idTU",
    /*[mdAuth.ensureAuth,mdAuth.ensureAuthAdmin],*/
    touristPlaceController.getTouristPlace
);
api.post(
    "/addReview/:id",
    /*[mdAuth.ensureAuth,mdAuth.ensureAuthAdmin],*/
    touristPlaceController.addReview
);
api.post(
    "/getLngLatTPByTripID/:idT",
    touristPlaceController.getLngLatTPByTripID
);

module.exports = api;