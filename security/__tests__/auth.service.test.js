const {validateToken, getJsonWebToken} = require("../auth.service");

test('If token correct, token is unsigned', () => {
  const username = 'foo@bar.com'
  const token = getJsonWebToken(username)
  expect(validateToken(token)).toBeDefined()
})

test('If token incorrect, an error is thrown', () => {
  expect(() => validateToken('invalid-token')).toThrow(Error)
})