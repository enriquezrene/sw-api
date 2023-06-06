const {knex} = require("../database/db-connection");

const performOperation = async (operationName, username) => {
  const trx = await knex.transaction()
  try {
    const operationPerformed = await knex('operation').select().where({
      type: operationName,
      deleted_at: null
    }).transacting(trx).first()
    const userPerformingOperations = await knex('user').select().where({
      username,
      deleted_at: null,
      status: 'active'
    }).transacting(trx).first()
    const userBalance = userPerformingOperations.balance - operationPerformed.cost;
    if (userPerformingOperations.balance < operationPerformed.cost) {
      throw new Error('User does not have enough credit to perform this operation')
    }
    await knex('user').where({id: userPerformingOperations.id}).update({balance: userBalance}).transacting(trx)
    const result = await knex('record').insert({
      operation_id: operationPerformed.id, user_id: userPerformingOperations.id,
      amount: operationPerformed.cost,
      user_balance: userBalance,
      date: new Date()
    }).transacting(trx).returning("*")
    await trx.commit()
    return result
  } catch (e) {
    trx.rollback()
    throw  e
  }

}

module.exports = {
  performOperation
}