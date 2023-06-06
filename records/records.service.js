const {knex} = require("../database/db-connection");

const getUserRecords = async (username, perPage, currentPage) => {
  const userRecords = await knex('record as r')
    .join('user as u', 'u.id', 'r.user_id')
    .join('operation as o', 'o.id', 'r.operation_id')
    .select('r.*', 'u.username', 'o.type')
    .where({username, 'r.deleted_at': null, 'u.deleted_at': null, 'o.deleted_at': null})
    .orderBy('r.date')
    .paginate({perPage, currentPage, isLengthAware: true})
  return userRecords
}

const removeRecord = async (recordId) => {
  await knex('record').where({id: recordId}).update({deleted_at: new Date()}).returning('*')
}

module.exports = {
  getUserRecords,
  removeRecord
}