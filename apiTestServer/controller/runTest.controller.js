const axios = require("axios");
const redisService = require("../service/redis.service");

const MASTER_PORT = 8080

const runTest = async () => {
    const instance = axios.create({
        baseURL: `http://localhost:${MASTER_PORT}`
    });

    const currentTime = Math.floor(Date.now() / 1000)
    // redis memory 저장 공간 확인
    if (!(await redisService.isMemorySpaceAvailable())) {
        await redisService.deleteTargetTimes(currentTime)
    }
    // target testCaseId 불러오기
    const testCaseId = await redisService.getTestCaseId(currentTime)
    if (testCaseId) {
        const path = `/schedule/runTest/${testCaseId}`
        try {
            await instance.get(path)
            console.log(`${currentTime}: trigger 동작`)
        } catch (e) {
            console.error("error:", e)
        }
    }
}

module.exports = {
    runTest
}
