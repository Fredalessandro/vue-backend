const mongoose = require('mongoose');
// Conexão para o banco de dados de eventos
const uri = "mongodb+srv://fredalessandro:NcU8IhpTi2GFEXk1@cluster0.be1hs6p.mongodb.net/dbEvents?retryWrites=true&w=majority&appName=Cluster0";
//const uri = "mongodb://localhost:27017/";
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
const dbevento = mongoose.createConnection(uri,clientOptions);

/*try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    dbevento.db.admin().command({ ping: 1 }).then(()=>{
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }).catch((error)=>{
        console.error(error, error.message);
    });
    
  } finally {
    // Ensures that the client will close when you finish/error
    mongoose.disconnect().then(()=>{
        console.log("Disconnect to MongoDB!");
    });
  }*/
module.exports = { dbevento };