"use strict";

var TouristPlace = require("../models/tourist-place-model");
let Trip = require("./../models/trip-model");

function addTouristPlace(req, res) {
    var params = req.body;
    var touristPlace = new TouristPlace();

    if (params.name && params.description && params.country && params.address) {
        TouristPlace.findOne({ address: params.address }, (err, tpFinded) => {
            if (err) {
                return res
                    .status(500)
                    .send({ message: "Error general en el servidor" });
            } else if (tpFinded) {
                return res.send({ message: "El lugar turístico ya existe" });
            } else {
                touristPlace.name = params.name;
                touristPlace.description = params.description;
                touristPlace.country = params.country;
                touristPlace.address = params.address;
                touristPlace.save((err, tpSaved) => {
                    if (err) {
                        return res
                            .status(500)
                            .send({ message: "Error general en el servidor" });
                    } else if (tpSaved) {
                        return res.send({
                            message: "Lugar turístico agregado exitosamente",
                            tpSaved,
                        });
                    } else {
                        return res
                            .status(404)
                            .send({ message: "No se guardó el lugar turístico" });
                    }
                });
            }
        });
    } else {
        return res.status(403).send({ message: "Ingrese los datos mínimos" });
    }
}

function addImagesTouristPlace(req, res) {
    var touristPlaceId = req.params.id;
    var params = req.body;

    TouristPlace.findById(touristPlaceId, (err, tpFinded) => {
        if (err) {
            return res.status(500).send({ message: "Error general en el servidor" });
        } else if (tpFinded) {
            if (params.urlsImages) {
                var validation = true;
                tpFinded.urlsImages.forEach((element) => {
                    if (params.urlsImages == element) {
                        validation = false;
                    }
                });
                if (validation == true) {
                    TouristPlace.findByIdAndUpdate(
                        touristPlaceId, { $push: { urlsImages: params.urlsImages } }, { new: true },
                        (err, imagePushed) => {
                            if (err) {
                                return res
                                    .status(500)
                                    .send({ message: "Error general en el servidor" });
                            } else if (imagePushed) {
                                return res.send({ message: "Imagen cargada exitosamente" });
                            } else {
                                return res
                                    .status(404)
                                    .send({ message: "Error al cargar imagen" });
                            }
                        }
                    );
                } else {
                    return res
                        .status(403)
                        .send({ message: "URL de imagen ya existente en el lugar" });
                }
            } else {
                return res.status(403).send({ message: "Inserte la URL de la imagen" });
            }
        } else {
            return res
                .status(403)
                .send({ message: "ID de lugar turístico no existente" });
        }
    });
}

function updateTouristPlace(req, res) {
    let touristPlaceId = req.params.id;
    let update = req.body;

    TouristPlace.findOne({ address: update.address }, (err, tpFinded) => {
        if (err) {
            return res
                .status(500)
                .send({ message: "Error al buscar lugar turístico" });
        } else if (tpFinded) {
            return res.send({ message: "Dirección de lugar ya existente" });
        } else {
            TouristPlace.findById(touristPlaceId, (err, tpFinded) => {
                if (err) {
                    return res
                        .status(500)
                        .send({ message: "Error general en el servidor" });
                } else if (tpFinded) {
                    TouristPlace.findByIdAndUpdate(
                        touristPlaceId,
                        update, { new: true },
                        (err, tpUpdated) => {
                            if (err) {
                                return res
                                    .status(500)
                                    .send({ message: "Error en el servidor al actualizar" });
                            } else if (tpUpdated) {
                                return res.send({
                                    message: "Lugar turístico actualizado exitosamente",
                                    tpUpdated,
                                });
                            } else {
                                return res.status(404).send({ message: "No se actualizó" });
                            }
                        }
                    );
                } else {
                    return res
                        .status(403)
                        .send({ message: "ID de lugar turística no existente" });
                }
            });
        }
    });
}

function removeTouristPlace(req, res) {
    let touristPlaceId = req.params.id;

    TouristPlace.findById(touristPlaceId, (err, tpFinded) => {
        if (err) {
            return res
                .status(500)
                .send({ message: "Error en el servidor al buscar" });
        } else if (tpFinded) {
            TouristPlace.findByIdAndRemove(touristPlaceId, (err, tpRemoved) => {
                if (err) {
                    return res.status(500).send({ message: "Error general al eliminar" });
                } else if (tpRemoved) {
                    return res.send({
                        message: "Lugar turístico eliminado exitosamente",
                    });
                } else {
                    return res.status(404).send({ message: "No se eliminó" });
                }
            });
        } else {
            return res.status(403).send({
                message: "ID de lugar turístico no existente o ya fue eliminado",
            });
        }
    });
}

function getTouristPlaces(req, res) {
    TouristPlace.find({}).exec((err, touristplaces) => {
        if (err) {
            return res
                .status(500)
                .send({ message: "Error al buscar lugares turísticos" });
        } else if (touristplaces) {
            return res.send({ message: "Lugares turísticos", touristplaces });
        } else {
            return res.status(404).send({ message: "No hay lugares turísticos" });
        }
    });
}

function getTouristPlace(req, res) {
    let idTP = req.params.idTU;

    if (!idTP) {
        return res.json({
            ok: false,
            message: "Ingrese el id del lugar turistico",
        });
    } else {
        TouristPlace.findById(idTP, (err, tpFound) => {
            if (err) {
                return res.status(500).send({ ok: false, message: "Error general" });
            } else if (tpFound) {
                return res.json({ ok: true, tpFound });
            } else {
                return res.json({
                    ok: false,
                    message: "No se encontro el lugar turistico",
                });
            }
        });
    }
}

function addReview(req, res) {
    let userId = "606bc663f76f32233c5a0b65"; //req.user.sub
    let touristPlaceId = req.params.id;
    var params = req.body;

    TouristPlace.findById(touristPlaceId, (err, tpFinded) => {
        if (err) {
            return res
                .status(500)
                .send({ message: "Error en el servidor al buscar" });
        } else if (tpFinded) {
            if (params.review) {
                TouristPlace.findByIdAndUpdate(
                    touristPlaceId, { $push: { reviews: { userId: userId, review: params.review } } }, { new: true },
                    (err, reviewAdded) => {
                        if (err) {
                            return res
                                .status(500)
                                .send({ message: "Error al agregar comentario" });
                        } else if (reviewAdded) {
                            return res.send({ message: "Comentario agregado exitosamente" });
                        } else {
                            return res
                                .status(404)
                                .send({ message: "No se agregó el comentario" });
                        }
                    }
                );
            } else {
                return res.status(403).send({ message: "Ingrese algún comentario" });
            }
        } else {
            return res
                .status(403)
                .send({ message: "ID de lugar turístico no existente" });
        }
    });
}

function getLngLatTPByTripID(req, res) {
    let tripId = req.params.idT;

    if (tripId) {
        Trip.findById(tripId, (err, trip) => {
            if (err) {
                return res.status(500).send({ ok: false, message: "Error general" });
            } else if (trip) {
                let lngLat = [];

                for (const tP of trip.tourists_places) {
                    lngLat.push(tP.address);
                }

                return res.json({ ok: true, message: "lnt y lat", lngLat });
                // console.log(trip.tourists_places);
            } else {
                return res.json({ ok: false, message: "NO se encontro el viaje" });
            }
        }).populate("tourists_places");
    } else {
        return res.json({ ok: false, message: "ingrese el id del viaje" });
    }
}

module.exports = {
    addTouristPlace,
    addImagesTouristPlace,
    updateTouristPlace,
    removeTouristPlace,
    getTouristPlaces,
    getTouristPlace,
    addReview,
    getLngLatTPByTripID,
};