const axios = require("axios");

const MASTER_PORT = 8080

const instance = axios.create({
    baseURL: `http://localhost:${MASTER_PORT}`
});

const reqTest = async (testCaseIdArr, currentTime) => {
    const path = `/schedule/runTest`
    try {
        await instance.post(path, {
            testCaseIds: testCaseIdArr
        })
        console.log(`${currentTime}: trigger 동작`)
    } catch (e) {
        console.error("error:", e)
    }
}

module.exports = {
    reqTest
}