"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoutes = require("./routes/user-routes");
const paymentCardRoutes = require("./routes/payment-card-routes");
const historyRoutes = require("./routes/history-routes");
const touristPlaceRoutes = require("./routes/tourist-place-route");
const tripRoutes = require("./routes/trip-route");

let app = express();

app.use(cors({origin: true, credentials: true}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
    );
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
    next();
});

app.use("/v1", userRoutes);
app.use("/v1", historyRoutes);
app.use("/v1", paymentCardRoutes);
app.use("/v1",touristPlaceRoutes);
app.use("/v1",tripRoutes);

module.exports = app;