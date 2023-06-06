<!--
title: 'Serverless Framework Node Express API on AWS'
description: 'This template demonstrates how to develop and deploy a simple Node Express API running on AWS Lambda using the traditional Serverless Framework.'
layout: Doc
framework: v3
platform: AWS
language: nodeJS
priority: 1
authorLink: 'https://github.com/serverless'
authorName: 'Serverless, inc.'
authorAvatar: 'https://avatars1.githubusercontent.com/u/13742415?s=200&v=4'
-->
# Getting the env ready
Make sure you have installed docker-compose
1. Run the db
```ssh
docker-compose up postgres postgres-test
```

2. Make sure you have installed node 18.15.0
If you don't please follow this link http://nvm.sh/


3. Install the dependencies
```sh
yarn install
```

4. Create a database named `challenge` using any database client

5. Rename the existing .env.example file as .env and replace the values with the correct ones
JWT_SECRET=<feel free to use any long random string here>
DB_USER=<see docker compose>
DB_PASSWORD=<see docker compose>
DB_HOST=localhost
DB_PORT=5432
DB_PORT_TEST=5433
DB_NAME=challenge

 
5. Get the db ready
```ssh
yarn prepare:dev
```

6. Run the app locally
```sh
serverless offline
```

7. Play with the API
There are 3 users you can play with

a@foo.com / 1234567890 has a balance=999999999
user-no-balance@foo.com / 1234567890 has no balance, so he can login but you can not perform any operation
wrong@foo.com / 1234567890 has balance but it is inactive so you can not really use it

## Grab a token
```sh
curl --location 'http://localhost:3000/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "username": "<username>",
    "password":"<pwd>"
}'
```

## Perform operations
```sh
curl --location 'http://localhost:3000/operations' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <USE YOUR TOKEN HERE>' \
--data '{
    "operation": "<OperationName>",
    "params": {
        "a":###,
        "b":###
    }
}'
```

The operations and costs in the db are:
```json    
    {type: 'sum', cost: 10},
    {type: 'subtract', cost: 11},
    {type: 'multiply', cost: 12},
    {type: 'divide', cost: 13},
    {type: 'squareRoot', cost: 14},
    {type: 'randomString', cost: 15}, 
```

and params `a` and `b` must be numbers

If you want to play with the app in production please use this URL https://azx2495nd9.execute-api.us-east-1.amazonaws.com

## Query user records
```sh
curl --location 'http://localhost:3000/records?page=1&items=5' \
--header 'Authorization: Bearer <USE YOUR TOKEN HERE>' \
--data ''
```

8. Unit tests
All tests are written in jest, to make them run 
```sh
yarn test
```



# Serverless Framework Node Express API on AWS

This template demonstrates how to develop and deploy a simple Node Express API service running on AWS Lambda using the traditional Serverless Framework.

## Anatomy of the template

This template configures a single function, `api`, which is responsible for handling all incoming requests thanks to the `httpApi` event. To learn more about `httpApi` event configuration options, please refer to [httpApi event docs](https://www.serverless.com/framework/docs/providers/aws/events/http-api/). As the event is configured in a way to accept all incoming requests, `express` framework is responsible for routing and handling requests internally. Implementation takes advantage of `serverless-http` package, which allows you to wrap existing `express` applications. To learn more about `serverless-http`, please refer to corresponding [GitHub repository](https://github.com/dougmoscrop/serverless-http).

## Usage

### Deployment

Install dependencies with:

```
npm install
```

and then deploy with:

```
serverless deploy
```

After running deploy, you should see output similar to:

```bash
Deploying aws-node-express-api-project to stage dev (us-east-1)

✔ Service deployed to stack aws-node-express-api-project-dev (196s)

endpoint: ANY - https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com
functions:
  api: aws-node-express-api-project-dev-api (766 kB)
```

_Note_: In current form, after deployment, your API is public and can be invoked by anyone. For production deployments, you might want to configure an authorizer. For details on how to do that, refer to [`httpApi` event docs](https://www.serverless.com/framework/docs/providers/aws/events/http-api/).

### Invocation

After successful deployment, you can call the created application via HTTP:

```bash
curl https://xxxxxxx.execute-api.us-east-1.amazonaws.com/
```

Which should result in the following response:

```
{"message":"Hello from root!"}
```

Calling the `/hello` path with:

```bash
curl https://xxxxxxx.execute-api.us-east-1.amazonaws.com/hello
```

Should result in the following response:

```bash
{"message":"Hello from path!"}
```

If you try to invoke a path or method that does not have a configured handler, e.g. with:

```bash
curl https://xxxxxxx.execute-api.us-east-1.amazonaws.com/nonexistent
```

You should receive the following response:

```bash
{"error":"Not Found"}
```

### Local development

It is also possible to emulate API Gateway and Lambda locally by using `serverless-offline` plugin. In order to do that, execute the following command:

```bash
serverless plugin install -n serverless-offline
```

It will add the `serverless-offline` plugin to `devDependencies` in `package.json` file as well as will add it to `plugins` in `serverless.yml`.

After installation, you can start local emulation with:

```
serverless offline
```

To learn more about the capabilities of `serverless-offline`, please refer to its [GitHub repository](https://github.com/dherault/serverless-offline).


### Migrations
Create a new migration file

```sh
yarn knex migrate:make create_users_table
```