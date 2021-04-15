"use strict";

const express = require("express");
const userController = require("./../controllers/user-controller");
const mdAuth = require("./../middlewares/authenticated");

const api = express.Router();

// Usuario administrador
api.post("/createUserAdmin", userController.createUserAdmin);

// Usuario turista
api.post("/register", userController.register);
api.post("/login", userController.login);
api.get("/getUsers", [mdAuth.ensureAuth], userController.getUsers);
api.get("/getUser", [mdAuth.ensureAuth], userController.getUser);
api.post(
    "/updateUser/:idU", [mdAuth.ensureAuth, mdAuth.ensureAuthTourist],
    userController.updateUser
);
api.delete(
    "/deleteUser/:idU", [mdAuth.ensureAuth, mdAuth.ensureAuthTourist],
    userController.deleteUser
);

module.exports = api;