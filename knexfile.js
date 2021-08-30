// Configurações de conexão do knex
const { conn } = require("./.env");

module.exports = {

  client: 'mysql',
  
  // Por questões de segurança, esse objeto deve ser importado do arquivo de variáveis de ambiente
  connection: conn,
  
  pool: {
    min: 2,
    max: 10
  },
  
  migrations: {
    tableName: 'knex_migrations'
  }

};
