const mongoose = require('mongoose');

const categoriaSchema = new mongoose.Schema({
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
        atletas : Array

});

const Categoria = mongoose.model('Categoria', categoriaSchema);

module.exports = Categoria;