const {Schema} = require('mongoose');
const {dbevento} = require('../config/database.js');

const atletaSchema = new Schema({
       idEvento: String,
       nome    : String,
       apelidio: String,
       email   : String,
       telefone: String,
       cpf     : String,
       dataNascimento: Date,
       cep     : String,
       endereco: String,
       numero  : String,
       complemento: String,
       bairro  : String,
       cidade  : String,
       uf      : String,
       rankNordestino: Number,
       rankEstadual: Number,
       idadeAno: Number,
       cabecaChave: Boolean,
       profissional: Boolean,
       isento: Boolean,
       sexo: String
})
  
const Atleta = dbevento.model('Atleta', atletaSchema);

module.exports = Atleta;