const {knex} = require("../database/db-connection");
const {getJsonWebToken} = require("../security/auth.service");


getUserInfo = async (username) => {
  const userInfo = await knex.select().from("user").where({username, deleted_at: null}).first()
  return userInfo
}

addUser = async ({username, password, balance}) => {
  return await knex('user')
    .insert({username, password, balance, status: 'active'})
    .returning('*')
}

login = async (username, password) => {
  const userInfo = await knex.select().from("user")
  .where({
    username,
    password,
    status: 'active',
    deleted_at: null
  })
  .first()
  if (!userInfo) {
    throw new Error('Login failed')
  }
  return getJsonWebToken(username)
}

module.exports = {
  getUserInfo,
  addUser,
  login
}