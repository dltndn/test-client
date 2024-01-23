const axios = require("axios")
const etc = require("../utils/etc")

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
    
    const isSuccess = etc.validateSuccess(resMs, httpStatusCode)
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
const reqToWebTarget = async (testData) => {
    const instance = axios.create({
        baseURL: `${testData.protocol}://${testData.host}`,
        headers: testData.header
    });
    const path = etc.getPath(testData.path, testData.qry_parameter, testData.path_parameter)
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

const reqToChainTarget = async () => {

}

module.exports = {
    calResTime,
    reqToWebTarget,
    reqToChainTarget
}

