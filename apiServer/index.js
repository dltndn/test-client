const express = require('express')
const app = express()

require("dotenv").config();

const routes = require('./routeManager')
const dbManager = require('./dbManager')

const PORT = process.env.PORT

const server = app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
    dbManager.connect()
  })

  app.use(routes)
  app.use(express.json());
  // 생각
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
    };
  
  process.on('uncaughtException', unexpectedErrorHandler);
  process.on('unhandledRejection', unexpectedErrorHandler);
  
  process.on('SIGTERM', async () => {
    console.log('SIGTERM received');
    if (server) {
        dbManager.destroy()
      server.close();
    }
  });