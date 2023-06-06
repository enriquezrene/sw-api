const {getUserInfo, addUser, login} = require("../users.service");
const {faker} = require('@faker-js/faker');

describe('Users service', function () {

  const existingUser = {
    username: 'a@foo.com',
    password: '1234567890'
  }

  it('Find user information give its email', async () => {
    const userInfo = await getUserInfo(existingUser.username)
    expect(userInfo).toEqual(expect.objectContaining({...existingUser, status: 'active'}))
  })

  it('login with email and password returns a token', async () => {
    const token = await login(existingUser.username, existingUser.password)
    expect(token).toBeDefined()

  })

  it('login fails when email is not correct', async () => {
    await expect(login(faker.string.uuid(), existingUser.password)).rejects.toThrow(Error)
  })

  it('inactive users can not login', async () => {
    await expect(login('wrong@foo.com', existingUser.password)).rejects.toThrow(Error)
  })

});
