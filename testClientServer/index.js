const express = require("express");
require("dotenv").config();
const cors = require("cors");
const cluster = require("cluster");
const os = require("os");

const routes = require("./routes");
const { dbService, redisService } = require("./services");

const PORT = process.env.PORT;
const cpuAmount = os.cpus().length;

if (cluster.isPrimary) {
  if (cpuAmount > 4) {
    for (let i = 0; i < 4; ++i) {
      cluster.fork();
    }
  } else {
    for (let i = 0; i < cpuAmount.length - 1; ++i) {
      cluster.fork();
    }
  }
  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  const app = express();
  // setup CORS
  app.use(cors({ credentials: true, origin: true }));

  app.use(express.json());
  app.use(routes);

  const server = app.listen(PORT, () => {
    console.log(`TestClient app listening on port ${PORT}`);
    dbService.connectDb();
    redisService.connectRedis();
    console.log(`pid: ${process.pid}(worker)`);
  });

  // 생각
  const exitHandler = () => {
    if (server) {
      server.close(() => {
        console.log("Server closed");
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  };

  const unexpectedErrorHandler = (error) => {
    exitHandler();
    console.log(error);
  };

  process.on("uncaughtException", unexpectedErrorHandler);
  process.on("unhandledRejection", unexpectedErrorHandler);

  process.on("SIGTERM", async () => {
    console.log("SIGTERM received");
    if (server) {
      dbService.destroyDb();
      redisService.disconnectRedis();
      await redisService.deleteWorkingPid();
      server.close();
    }
  });

  process.on("beforeExit", async () => {
    dbService.destroyDb();
    // pid 삭제
    await redisService.deleteWorkingPid();
    await redisService.disconnectRedis();
  });
}
