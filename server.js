const express = require('express');
const mongoose = require('mongoose');
const graphqlHTTP = require('express-graphql');
const bodyParser = require('body-parser');
const schema = require('./schema/graphql/schema.graphql');
const resolvers = require('./resolvers/index');
const Authorization = require("./middlewares/Authorization");

// creation de l'application express
let app = express();

app.use(Authorization);
app.use(bodyParser.json());
app.use('/api', graphqlHTTP({
    schema: schema,
    rootValue: resolvers,
    graphiql: true 
}))

// // création de la connection mongodb
mongoose.connect("mongodb://localhost:27017/gestion_de_conge",{useNewUrlParser: true ,useUnifiedTopology: true} )
    .then(r => console.log("démarrage du serveur MongoDB..." ))
    .catch(err => console.log("Erreur de connection à la base de donné mongodb"));

// lancement du serveur express
app.listen(process.env.PORT | 8888 , (err) => {
    if(err){
        console.log("impossible de démarrer le serveur")
        throw new Error(err)
    }
    console.log("Démarrage du serveur sur le port " + 8888 + ".....");
})