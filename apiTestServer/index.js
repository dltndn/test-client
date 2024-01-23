const express = require('express')
const { runTest } = require('./controller/runTest.controller')
const app = express()
const cron = require('node-cron');
const port = 8081

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
  
  cron.schedule('*/2 * * * * *', () => {
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