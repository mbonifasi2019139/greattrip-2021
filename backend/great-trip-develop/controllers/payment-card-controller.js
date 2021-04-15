"use strict";

const PaymentCard = require("./../models/payment-card-model");
const User = require("./../models/user-model");
const bcrypt = require("bcrypt-nodejs");

function setPaymentCard(req, res) {
    let paymentCard = new PaymentCard();
    let userId = req.params.idU;
    let params = req.body;

    if (userId == req.user.sub) {
        User.findById(userId, (err, userFound) => {
            if (err) {
                return res.status(500).send({ message: "Error general" });
            } else if (userFound) {
                if (
                    params.card_name &&
                    params.card_number &&
                    params.mmaa &&
                    params.cvv2 &&
                    params.postal_code &&
                    params.email_paypal &&
                    params.password_paypal
                ) {
                    bcrypt.hash(
                        params.password_paypal,
                        null,
                        null,
                        (err, passwordHashed) => {
                            if (err) {
                                return res.status(500).send({ message: "Error general" });
                            } else if (passwordHashed) {
                                paymentCard.card_name = params.card_name;
                                paymentCard.card_number = params.card_number;
                                paymentCard.mmaa = params.mmaa;
                                paymentCard.cvv2 = params.cvv2;
                                paymentCard.postal_code = params.postal_code;
                                paymentCard.email_paypal = params.email_paypal;
                                paymentCard.password_paypal = passwordHashed;

                                paymentCard.save((err, paymentCardSaved) => {
                                    if (err) {
                                        return res.status(500).send({ message: "Error general" });
                                    } else if (paymentCardSaved) {
                                        User.findByIdAndUpdate(
                                            userId, { $push: { payment_methods: paymentCardSaved._id } }, { new: true },
                                            (err, userUpdated) => {
                                                if (err) {
                                                    return res
                                                        .status(500)
                                                        .send({ message: "Error general" });
                                                } else if (userUpdated) {
                                                    return res.send({
                                                        message: "Metodo de pago agreado correctamente",
                                                        paymentCardSaved,
                                                        userUpdated,
                                                    });
                                                } else {
                                                    return res.status(404).send({
                                                        message: "No se pudo actualizar el usuario",
                                                    });
                                                }
                                            }
                                        );
                                    } else {
                                        return res
                                            .status(401)
                                            .send({ message: "No se pudo guardar" });
                                    }
                                });
                            } else {
                                return res
                                    .status(404)
                                    .send({ message: "No se pudo encriptar la password" });
                            }
                        }
                    );
                } else {
                    return res
                        .status(403)
                        .send({ message: "Ingrese los datos necesarios" });
                }
            } else {
                return res.status(404).send({ message: "NO se encontro al usuario" });
            }
        });
    } else {
        return res.status(404).send({ message: "NO coincide el ID de usuario" });
    }
}

function getUserPaymentCards(req, res) {
    let userId = req.params.idU;

    if (userId == req.user.sub) {
        User.findById(userId, (err, userFound) => {
            if (err) {
                return res.status(500).send({ message: "Error general" });
            } else if (userFound) {
                return res.send({
                    message: "Tarjetas de pago encontradas",
                    user: userFound.payment_methods,
                });
            } else {
                return res.status(404).send({ message: "Usuario no encontrado" });
            }
        }).populate("payment_methods");
    } else {
        return res.status(403).send({ message: "No coincide el userId" });
    }
}

function updatePaymentCard(req, res) {
    let userId = req.params.idU;
    let paymentCardId = req.params.idPC;
    let update = req.body;

    if (userId == req.user.sub) {
        PaymentCard.findById(paymentCardId, (err, paymentCardFound) => {
            if (err) {
                return res.status(500).send({ message: "Error general" });
            } else if (paymentCardFound) {
                User.findOne({ _id: userId, payment_methods: paymentCardId },
                    (err, userFound) => {
                        if (err) {
                            return res.status(500).send({ message: "Error general" });
                        } else if (userFound) {
                            PaymentCard.findByIdAndUpdate(
                                paymentCardId,
                                update, { new: true },
                                (err, payCardUpdated) => {
                                    if (err) {
                                        return res.status(500).send({ message: "Error general" });
                                    } else if (payCardUpdated) {
                                        return res.send({
                                            message: "Tarjeta Actualizada",
                                            payCardUpdated,
                                        });
                                    } else {
                                        return res
                                            .status(404)
                                            .send({ message: "No se pudo actualizar la tarjeta" });
                                    }
                                }
                            );
                        } else {
                            return res.status(404).send({
                                message: "No se encontro al usuario con ese ID de tarjeta",
                            });
                        }
                    }
                );
            } else {
                return res.status(404).send({ message: "Tarjeta no encontrada" });
            }
        });
    } else {
        return res.status(403).send({ message: "Ingrese el " });
    }
}

function deletePaymentCard(req, res) {
    let userId = req.params.idU;
    let paymentCardId = req.params.idPC;

    if (userId == req.user.sub) {
        if (paymentCardId) {
            User.findOneAndUpdate({ _id: userId, payment_methods: paymentCardId }, { $pull: { payment_methods: paymentCardId } }, { new: true },
                (err, userPull) => {
                    if (err) {
                        return res.status(500).send({ message: "Error general" });
                    } else if (userPull) {
                        PaymentCard.findByIdAndRemove(paymentCardId, (err, pcRemoved) => {
                            if (err) {
                                return res.status(500).send({ message: "Error general" });
                            } else if (pcRemoved) {
                                return res.send({ message: "Tarjeta eliminada", userPull });
                            } else {
                                return res
                                    .status(500)
                                    .send({ message: "No se encontro la tajeta" });
                            }
                        });
                    } else {
                        return res
                            .status(404)
                            .send({ message: "No se pudo eliminar la tarjeta de pago" });
                    }
                }
            );
        } else {
            return res.status(400).send({ message: "Ingresa el ID de la tarjeta" });
        }
    } else {
        return res.status(403).send({ message: "No coincide el ID del usuario" });
    }
}

module.exports = {
    setPaymentCard,
    getUserPaymentCards,
    updatePaymentCard,
    deletePaymentCard,
};