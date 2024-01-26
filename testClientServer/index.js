const express = require('express')
require("dotenv").config();
const cors = require('cors'); 
const app = express()

const routes = require("./routes")
const { dbService, redisService } = require("./services")

const PORT = process.env.PORT

// setup CORS
app.use(cors({ credentials: true, origin: true }));

app.use(express.json());
app.use(routes)

const server = app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
  dbService.connectDb()
  redisService.connectRedis()
  console.log(`pid: ${process.pid}`)
})

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
    console.log(error)
  };

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', async () => {
  console.log('SIGTERM received');
  if (server) {
    dbService.destroyDb();
    redisService.disconnectRedis()
    server.close();
  }
});

process.on('beforeExit', async () => {
  dbService.destroyDb();
  // pid 삭제
  await redisService.disconnectRedis()
});