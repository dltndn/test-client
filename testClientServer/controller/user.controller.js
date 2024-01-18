const httpStatus = require("http-status");
const { dbService, testService } = require("../services")

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
        SERVER_ERROR(res)
    }
}

// server 정보 가져오기
const getServerInfo = async (req, res) => {
    try {
        const serverInfoId = req.params.serverInfoId
        // select id
        try {
            const data = await dbService.selectServerInfo(serverInfoId)
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
        const serverInfoId = req.params.serverInfoId
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

// testCase 저장
const createTestCase = async (req, res) => {
    try {
        const testDataId = req.params.testDataId
        const testCase = req.body
        // mysql 저장
        try {
            await dbService.insertTestCase(testDataId, testCase)
            res.status(httpStatus.OK).send({ data: true })
        } catch (e) {
            BAD_REQUEST(res)
            console.log(e)
        }
    } catch (e) {
        SERVER_ERROR(res)
    }
}

// test case 수행 및 결과 저장
const runTest = async (req, res) => {
    try {
        const testCaseId = req.params.testCaseId
        const testDataIds = await dbService.getTestDataIdByTestCaseId(testCaseId)
        // 1. test할 데이터 db에서 불러오기
        const testDataResult = await dbService.getTestDataCollection(testDataId[0]["test_data_id"])
        // 2. target api서버에 테스트 요청 보내기
        const _startTime = new Date().getTime();
        const targetTestResult = await testService.reqToTarget(testDataResult[0])
        const _endTime = new Date().getTime();
        const resMs = _endTime - _startTime
        console.log("응답 속도(ms)", resMs)
        // console.log(targetTestResult)
        const cookieResult = targetTestResult
        const httpStatusCodeResult = targetTestResult.status
        const dataResult = targetTestResult.data
        // 3. target api서버 응답 결과 db에 저장하기

        // 4. 응답받은 데이터 결과 정리하기

        // 5. 응답받은 데이터 결과 클라이언트에 응답하기
        res.status(httpStatus.OK).send({ data: true })
    } catch (e) {
        SERVER_ERROR(res)
    }
}

module.exports = {
    createServerInfo,
    getServerInfo,
    createTestData,
    createTestCase,
    runTest
}