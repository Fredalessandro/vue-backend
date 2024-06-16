const {Schema} = require('mongoose');
const {dbevento} = require('../config/database.js');

const bateriaSchema = new Schema({

       idEvento     : String,
       idCategoria  : String,
       sequencia    : Number,
       descricao    : String,
       seqBateria   : Number,
       round        : String,
       seqRound     : Number,
       status       : String,
       avanca       : Number,
       qtdAtletas   : Number,
       dataHoraInicio    : Date,
       dataHoraFinal     : Date,
       atletas : Array,
   
})

const Bateria = dbevento.model('Bateria', bateriaSchema);

module.exports = Bateria;