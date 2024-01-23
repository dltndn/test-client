const axios = require("axios")

const MASTER_PORT = 8080

const runTest = async () => {
    const instance = axios.create({
        baseURL: `http://localhost:${MASTER_PORT}`
    });
    const path = "/schedule/runTest"
    try {
        await instance.get(path)
    } catch (e) {
        console.error("error:", e)
    }
}

module.exports = {
    runTest
}