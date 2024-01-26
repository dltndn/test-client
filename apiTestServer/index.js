const express = require('express')
const { runTest, test } = require('./controller/runTest.controller')
require("dotenv").config();
const app = express()
const cron = require('node-cron');
const port = 8081

const redisService = require('./service/redis.service')

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
  redisService.connectRedis()
  cron.schedule('*/1 * * * * *', () => {
    runTest()
  });
})

const exitHandler = () => {
    if (server) {
      server.close(() => {
        console.log('Server closed');
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  };
  
  const unexpectedErrorHandler = (error) => {
    exitHandler();
    console.log(error)
  };

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', async () => {
  console.log('SIGTERM received');
  if (server) {
    redisService.disconnectRedis()
    server.close();
  }
});