const axios = require("axios")

const LIMIT_TIME = 500

/**
 * 
 * @param {*} testData - TestData 테이블과 TestServerInfo 테이블의 모든 컬럼
 * @description - 타켓 엔드포인트의 응답 시간 계산
 */
const calResTime = async (testData) => {
    const _startTime = Date.now()
    const targetTestResult = await reqToTarget(testData)
    const _endTime = Date.now()
    const resMs = _endTime - _startTime
    console.log(`testDataId(${testData.id}) 응답 속도: ${resMs} ms`)
    const httpStatusCode = targetTestResult.status
    const dataResult = targetTestResult.data
    
    const isSuccess = validateSuccess(resMs, httpStatusCode)
    console.log(`성공 여부: ${isSuccess}\n`)

    return {
        resMs,
        httpStatusCode,
        isSuccess,
        dataResult: dataResult ? JSON.stringify(dataResult): JSON.stringify({})
    }
}

/**
 * 
 * @param {*} testData - TestData 테이블과 TestServerInfo 테이블의 모든 컬럼
 * @returns 타켓 엔드포인트의 응답 데이터
 */
const reqToTarget = async (testData) => {
    const instance = axios.create({
        baseURL: testData.host,
        headers: testData.header
    });
    const path = getPath(testData.path, testData.query, testData.parameter)
    console.log("path:", path)
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
        return e.response
    }
}

module.exports = {
    reqToTarget,
    calResTime
}

const validateSuccess = (resMs, httpStatusCode) => {
    if (resMs > LIMIT_TIME) {
        return false
    }
    if (!(httpStatusCode >= 200 && httpStatusCode < 300)) {
        return false
    }
    if (httpStatusCode === 204) {
        return false
    }
    return true
}

const getPath = (pathStr, query, parameter) => {
    const pathIndex = pathStr.indexOf("!")
    const queryIndex = pathStr.indexOf("?")
    if (pathIndex !== -1) {
        // path parameter
        const preStr = pathStr.slice(0, pathIndex)
        const inStr = parameter
        const postStr = pathStr.slice(pathIndex+1)
        return preStr + inStr + postStr
    }
    if (queryIndex !== -1) {
        // query parameter
        const preStr = pathStr.slice(0, queryIndex)
        const inStr = `?${query}=${parameter}`
        const postStr = pathStr.slice(queryIndex+1)
        return preStr + inStr + postStr
    }
    return pathStr
}