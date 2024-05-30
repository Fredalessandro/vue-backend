const {Schema} = require('mongoose');
const {dbevento} = require('../config/database.js');

const eventoSchema = new Schema({
        idUsuario : String,
        evento    : String,
        local     : String,
        dataInicio: Date,
        dataFinal : Date,
        status    : String,
        valorInscricao    : String,
        qtdAtletasBateria : Number,
        qtdOndaSurfada    : Number,
        mediaAtletasCategorias : Number,
        tempoBateria      : Number,
        masculino         : Boolean,
        feminino          : Boolean,
        gerarCategorias   : Boolean,
        cores: Array,
        
});

const Evento = dbevento.model('Evento', eventoSchema);

module.exports = Evento;