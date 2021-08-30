
// Instanciamento do framework Express JS
const app = require("express")();

// Instanciando o Consign, biblioteca que carrega automaticamente os arquivos de dependências
const consign = require("consign");

// Declarando constante que recebe o Knex configurado, e aplicando na instância do Express para uso.
const db = require("./config/db");
app.db = db;

// Injetando os arquivos de dependências
consign()
    .include("./config/passport.js")
    .then("./config/middlewares.js")    // CORS e bodyParser
    .then("./api/validation.js")        // Validações
    .then("./api")                      // API's
    .then("./config/routes.js")         // Rotas
    .into(app);


// Inicializando o serviço do backend
app.listen(3000, () => {
    console.log("Escutando o backend...");
})