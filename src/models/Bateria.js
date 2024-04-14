const mongoose = require('mongoose');

const bateriaSchema = new mongoose.Schema({

       idEvento     : String,
       idCategoria  : String,
       sequencia    : Number,
       descricao    : String,
       seqBateria   : Number,
       round        : String,
       seqRound     : Number,
       status       : String,
       avanca       : Number,
       dataHoraInicio    : Date,
       dataHoraFinal     : Date,
   

})

const Bateria = mongoose.model('Bateria', bateriaSchema);

module.exports = Bateria;