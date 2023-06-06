const {knex} = require("../../database/db-connection");
const {performOperation} = require("../../operations/operations.service");
const {getUserRecords, removeRecord} = require("../records.service");

describe('User records', () => {

  let userWithRecords
  const userWithRecordsEmail = 'a@foo.com'
  let userWithNoRecords


  beforeAll(async () => {
    userWithNoRecords = await knex('user').select().where({username: 'user-no-balance@foo.com'}).first()
    await knex.from('record').delete().where({user_id: userWithNoRecords['id']})

    userWithRecords = await knex('user').select().where({username: userWithRecordsEmail}).first()
    await knex.from('record').delete().where({user_id: userWithRecords['id']})

    await performOperation('sum', userWithRecordsEmail)
    await performOperation('subtract', userWithRecordsEmail)
    await performOperation('multiply', userWithRecordsEmail)
    await performOperation('divide', userWithRecordsEmail)
  })

  test('Find all user records', async () => {
    const userRecords = await getUserRecords(userWithRecordsEmail)
    expect(userRecords.data.length).toBeGreaterThanOrEqual(4)
  })

  test('Can paginate records', async () => {
    const perPage = 2
    const currentPage = 2
    const userRecords = await getUserRecords(userWithRecordsEmail, perPage, currentPage)
    expect(userRecords.data.length).toEqual(2)
    expect(userRecords.data[0].type).toEqual('multiply')
    expect(userRecords.data[1].type).toEqual('divide')
  })

  test('If records are removed, they do not appear in subsequent finds', async () => {
    const perPage = 2
    const currentPage = 2
    const userRecords = await getUserRecords(userWithRecordsEmail, perPage, currentPage)
    await removeRecord(userRecords.data[0].id)
    const userRecordsAfterRemoval = await getUserRecords(userWithRecordsEmail, perPage, currentPage)
    expect(userRecordsAfterRemoval.data[0].type).toEqual('divide')
  })

  test('If user does not have records, it returns an empty array', async () => {
    const userRecords = await getUserRecords(userWithNoRecords['username'])
    expect(userRecords.data).toHaveLength(0)
  })
})

