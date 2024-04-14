const mongoose = require('mongoose');

const eventoSchema = new mongoose.Schema({
        idUsuario : String,
        evento    : String,
        local     : String,
        dataInicio: Date,
        dataFinal : Date,
        status    : String,
        valorInscricao    : Number,
        qtdAtletasBateria : Number,
        qtdOndaSurfada    : Number,
        tempoBateria      : Number
});

const Evento = mongoose.model('Evento', eventoSchema);

module.exports = Evento;