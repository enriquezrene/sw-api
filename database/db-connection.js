const config = require("../knexfile");
const environment = process.env.ENVIRONMENT || 'development'
const knex = require('knex')({
  ...config[environment]
});

const { attachPaginate } = require('knex-paginate');
attachPaginate()

module.exports = {
  knex
}
