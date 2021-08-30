
// Middleware que interpreta o body da requisição, e injeta na variável req.body
const bodyParser = require("body-parser");

// Cross-Origin Resource Sharing (CORS) middleware para controlar o bloqueio/desbloqueio da execução de código javascript em navegadores.
const cors = require("cors");

// O módulo exporta uma função cujo parâmetro passado (app) é a instância do Express.
module.exports = app => {

    // Aplicando o uso do bodyParses e do CORS na instância do Express
    app.use(bodyParser.json());
    app.use(cors())
    
}