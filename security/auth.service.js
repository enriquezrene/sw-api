const jsonwebtoken = require("jsonwebtoken");
require('dotenv').config()

const JWT_SECRET = process.env.JWT_SECRET || ''

const validateToken = (token) => {
  return jsonwebtoken.verify(token, JWT_SECRET);
}

const getJsonWebToken = (username) => {
  return jsonwebtoken.sign({username}, JWT_SECRET)
}


module.exports = {
  validateToken,
  getJsonWebToken
}