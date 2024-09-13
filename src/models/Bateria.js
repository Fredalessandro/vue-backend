const {Schema} = require('mongoose');
const {dbevento} = require('../config/database.js');

const bateriaSchema = new Schema({

       idEvento     : String,
       idCategoria  : String,
       fase         : Number,
       bateria      : Number,
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
       finalizada   : Boolean,
       atletas : Array,
       notas :  Array
   
})
const Nota = {idAtleta: String, idJuiz: String, idNota: Number, nota: Number, interencia: Boolean, bloqueio: Boolean}

const Bateria = dbevento.model('Bateria', bateriaSchema);

module.exports = Bateria;