const redis = require("redis");

const MAX_REDIS_MEMORY = 30000000
const LIMIT_INDEX = 0.7

const EXIST_KEY = 'TestClient'
const TEST_TIME_KEY = 'TestTime'

const client = redis.createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

// redis 연결
const connectRedis = async () => {
  client.on("error", (err) => console.log("Redis Client Error", err));

  try {
    await client.connect();
    console.log("Redis connected");
  } catch (e) {
    console.error("Error connecting to Redis:", e);
  }
};

// redis 연결 해제
const disconnectRedis = async () => {
  try {
    await client.disconnect();
    console.log("Redis disconnected");
  } catch (e) {
    console.error("Error disconnecting from Redis:", e);
  }
};

// redis 저장 공간 확인
const isMemorySpaceAvailable = async () => {
    const memoryInfo = await client.info('memory');
    let usedMemory = memoryInfo.split('\n').find(line => line.startsWith('used_memory')).split(':')[1];
    if (Number(usedMemory) > MAX_REDIS_MEMORY * LIMIT_INDEX) return false
    return true
}

/**
 * @description - target_time 데이터 유무 확인
 * @returns - true || null
 */
const checkDataExists = async () => {
    return await client.get(EXIST_KEY)
}


// target_time 데이터 있음 표시
const setDataExists = async () => {
    try {
        await client.set(EXIST_KEY, "true");
        return true
    } catch (e) {
        console.log(e)
        return false
    }
}

/**
 * 
 * @description - target_time 데이터 등록
 * @param {*} targetTimeArr -
 * {
        score: targetTime;
        value: 'testCaseId:targetTime';
    } []
 * @returns bool
 */
const setTargetTimes = async (targetTimeArr) => {
    try {
        await client.zAdd(TEST_TIME_KEY, targetTimeArr)
        return true
    } catch (e) {
        console.log(e)
        return false
    }
}

// target_time 데이터 조회
const getTestCaseId = async (timestamp) => {
    try {
        const result = await client.zRange(TEST_TIME_KEY, timestamp-1, timestamp+1)
        if (result.length === 0) {
            return false
        }
        const testCaseId = result[0].split(':')[0];
        return testCaseId
    } catch (e) {
        console.log(e)
        return false
    }
}

// target_time 데이터 삭제(현재 기준 과거)
const deleteTargetTimes = async (curremtTime) => {
    try {
        await client.zRemRangeByScore(TEST_TIME_KEY, 1, curremtTime)
    } catch (e) {
        return false
    }
}

module.exports = {
  connectRedis,
  disconnectRedis,
  isMemorySpaceAvailable,
  checkDataExists,
  setDataExists,
  setTargetTimes,
  getTestCaseId,
  deleteTargetTimes
};
