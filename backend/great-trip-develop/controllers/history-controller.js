"use strict";

const History = require("./../models/history-model");
const User = require("./../models/user-model");
const PaymentCard = require("./../models/payment-card-model");
const Trip = require("./../models/trip-model");

function setTripHistory(req, res) {
    let history = new History();
    let userId = req.params.idU;
    let touristGuideId = req.params.idTG;
    let paymendCardId = req.params.idPC;
    let tripId = req.params.idTP;
    let params = req.body;

    if (userId == req.user.sub) {
        if (touristGuideId && paymendCardId) {
            User.findOne({ _id: touristGuideId, role: "ROL_GUIA", available: true },
                (err, tgFound) => {
                    if (err) {
                        return res.status(500).send({ message: "Error general" });
                    } else if (tgFound) {
                        User.findOne({ _id: userId, role: "ROL_TURISTA", payment_card: paymendCardId },
                            (err, userFound) => {
                                if (err) {
                                    return res.status(500).send({ message: "Error general" });
                                } else if (userFound) {
                                    if (params.transportation_cost) {
                                        Trip.findById(tripId, (err, tripFound) => {
                                            if (err) {
                                                return res
                                                    .status(500)
                                                    .send({ message: "Error general" });
                                            } else if (tripFound) {
                                                history.tripTitle = tripFound.title;
                                                history.price = tripFound.price;
                                                history.start_date = tripFound.start_date;
                                                history.end_date = tripFound.end_date;
                                                history.ourist_guide = ObjectId(touristGuideId);
                                                history.transportation_cost =
                                                    params.transportation_cost;
                                                history.payment_card = ObjectId(paymendCardId);
                                                history.total_amount =
                                                    parseInt(tripFound.price) +
                                                    parseInt(params.transportation_cost);

                                                history.save((err, historySaved) => {
                                                    if (err) {
                                                        return res
                                                            .status(500)
                                                            .send({ message: "Error general" });
                                                    } else if (historySaved) {
                                                        User.findByIdAndUpdate(
                                                            userId, { $push: { history: historySaved._id } }, { new: true },
                                                            (err, usrUpdated) => {
                                                                if (err) {
                                                                    return res
                                                                        .status(500)
                                                                        .send({ message: "Error general" });
                                                                } else if (usrUpdated) {
                                                                    return res.send({
                                                                        message: "Historial guardado correctamente",
                                                                        historySaved,
                                                                        usrUpdated,
                                                                    });
                                                                } else {
                                                                    return res.status(400).send({
                                                                        message: "No se pudo actualizar al usuario",
                                                                    });
                                                                }
                                                            }
                                                        );
                                                    } else {
                                                        return res.status(400).send({
                                                            message: "No se pudo guardar el historial del viaje",
                                                        });
                                                    }
                                                });
                                            } else {
                                                return res
                                                    .status(404)
                                                    .send({ message: "No se encontro el viaje" });
                                            }
                                        });
                                    } else {}
                                } else {
                                    return res
                                        .status(404)
                                        .send({ message: "NO se encontro el turista" });
                                }
                            }
                        );
                    } else {
                        return res.status(404).send({
                            message: "No se encontro al guia turistico o no esta disponible",
                        });
                    }
                }
            );
        } else {
            return res
                .status(400)
                .send({ message: "Ingrese los parametros necesarios" });
        }
    } else {
        return res.status(404).send({ message: "Su ID no coincide" });
    }
}

function getHistory(req, res) {
    let userId = req.params.idU;

    if (userId == req.user.sub) {
        User.findById(userId)
            .populate()
            .exec((err, userFound) => {
                if (err) {
                    return res.status(500).send({ message: "Error general" });
                } else if (userFound) {
                    return res.send({
                        message: "Historial usuario",
                        history: userFound.history,
                    });
                } else {
                    return res.status(404).send({ message: "NO se encontro al usuario" });
                }
            });
    } else {
        return res
            .status(400)
            .send({ message: "Ingrese los parametros necesarios" });
    }
}

module.exports = {
    setTripHistory,
    getHistory,
};

/*
                    if(err){
                        return res.status(500).send({message: "Error general"});
                    } else if(){ 
                        
                    }else {
        
                    }

*/