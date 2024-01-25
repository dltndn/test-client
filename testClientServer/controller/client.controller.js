const httpStatus = require("http-status");
const { dbService, testService, redisService, ethersService } = require("../services")
const { checkNum, checkJson } = require("../utils/validateType");
const { sendSlack } = require("../services/etc.service");
const { xlsxBufferToJson } = require("../utils/etc");

const SERVER_ERROR = (res) => {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ data: null })
}

const BAD_REQUEST = (res) => {
    res.status(httpStatus.BAD_REQUEST).send({ data: null })
}

// server 정보 저장
const createServerInfo = async (req, res) => {
    try {
        const serverInfo = req.body
        // mysql 저장
        try {
            await dbService.insertServerInfo(serverInfo)
            res.status(httpStatus.OK).send({ data: true })
        } catch (e) {
            BAD_REQUEST(res)
        }
    } catch (e) {
        console.log(e)
        SERVER_ERROR(res)
    }
}

// server 정보 가져오기
const getServerInfo = async (req, res) => {
    try {
        const serverInfoId = Number(req.params.serverInfoId)
        // select id
        try {
            await dbService.selectServerInfo(serverInfoId)
            res.status(httpStatus.OK).send({ data: true })
        } catch (e) {
            BAD_REQUEST(res)
        }
    } catch (e) {
        SERVER_ERROR(res)
    }
}

// testData 저장
const createTestData = async (req, res) => {
    try {
        const serverInfoId = checkNum(req.params.serverInfoId)
        const testData = req.body
        // mysql 저장
        try {
            await dbService.insertTestData(serverInfoId, testData)
            res.status(httpStatus.OK).send({ data: true })
        } catch (e) {
            BAD_REQUEST(res)
        }

    } catch (e) {
        SERVER_ERROR(res)
    }
}

// chain 정보 저장
const createChainInfo = async (req, res) => {
    try {
        const chainInfo = req.body
        // mysql 저장
        try {
            await dbService.insertChainInfo(chainInfo)
            res.status(httpStatus.OK).send({ data: true })
        } catch (e) {
            BAD_REQUEST(res)
        }
    } catch (e) {
        console.log(e)
        SERVER_ERROR(res)
    }
}

// chainTestData 저장
const createChainTestData = async (req, res) => {
    try {
        const chainInfoId = checkNum(req.params.chainInfoId)
        const testData = req.body
        // mysql 저장
        try {
            await dbService.insertChainTestData(chainInfoId, testData)
            res.status(httpStatus.OK).send({ data: true })
        } catch (e) {
            console.log(e)
            BAD_REQUEST(res)
        }

    } catch (e) {
        console.log(e)
        SERVER_ERROR(res)
    }
}

// testCase 저장
const createTestCase = async (req, res) => {
    try {
        const testCase = req.body
        try {
            // mysql 저장
            const { testCaseObj, testCaseId } = await dbService.insertTestCase(testCase)
            // testTime 저장 - redis
            const obj = {
                interval: Number(testCaseObj.interval),
                startDate: Number(testCaseObj.test_start_date),
                endDate: Number(testCaseObj.test_end_date),
                testCaseId
            }
            const arr = calTargetTimesArr(obj)
            // target_time 데이터 등록 - redis
            await redisService.setTargetTimes(arr)
            res.status(httpStatus.OK).send({ data: true })
        } catch (e) {
            BAD_REQUEST(res)
            console.log(e)
        }
    } catch (e) {
        SERVER_ERROR(res)
        console.log(e)
    }
}

const createTestCaseFile = async (req, res) => {
    try {
        const testCaseFile = req.file.buffer
        const testCaseArr = xlsxBufferToJson(testCaseFile)
        for (const val of testCaseArr) {
            // mysql 저장
            const { testCaseObj, testCaseId } = await dbService.insertTestCase(val)
            // testTime 저장 - redis
            const obj = {
                interval: Number(testCaseObj.interval),
                startDate: Number(testCaseObj.test_start_date),
                endDate: Number(testCaseObj.test_end_date),
                testCaseId
            }
            const arr = calTargetTimesArr(obj)
            // target_time 데이터 등록 - redis
            await redisService.setTargetTimes(arr)
        }
        res.status(httpStatus.OK).send({ data: true })
    } catch (e) {
        BAD_REQUEST(res)
        console.log(e)
    }
}

// test case 수행 및 결과 저장 - 삭제됨
const runTest = async (req, res) => {
    try {
        const testCaseId = req.params.testCaseId
        if (checkNum(testCaseId) === undefined) {
            BAD_REQUEST(res)
        }
        // is_web_test 정보 가져오기
        const testCaseR = await dbService.getTestCase(testCaseId)
        const { is_web_test } = testCaseR[0]
        console.log("is_web_test:", is_web_test)
        const testDataIds = await dbService.getTestDataIdsByTestCaseId(testCaseId)
        // 1. test할 데이터 db에서 불러오기
        let dataContentsArr = []
        if (testDataIds.length > 0) {
            for (const dataId of testDataIds) {
                dataContentsArr.push(await dbService.getTestDataCollection(dataId["id"]))
            }
        } else {
            res.status(httpStatus.NO_CONTENT).send({ data: false })
        }
        // 2. target api서버에 테스트 요청 보내기
        let testCaseTime = 0 // 테스트 케이스 작업 소요 시간
        let successRes = 0
        for (const val of dataContentsArr) {
            const _startTime = Date.now()
            const testResult = await testService.calResTime(val[0])
            const _endTime = Date.now()
            testCaseTime += (Math.floor(_endTime/1000) - Math.floor(_startTime/1000))
            // 3. target api서버 응답 결과 db에 저장하기
            await dbService.insertWebTestResult(testResult, testCaseId)
            testResult.isSuccess && (successRes += 1)
        }
        // 4. 테스트 케이스 결과 정리하기
        const testCaseEndTime = Math.floor(Date.now()/1000)
        const testCaseStartTime = testCaseEndTime - testCaseTime
        const testSuccessRatio = Math.round(successRes / dataContentsArr.length * 100)/100
        const testErrorRatio = Math.round((1 - testSuccessRatio) * 100)/100
        const testCaseResult = {
            testCaseStartTime,
            testCaseEndTime,
            testSuccessRatio : String(testSuccessRatio),
            testErrorRatio : String(testErrorRatio)
        }
        // 테스트 케이스 저장
        await dbService.insertTestCaseResult(testCaseResult, testCaseId)

        // 5. 테스트 케이스 결과 클라이언트에 응답하기
        res.status(httpStatus.OK).send({ data: testCaseResult })
    } catch (e) {
        SERVER_ERROR(res)
    }
}

module.exports = {
    createServerInfo,
    getServerInfo,
    createTestData,
    createTestCase,
    createTestCaseFile,
    createChainInfo,
    createChainTestData
}

// redis version
const calTargetTimesArr = ({ interval, startDate, endDate, testCaseId }) => {
    let arr = [];
    let targetTime = startDate
    while (targetTime <= endDate) {
        if (rows.length > MAX_TEST_TIME_AMOUNT) {
            return arr
        }
        arr.push({
            score: targetTime,
            value: `${testCaseId}:${targetTime}`
        })
        targetTime += interval
    }
    return arr
}