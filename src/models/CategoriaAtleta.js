const {Schema} = require('mongoose');
const {dbevento} = require('../config/database.js');

const categoriaAtletaSchema = new Schema({
        idCategoria       : String,
        idAtleta          : String,
        confirmado        : Boolean,
        dataHora          : Date

});

const CategoriaAtleta = dbevento.model('CategoriaAtleta', categoriaAtletaSchema);

module.exports = CategoriaAtleta;