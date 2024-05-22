const {Schema} = require('mongoose');
const {dbevento} = require('../config/database.js');

const categoriaSchema = new Schema({
        idUsuario         : String,
        idEvento          : String,
        descricao         : String,
        idade             : Number,
        regra             : String,
        valorInscricao    : Number,
        qtdAtletasBateria : Number,
        qtdAtletas        : Number,
        qtdOndaSurfada    : Number,
        tempoBateria      : Number,
        bateriasGerada    : Boolean,
        sexo: String,
        atletas : Array,
        cores: Array
});

const Categoria = dbevento.model('Categoria', categoriaSchema);

module.exports = Categoria;