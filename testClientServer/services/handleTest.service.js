const axios = require("axios")

const LIMIT_TIME = 500

const calResTime = async (testData) => {
    const _startTime = new Date().getTime();
    const targetTestResult = await reqToTarget(testData)
    const _endTime = new Date().getTime();
    const resMs = _endTime - _startTime
    console.log(`testDataId(${testData.id}) 응답 속도: ${resMs} ms`)
    const httpStatusCode = targetTestResult.status
    const dataResult = targetTestResult.data
    let isSuccess = false
    // 성공 여부 판정 s
    if (httpStatusCode >= 200 && httpStatusCode < 300) {
        isSuccess = true
    }

    // e
    return {
        resMs,
        httpStatusCode,
        isSuccess,
        dataResult: dataResult ? JSON.stringify(dataResult): JSON.stringify({})
    }
}

const reqToTarget = async (testData) => {
    const instance = axios.create({
        baseURL: testData.host,
        headers: testData.header
    });
    const path = getPath(testData.path, testData.query, testData.parameter)
    let result;
    try {
        switch (testData.http_method) {
            case "get":
                result = await instance.get(path)
                return result
            case "post":
                result = await instance.post(path, testData.body)
                return result
            case "put":
                result = await instance.put(path, testData.body)
                return result
            case "patch":
                result = await instance.patch(path, testData.body)
                return result
            case "options":
                result = await instance.options(path)
                return result
            case "delete":
                result = await instance.delete(path)
                return result
            default:
                return null
        }
    } catch (e) {
        // return e
        return e.response
    }
}

module.exports = {
    reqToTarget,
    calResTime
}

const getPath = (pathStr, query, parameter) => {
    const pathIndex = pathStr.indexOf("!")
    const queryIndex = pathStr.indexOf("?")
    if (pathIndex !== -1) {
        // path parameter
        const preStr = pathStr.slice(0, pathIndex-1)
        const inStr = parameter
        const postStr = pathStr.slice(pathIndex+1)
        return preStr + inStr + postStr
    }
    if (queryIndex !== -1) {
        // query parameter
        const preStr = queryIndex.slice(0, queryIndex-1)
        const inStr = `?${query}=${parameter}`
        const postStr = queryIndex.slice(queryIndex+1)
        return preStr + inStr + postStr
    }
    return pathStr
}