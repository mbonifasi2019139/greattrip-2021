"use strict"

var TypeOfTrip = require("../models/typeoftrip-model");

function createType(nameT){
    var type = new TypeOfTrip();
    TypeOfTrip.findOne({name: nameT},(err,typefinded)=>{
        if(err){
            console.log(err);
        }else if(typefinded){
            console.log("Ya existe el tipo");
        }else{
            type.name = nameT;
            type.save((err)=>{
            if(err){
                console.log(err);
            }
            });
        }
    })
}

function createTypesTrip(){
    createType("Great Trip");
    createType("Agencia");
    createType("Guía");
    createType("Personalizado");
}

module.exports = {
    createTypesTrip
}