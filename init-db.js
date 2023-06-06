require('dotenv').config()
const config = require("./knexfile");
const environment = process.env.ENVIRONMENT || 'development'
const configToCreateDb = {...config[environment] }
delete configToCreateDb.connection.database
const databaseName = 'challenge'
console.log(configToCreateDb)
async function main() {
  const knex = require('knex')({
    client: 'pg',
    connection: {
      host: 'localhost',
      user: 'user',
      password: 'pass'
    }
  });
  console.log(knex.fromRaw, 'knex')
  await knex.raw('CREATE DATABASE IF NOT EXISTS ??', databaseName)
}

main().catch(console.log).then(process.exit)