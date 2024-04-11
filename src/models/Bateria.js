const mongoose = require('mongoose');

const atletaSchema = new mongoose.Schema({

       idEvento     : String,
       idCategoria  : String,
       sequencia    : Number,
       descricao    : String,
       round        : String,
       status       : String,
       avanca       : Number,
   

})

const Atleta = mongoose.model('Atleta', atletaSchema);

module.exports = Atleta;