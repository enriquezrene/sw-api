const serverless = require("serverless-http");
const express = require("express");
const {knex} = require("./database/db-connection");
const {performOperation} = require("./operations/operations.service");
const {sum, randomString, squareRoot, divide, multiply, subtract} = require("./operations/operations");
const {login, getUserInfo} = require("./users/users.service");
const {getUserRecords, removeRecord} = require("./records/records.service");
const {validateToken} = require("./security/auth.service");
const cors = require('cors')
const app = express();

var corsOptions = {
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 200
}

app.options('*', cors(corsOptions))

app.use(function (req, res, next) {
  const bearerToken = req['apiGateway']['event']['headers']['authorization'] ?? req['apiGateway']['event']['headers']['Authorization']
  const isUserRequestingToLogin = req['apiGateway']['event']['requestContext']['http']['path'] === '/login'
  if (isUserRequestingToLogin) {
    next()
    return
  }
  if (bearerToken) {
    try {
      const user = validateToken(bearerToken.replace('Bearer ', ''))
      req.user = user
      next()
    } catch (e) {
      return res.status(401).json({
        message: 'Invalid Credentials'
      });
    }
  } else {
    return res.status(401).json({
      message: 'Not Authenticated'
    });
  }
})
;

const operationsByName = new Map()
operationsByName.set('sum', sum)
operationsByName.set('subtract', subtract)
operationsByName.set('multiply', multiply)
operationsByName.set('divide', divide)
operationsByName.set('squareRoot', squareRoot)
operationsByName.set('randomString', randomString)

const getRequestBody = (request) => {
  return JSON.parse(request['apiGateway']['event']['body'])
}

const getQueryParams = (request) => {
  return request['apiGateway']['event']['queryStringParameters']
}

app.post("/operations", async (req, res, next) => {
  const requestBody = getRequestBody(req)
  const paramA = Number(requestBody.params['a'])
  const paramB = Number(requestBody.params['b'])
  if (operationsByName.has(requestBody.operation)) {
    let record
    try {
      record = await performOperation(requestBody.operation, req.user.username)
    } catch (e) {
      return res.status(500).json({
        message: e.message,
      });
    }
    const operationToExecute = operationsByName.get(requestBody.operation)
    const result = await eval(operationToExecute)(paramA, paramB)
    await knex.from('record').update({operation_response: result}).where({id: record[0].id})
    return res.status(200).json({
      result
    });
  } else {
    return res.status(400).json({
      message: `Operation not supported: ${requestBody.operation}`,
    });
  }
});

app.post("/login", cors(corsOptions), async (req, res, next) => {
  const requestBody = getRequestBody(req)
  try {
    const token = await login(requestBody.username, requestBody.password)
    return res.status(200).json({token});
  } catch (e) {
    return res.status(400).json({message: e.message});
  }
});

app.get("/profile", async (req, res, next) => {
  const user = await getUserInfo(req.user.username)
  if (user) {
    return res.status(200).json({
      user,
    });
  } else {
    return res.status(404).json({
      message: `User not found: ${queryParams['username']}`,
    });
  }
});

app.get("/records", async (req, res, next) => {
  const queryParams = getQueryParams(req) || {}
  const itemsPerPage = Number(queryParams['items'] || 10)
  const currentPage = Number(queryParams['page'] || 1)
  const username = req.user.username
  const records = await getUserRecords(username, itemsPerPage, currentPage)
  return res.status(200).json({
    records,
  });
});

app.delete("/records", async (req, res, next) => {
  const queryParams = getQueryParams(req) || {}
  const recordId = queryParams['recordId']
  if(recordId){
    await removeRecord(recordId)
    return res.status(200).json({
      message: 'OK',
    });  
  }
  return res.status(200).json({
    message: 'Please provide a recordId',
  })
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports.handler = serverless(app);
