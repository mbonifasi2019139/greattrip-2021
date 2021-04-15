"use strict";

var express = require("express");
var tripController = require("../controllers/trip-controller");
//var mdAuth = require("../middlewares/authenticated");
var api = express.Router();

api.post(
    "/createTrip",
    /*[mdAuth.ensureAuth,mdAuth.ensureAuthAdmin],*/
    tripController.createTrip
);
api.put(
    "/:idT/addTouristPlaceTrip/:idTP",
    /*[mdAuth.ensureAuth,mdAuth.ensureAuthAdmin],*/
    tripController.addTouristPlaceTrip
);
api.put(
    "/:idT/addTouristsGuides/:idG",
    /*[mdAuth.ensureAuth,mdAuth.ensureAuthAdmin],*/
    tripController.addTouristsGuides
);
api.put(
    "/updateTrip/:idT",
    /*[mdAuth.ensureAuth,mdAuth.ensureAuthAdmin],*/
    tripController.updateTrip
);
api.delete(
    "/removeTrip/:idT",
    /*[mdAuth.ensureAuth,mdAuth.ensureAuthAdmin],*/
    tripController.removeTrip
);
api.put(
    "/:idT/removeTouristPlaceTrip/:idTP",
    /*[mdAuth.ensureAuth,mdAuth.ensureAuthAdmin],*/
    tripController.removeTouristPlaceTrip
);
api.put(
    "/:idT/removeTouristGuide/:idG",
    /*[mdAuth.ensureAuth,mdAuth.ensureAuthAdmin],*/
    tripController.removeTouristGuide
);
api.get(
    "/getTrips",
    /*[mdAuth.ensureAuth,mdAuth.ensureAuthAdmin],*/
    tripController.getTrips
);

api.post(
    "/getTrip/:idT",
    /*[mdAuth.ensureAuth,mdAuth.ensureAuthAdmin],*/
    tripController.getTrip
);

module.exports = api;