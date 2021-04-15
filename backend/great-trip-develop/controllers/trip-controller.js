"use strict";

var Trip = require("../models/trip-model");
var TouristPlace = require("../models/tourist-place-model");
var User = require("../models/user-model");

function createTrip(req, res) {
    var params = req.body;
    var trip = new Trip();

    if (
        params.title &&
        params.description &&
        params.price &&
        params.country &&
        params.start_date &&
        params.end_date &&
        params.imageUrl &&
        params.coupons
    ) {
        trip.title = params.title;
        trip.description = params.description;
        trip.price = params.price;
        trip.country = params.country;
        trip.start_date = params.start_date;
        trip.end_date = params.end_date;
        trip.imageUrl = params.imageUrl;
        trip.coupons = params.coupons;
        trip.type_of_trip = params.type_of_trip;
        if (trip.start_date.getTime() > trip.end_date.getTime()) {
            return res
                .status(403)
                .send({ message: "La fecha de termino sucede antes que la de inicio" });
        } else {
            trip.save((err, tripSaved) => {
                if (err) {
                    return res
                        .status(500)
                        .send({ message: "Error al crear plan de viaje" });
                } else if (tripSaved) {
                    return res.send({
                        message: "Plan de viaje creado exitosamente",
                        tripSaved,
                    });
                } else {
                    return res
                        .status(404)
                        .send({ message: "No se creó el plan de viaje" });
                }
            });
        }
    } else {
        return res
            .status(403)
            .send({ message: "Ingrese los datos mínimos del plan de viaje" });
    }
}

function addTouristPlaceTrip(req, res) {
    let tripId = req.params.idT;
    let touristPlaceId = req.params.idTP;

    Trip.findById(tripId, (err, tripFinded) => {
        if (err) {
            return res
                .status(500)
                .send({ message: "Error en el servidor al buscar" });
        } else if (tripFinded) {
            TouristPlace.findById(touristPlaceId, (err, tpFinded) => {
                if (err) {
                    return res
                        .status(500)
                        .send({ message: "Error al buscar lugar turístico" });
                } else if (tpFinded) {
                    if (tripFinded.country == tpFinded.country) {
                        let validation = true;
                        tripFinded.tourists_places.forEach((element) => {
                            if (element == touristPlaceId) {
                                validation = false;
                            }
                        });
                        if (validation == true) {
                            Trip.findByIdAndUpdate(
                                tripId, { $push: { tourists_places: tpFinded._id } }, { new: true },
                                (err, tpPushed) => {
                                    if (err) {
                                        return res.status(500).send({
                                            message: "Error en el servidor al agregar lugar turístico",
                                        });
                                    } else if (tpPushed) {
                                        return res.send({
                                            message: "Lugar turístico agregado al plan de viaje exitosamente",
                                        });
                                    } else {
                                        return res
                                            .status(404)
                                            .send({ message: "No se agregó el lugar turístico" });
                                    }
                                }
                            );
                        } else {
                            return res.status(403).send({
                                message: "El lugar turístico ya está en el plan de viaje",
                            });
                        }
                    } else {
                        return res.status(403).send({
                            message: "El lugar turístico no se encuentra en el país del plan de viaje",
                        });
                    }
                } else {
                    return res
                        .status(403)
                        .send({ message: "ID de lugar turístico inexistente" });
                }
            });
        } else {
            return res
                .status(403)
                .send({ message: "ID de plan de viaje no existente" });
        }
    });
}

function addTouristsGuides(req, res) {
    let tripId = req.params.idT;
    let guideId = req.params.idG;

    Trip.findById(tripId, (err, tripFinded) => {
        if (err) {
            return res.status(500).send({ message: "Error al buscar plan de viaje" });
        } else if (tripFinded) {
            let validation = true;
            tripFinded.tourists_guide.forEach((element) => {
                if (element == guideId) {
                    validation = false;
                }
            });
            if (validation == true) {
                User.findById(guideId, (err, guideFinded) => {
                    if (err) {
                        return res.status(500).send({ message: "Error al buscar usuario" });
                    } else if (guideFinded) {
                        if (
                            guideFinded.role == "ROL_GUIA" &&
                            guideFinded.nationality == tripFinded.country &&
                            guideFinded.available == true
                        ) {
                            Trip.findByIdAndUpdate(
                                tripId, { $push: { tourists_guide: guideId } }, { new: true },
                                (err, guidePushed) => {
                                    if (err) {
                                        return res
                                            .status(500)
                                            .send({ message: "Error al intentar agregar guía" });
                                    } else if (guidePushed) {
                                        return res.send({
                                            message: "Guía turístico agregado al plan de viaje exitosamente",
                                        });
                                    } else {
                                        return res
                                            .status(404)
                                            .send({ message: "No se agregó el guía" });
                                    }
                                }
                            );
                        } else {
                            return res.status(401).send({
                                message: "Este usuario no es un guía turístico, no está cerca del lugar o no está disponible",
                            });
                        }
                    } else {
                        return res
                            .status(403)
                            .send({ message: "ID de usuario no existente" });
                    }
                });
            } else {
                return res
                    .status(403)
                    .send({ message: "El guía turístico ya está agregado al plan" });
            }
        } else {
            return res
                .status(403)
                .send({ message: "ID de plan de viaje no existente" });
        }
    });
}

function updateTrip(req, res) {
    let tripId = req.params.idT;
    let update = req.body;

    Trip.findById(tripId, (err, tripFinded) => {
        if (err) {
            return res
                .status(500)
                .send({ message: "Error en el servidor al buscar" });
        } else if (tripFinded) {
            let date1 = new Date(update.start_date);
            let date2 = new Date(update.end_date);
            if (
                date1.getTime() > tripFinded.end_date.getTime() ||
                tripFinded.start_date.getTime() > date2.getTime()
            ) {
                return res.status(403).send({
                    message: "La fecha de termino sucede antes que la de inicio",
                });
            } else {
                Trip.findByIdAndUpdate(
                    tripId,
                    update, { new: true },
                    (err, tripUpdated) => {
                        if (err) {
                            return res.status(500).send({
                                message: "Error al intentar actualizar plan de viaje",
                            });
                        } else if (tripUpdated) {
                            return res.send({
                                message: "Plan de viaje actualizado exitosamente",
                                tripUpdated,
                            });
                        } else {
                            return res.status(404).send({ message: "No se actualizó" });
                        }
                    }
                );
            }
        } else {
            return res
                .status(403)
                .send({ message: "ID de plan de viaje no existente" });
        }
    });
}

function removeTrip(req, res) {
    let tripId = req.params.idT;

    Trip.findById(tripId, (err, tripFinded) => {
        if (err) {
            return res.status(500).send({ message: "Error al buscar plan de viaje" });
        } else if (tripFinded) {
            Trip.findByIdAndRemove(tripId, (err, tripRemoved) => {
                if (err) {
                    return res
                        .status(500)
                        .send({ message: "Error al intentar eliminar" });
                } else if (tripRemoved) {
                    return res.send({ message: "Se eliminó exitosamente" });
                } else {
                    return res.status(404).send({ message: "No se eliminó" });
                }
            });
        } else {
            return res.status(403).send({
                message: "ID de plan de viaje no existente o ya fue eliminado",
            });
        }
    });
}

function removeTouristPlaceTrip(req, res) {
    let tripId = req.params.idT;
    let touristPlaceId = req.params.idTP;

    Trip.findOneAndUpdate({ _id: tripId, tourists_places: touristPlaceId }, { $pull: { tourists_places: touristPlaceId } }, { new: true },
        (err, tripPulled) => {
            if (err) {
                return res.status(500).send({
                    message: "Error al eliminar lugar turístico del plan de viaje",
                });
            } else if (tripPulled) {
                return res.send({
                    message: "Se eliminó exitosamente del plan de viaje",
                });
            } else {
                return res.status(403).send({
                    message: "El lugar turístico no existe en el plan de viaje o ya fue eliminado",
                });
            }
        }
    );
}

function removeTouristGuide(req, res) {
    let guideId = req.params.idG;
    let tripId = req.params.idT;

    Trip.findOneAndUpdate({ _id: tripId, tourists_guide: guideId }, { $pull: { tourists_guide: guideId } }, { new: true },
        (err, tripPulled) => {
            if (err) {
                return res.status(500).send({
                    message: "Error al eliminar guía turístico del plan de viaje",
                });
            } else if (tripPulled) {
                return res.send({
                    message: "Se eliminó exitosamente del plan de viaje",
                });
            } else {
                return res.status(403).send({
                    message: "El guía turístico no existe en el plan de viaje o ya fue eliminado",
                });
            }
        }
    );
}

function getTrips(req, res) {
    Trip.find({})
        .populate("tourists_places")
        .populate("tourists_guide")
        .exec((err, trips) => {
            if (err) {
                return res.status(500).send({
                    ok: false,
                    message: "Error general al buscar planes de viaje",
                });
            } else if (trips) {
                return res.send({ message: "Planes de viaje:", trips });
            } else {
                return res.status(403).send({ message: "No hay registros" });
            }
        });
}

function getTrip(req, res) {
    let idTrip = req.params.idT;

    if (!idTrip) {
        return res.status(500).send({
            ok: false,
            message: "Ingrese los parametros necesarios",
        });
    } else {
        Trip.findById(idTrip, (err, trip) => {
                if (err) {
                    return res.status(500).send({
                        ok: false,
                        message: "Error general al buscar planes de viaje",
                    });
                } else if (trip) {
                    return res.json({ ok: true, message: "Viaje encontrado", trip });
                } else {
                    return res.json({
                        ok: false,
                        message: "No se pudo encontrar el viaje",
                    });
                }
            })
            .populate("tourists_places")
            .populate("tourists_guide");
    }
}

module.exports = {
    createTrip,
    addTouristPlaceTrip,
    updateTrip,
    removeTrip,
    addTouristsGuides,
    removeTouristPlaceTrip,
    removeTouristGuide,
    getTrips,
    getTrip,
};