// Importando arquivo de configuração do banco de dados
const config = require("../knexfile.js");

// Instanciando o knex
const knex = require("knex")(config);

// Exportando o knex
module.exports = knex