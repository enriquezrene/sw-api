const {randomString} = require("../operations")


test("Generates a random string with 30 characters", async () => {
  const result = await randomString()
  expect(result).toHaveLength(30)
})