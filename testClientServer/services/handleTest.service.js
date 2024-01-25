const axios = require("axios")
const Web3 = require('web3');
const etc = require("../utils/etc");
const { testNodeState } = require("./ethers.service");
const { sendSlack } = require("./etc.service");

/**
 * 
 * @param {*} testData - TestData 테이블과 TestServerInfo 테이블의 모든 컬럼
 * @description - 타켓 엔드포인트의 응답 시간 계산
 */
const calResTime = async (testData, isWebTest) => {
    const _startTime = Date.now()
    let _endTime = 0
    let resMs = 0
    let targetTestResult;
    let isSuccess
    let resObj = {
        resMs: 0,
        isSuccess: false,
        dataResult: ""
    }
    if (isWebTest) {
        targetTestResult = await reqToWebTarget(testData)
        _endTime = Date.now()
        resMs = _endTime - _startTime
        isSuccess = etc.validateWebSuccess(resMs, targetTestResult.status)
        resObj.resMs = resMs
        resObj.isSuccess = isSuccess
        resObj.dataResult = JSON.stringify(targetTestResult.data)
        resObj["httpStatusCode"] = targetTestResult.status
        console.log(`WebTestDataId(${testData.id}) 응답 속도: ${resMs} ms`)
        console.log(`성공 여부: ${isSuccess}\n`)
    } else {
        const targetTestResult = await reqToChainTarget(testData.node_url)
        _endTime = Date.now()
        resMs = _endTime - _startTime
        targetTestResult.chainId ? (isSuccess = true) : (isSuccess = false)
        resObj.resMs = resMs
        resObj.isSuccess = isSuccess
        resObj.dataResult = JSON.stringify(targetTestResult)
        console.log(`ChainTestDataId(${testData.id}) 응답 속도: ${resMs} ms`)
        console.log(`성공 여부: ${isSuccess}\n`)
    }
    
    // 실패할 경우 슬랙 알림
    if (!isSuccess) {
        // error 발생 시간, test data id, server or chain name, test data name, res data
        let slackMsg = `        * 에러 정보 * \n
        ${new Date().toLocaleString("ko-KR")} \n
        ${testData.name} \n
        ${resObj.dataResult}
        `
        if (await sendSlack(slackMsg)) {
            console.log("Error 메세지 발송 성공(Slack)")
        } else {
            console.log("Error 메세지 발송 실패(Slack)")
        }
    }
    
    return resObj
}

/**
 * 
 * @param {*} testData - WebTestData 테이블과 TestServerInfo 테이블의 모든 컬럼
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

/**
 * 
 * @param {*} rpcUrl 
 * @returns obj { chainId: null | number, errorData: string }
 */
const reqToChainTarget = async (rpcUrl) => {
    return await testNodeState(rpcUrl)
}

module.exports = {
    calResTime,
    reqToWebTarget,
    reqToChainTarget
}