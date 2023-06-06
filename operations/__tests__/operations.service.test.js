const {randomString, performOperation} = require("../operations.service")
const {getUserInfo} = require("../../users/users.service");
const {knex} = require("../../database/db-connection");

describe('Performing operations upon user request', () => {

  let userPerformingOperations
  let operationPerformed

  beforeAll(async () => {
    userPerformingOperations = await getUserInfo('a@foo.com')
    await knex.delete().from('record').where({user_id: userPerformingOperations.id})
    operationPerformed = await knex.select().from('operation').where({type: 'sum'}).first()
    const record = await performOperation(operationPerformed.type, userPerformingOperations.username)
  })

  test('User balance is affected by operation cost', async () => {
    const userInfoAfterExecutingOperation = await getUserInfo('a@foo.com')
    expect(userInfoAfterExecutingOperation.balance).toEqual(userPerformingOperations.balance - operationPerformed.cost)
  })

  test('A new record is added', async () => {
    const recordAdded = await knex.select().from("record").where({
      user_id: userPerformingOperations.id,
      operation_id: operationPerformed.id
    }).first()
    expect(recordAdded).not.toBeUndefined()
  })

  test('If balance is not enough, operation can not be performed', async () => {
    await expect(performOperation(operationPerformed.type, 'user-no-balance@foo.com')).rejects.toThrow(Error)
  })
})