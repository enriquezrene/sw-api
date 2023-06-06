sum = (a, b) => {
  return a + b
}

subtract = (a, b) => {
  return a - b
}

multiply = (a, b) => {
  return a * b
}

divide = (a, b) => {
  return a / b
}

squareRoot = (a) => {
  return Math.sqrt(a)
}

randomString = async () => {
  const response = await fetch("https://api.random.org/json-rpc/2/invoke", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(
      {
        "jsonrpc": "2.0",
        "method": "generateStrings",
        "params": {
          "apiKey": "0e4aa00a-9f53-43b1-925c-8a0050dbcadd",
          "n": 1,
          "length": 30,
          "characters": "abcdefghijklmnopqrstuvwxyz"
        }, "id": 1
      })
  })
  const body = await response.json();
  return body['result']['random']['data'][0]
}

module.exports = {
  sum, subtract, multiply, divide, squareRoot, randomString
}