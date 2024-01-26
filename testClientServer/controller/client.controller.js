const httpStatus = require("http-status");
const { dbService, testService, redisService, ethersService } = require("../services")
const { checkNum, checkJson } = require("../utils/validateType");
const { sendSlack } = require("../services/etc.service");
const { xlsxBufferToJson } = require("../utils/etc");

const SERVER_ERROR = async (res) => {
    await redisService.deleteWorkingPid()
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ data: null })
}

const BAD_REQUEST = async (res) => {
    await redisService.deleteWorkingPid()
    res.status(httpStatus.BAD_REQUEST).send({ data: null })
}

const RESPONSE_OK = async (res) => {
    await redisService.deleteWorkingPid()
    res.status(httpStatus.OK).send({ data: true })
}

const MAX_TEST_TIME_AMOUNT = 500

// server 정보 저장
const createServerInfo = async (req, res) => {
    try {
        const serverInfo = req.body
        // mysql 저장
        try {
            await dbService.insertServerInfo(serverInfo)
            await RESPONSE_OK(res)
        } catch (e) {
            await BAD_REQUEST(res)
        }
    } catch (e) {
        console.log(e)
        await SERVER_ERROR(res)
    }
}

// server 정보 가져오기
const getServerInfo = async (req, res) => {
    try {
        const serverInfoId = Number(req.params.serverInfoId)
        // select id
        try {
            await dbService.selectServerInfo(serverInfoId)
            await RESPONSE_OK(res)
        } catch (e) {
            await BAD_REQUEST(res)
        }
    } catch (e) {
        await SERVER_ERROR(res)
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
            await RESPONSE_OK(res)
        } catch (e) {
            await BAD_REQUEST(res)
        }

    } catch (e) {
        await SERVER_ERROR(res)
    }
}

// chain 정보 저장
const createChainInfo = async (req, res) => {
    try {
        const chainInfo = req.body
        // mysql 저장
        try {
            await dbService.insertChainInfo(chainInfo)
            await RESPONSE_OK(res)
        } catch (e) {
            await BAD_REQUEST(res)
        }
    } catch (e) {
        console.log(e)
        await SERVER_ERROR(res)
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
            await RESPONSE_OK(res)
        } catch (e) {
            console.log(e)
            await BAD_REQUEST(res)
        }

    } catch (e) {
        console.log(e)
        await SERVER_ERROR(res)
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
            const isSuccess = await redisService.setTargetTimes(arr)
            if (!isSuccess) {
                await SERVER_ERROR(res)
            }
            await RESPONSE_OK(res)
        } catch (e) {
            await BAD_REQUEST(res)
            console.log(e)
        }
    } catch (e) {
        await SERVER_ERROR(res)
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
            const isSuccess = await redisService.setTargetTimes(arr)
            if (!isSuccess) {
                await SERVER_ERROR(res)
            }
            await redisService.setTargetTimes(arr)
        }
        await RESPONSE_OK(res)
    } catch (e) {
        await BAD_REQUEST(res)
        console.log(e)
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
        if (arr.length > MAX_TEST_TIME_AMOUNT) {
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