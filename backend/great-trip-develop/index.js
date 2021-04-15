"use strict";

var mongoose = require("mongoose");
var app = require("./app");
var port = 3000;
//var typeOfTrip = require("./controllers/typeoftrip-controller");

mongoose.Promise = global.Promise;
mongoose.set("useFindAndModify", false);
mongoose
    .connect("mongodb://localhost:27017/dbgreattrip2021", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Conectado a la BD");
        //typeOfTrip.createTypesTrip();
        app.listen(port, () => {
            console.log("Servidor de express corriendo");
        });
    })
    .catch((err) => {
        console.log("Error al conectar a la BD", err);
    });