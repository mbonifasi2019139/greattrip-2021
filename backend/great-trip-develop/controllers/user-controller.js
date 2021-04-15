"use strict";

const User = require("./../models/user-model");
const paymentCard = require("./../models/payment-card-model");
const history = require("./../models/history-model");
const jwt = require("./../services/jwt");
const bcrypt = require("bcrypt-nodejs");

function createUserAdmin(req, res) {
    let user = new User();

    const username = "admin";
    const password = "admin";
    const role = "ROL_ADMIN";

    User.findOne({ username }, (err, userFound) => {
        if (err) {
            return res.status(500).send({ ok: false, message: "Error general" });
        } else if (userFound) {
            return res.json({
                ok: false,
                message: "Username ya existe, ingrese otro",
            });
        } else {
            bcrypt.hash(password, null, null, (err, passwordHashed) => {
                if (err) {
                    return res.status(500).send({ ok: false, message: "Error general" });
                } else if (passwordHashed) {
                    user.username = username.toLowerCase();
                    user.password = passwordHashed;
                    user.role = role;

                    user.save((err, userSaved) => {
                        if (err) {
                            return res
                                .status(500)
                                .send({ ok: false, message: "Error general" });
                        } else if (userSaved) {
                            return res.json({
                                ok: true,
                                message: "Administrador creado corretamente",
                                userSaved,
                            });
                        } else {
                            return res.json({
                                ok: false,
                                message: "No se pudo guardar el usuario administrador",
                            });
                        }
                    });
                } else {
                    return res.json({
                        ok: false,
                        message: "No se pudo encriptar la password",
                    });
                }
            });
        }
    });
}

function register(req, res) {
    let user = new User();
    let params = req.body;

    if (
        params.name &&
        params.lastname &&
        params.email &&
        params.nationality &&
        params.identification &&
        params.birthday &&
        params.username &&
        params.password &&
        params.phone
    ) {
        User.findOne({ username: params.username.toLowerCase() },
            (err, usernameFound) => {
                if (err) {
                    return res.status(500).send({ ok: false, message: "Error general" });
                } else if (usernameFound) {
                    return res.json({
                        ok: false,
                        message: "Username ya existe, ingresa otro",
                    });
                } else {
                    bcrypt.hash(params.password, null, null, (err, passwordHashed) => {
                        if (err) {
                            return res
                                .status(500)
                                .send({ ok: false, message: "Error general" });
                        } else if (passwordHashed) {
                            user.name = params.name;
                            user.lastname = params.lastname;
                            user.nationality = params.nationality;
                            user.email = params.email;
                            user.identification = params.identification;
                            user.birthday = params.birthday;
                            user.username = params.username.toLowerCase();
                            user.password = passwordHashed;
                            user.phone = params.phone;
                            user.role = params.role || "ROL_TURISTA";

                            user.save((err, userSaved) => {
                                if (err) {
                                    return res
                                        .status(500)
                                        .send({ ok: false, message: "Error general" });
                                } else if (userSaved) {
                                    return res.json({
                                        ok: true,
                                        message: "Usuario turista guardado correctamente",
                                        token: jwt.createToken(userSaved),
                                        userSaved,
                                    });
                                } else {
                                    return res.json({
                                        ok: false,
                                        message: "No se pudo guardar el usuario",
                                    });
                                }
                            });
                        } else {
                            return res.json({
                                ok: false,
                                message: "No se pudo encriptar la password",
                            });
                        }
                    });
                }
            }
        );
    } else {
        return res.json({
            ok: false,
            message: "Ingresa los datos requeridos",
            request: req.body,
        });
    }
}

function login(req, res) {
    let login = req.body;

    if (login.username && login.password) {
        User.findOne({ username: login.username.toLowerCase() },
            (err, userFound) => {
                if (err) {
                    return res.status(500).send({ ok: false, message: "Error general" });
                } else if (userFound) {
                    bcrypt.compare(
                        login.password,
                        userFound.password,
                        (err, passwordMatch) => {
                            if (err) {
                                return res
                                    .status(500)
                                    .send({ ok: false, message: "Error general" });
                            } else if (passwordMatch) {
                                return res.json({
                                    ok: true,
                                    message: "login correcto",
                                    token: jwt.createToken(userFound),
                                    user: userFound,
                                });
                            } else {
                                return res.json({
                                    ok: false,
                                    message: "La password no coincide",
                                });
                            }
                        }
                    );
                } else {
                    return res.json({ ok: false, message: "No existe ese usuario" });
                }
            }
        );
    } else {
        return res.json({
            ok: false,
            message: "Por favor, ingrese los datos necesarios",
        });
    }
}

function getUsers(req, res) {
    User.find({})
        .populate()
        .exec((err, users) => {
            if (err) {
                return res.status(500).send({ ok: false, message: "Error general" });
            } else if (users) {
                return res.json({ ok: true, message: "Usuarios encontrados", users });
            } else {
                return res.json({ ok: false, message: "No existen usuarios" });
            }
        });
}

function getUser(req, res) {
    let userId = req.user.sub;

    User.findById(userId, (err, user) => {
        if (err) {
            return res.status(500).send({ ok: false, message: "Error general" });
        } else if (user) {
            return res.json({
                ok: true,
                message: "Usuario",
                user,
                token: req.headers.authorization,
            });
        } else {
            return res.json({ ok: false, message: "Error al encontrar el usuario" });
        }
    });
}

function updateUser(req, res) {
    let userId = req.params.idU;
    let update = req.body;

    delete update._id;
    delete update.password;
    delete update.role;

    if (req.user.sub != userId) {
        return res
            .status(500)
            .send({ ok: false, message: "No tienes los permisos" });
    } else {
        User.findOne({ username: update.username.toLowerCase() },
            (err, usernameFound) => {
                if (err) {
                    return res.status(500).send({ ok: false, message: "Error general" });
                } else if (usernameFound) {
                    return res.json({ ok: false, message: "Ese username ya existe" });
                } else {
                    User.findById(userId).exec((err, userFound) => {
                        if (err) {
                            return res
                                .status(500)
                                .send({ ok: false, message: "Error general" });
                        } else if (userFound) {
                            if (!update.role && !update.password) {
                                User.findByIdAndUpdate(
                                    userId,
                                    update, { new: true },
                                    (err, userUpdated) => {
                                        if (err) {
                                            return res
                                                .status(500)
                                                .send({ ok: false, message: "Error general" });
                                        } else if (userUpdated) {
                                            const tokenUser = jwt.getToken(userUpdated);

                                            return res.json({
                                                ok: true,
                                                message: "Tu informacion ha sido actualizada",
                                                token: tokenUser,
                                                userUpdated,
                                            });
                                        } else {
                                            return res.json({
                                                ok: false,
                                                message: "No se pudo actualizar tu informacion",
                                            });
                                        }
                                    }
                                );
                            } else {
                                return res.json({
                                    ok: false,
                                    message: "No puede editar tu rol ni tu password desde esta opcion.",
                                });
                            }
                        } else {
                            return res.json({ ok: false, message: "No existe el usuario" });
                        }
                    });
                }
            }
        );
    }
}

function deleteUser(req, res) {
    let userId = req.params.idU;

    let password = req.body.password;

    if (userId != req.user.sub) {
        return res.status(500).send({ ok: false, message: "No coincide le ID" });
    } else {
        if (password) {
            User.findById(userId, (err, userFound) => {
                if (err) {
                    return res.status(500).send({ ok: false, message: "Error general" });
                } else if (userFound) {
                    bcrypt.compare(password, userFound.password, (err, passwordMatch) => {
                        if (err) {
                            return res
                                .status(500)
                                .send({ ok: false, message: "Error general" });
                        } else if (passwordMatch) {
                            User.findByIdAndRemove(userId, (err, userRemoved) => {
                                if (err) {
                                    return res
                                        .status(500)
                                        .send({ ok: false, message: "Error general" });
                                } else if (userRemoved) {
                                    return res.json({
                                        ok: false,
                                        message: "Usuario eliminado correctamente",
                                        userRemoved,
                                    });
                                } else {
                                    return res.json({
                                        ok: false,
                                        message: "No se pudo eliminar al usuario",
                                    });
                                }
                            });
                        } else {
                            return res.json({
                                ok: false,
                                message: "No coincide la password",
                            });
                        }
                    });
                } else {
                    return res.json({ ok: false, message: "Usuario no encontrado" });
                }
            });
        } else {
            return res.json({
                ok: false,
                message: "Ingrese la password para confirmar",
            });
        }
    }
}

module.exports = {
    createUserAdmin,
    register,
    login,
    getUsers,
    getUser,
    updateUser,
    deleteUser,
};