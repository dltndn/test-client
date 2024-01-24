const httpStatus = require("http-status")
const { dbService, testService, ethersService } = require("../services")

const RANGE_INDEX = 2

const runTest = async (req, res) => {
    try {
        // const currentTime = Math.floor(Date.now() / 1000)
        const currentTime = 1705999410
        const testTimes = await dbService.getTestTime(currentTime-RANGE_INDEX, currentTime+RANGE_INDEX)
        // 2. is_web_test 값에 따라 테스트 실행
        const testCaseId = testTimes[0].test_case_id
        const testCaseResult = await dbService.getTestCase(testCaseId)
        if (testCaseResult[0].is_web_test === 0) {
            // chain test
            const result = await runChainTest(testCaseId)
            // test case 결과 저장
            await dbService.insertTestCaseResult(result, testCaseId)
        } else if (testCaseResult[0].is_web_test === 1) {
            // web test
            const result = await runWebTest(testCaseId)
            // test case 결과 저장
            await dbService.insertTestCaseResult(result, testCaseId)
        }
        // 4. test 완료 컬럼들 TestTime table에서 삭제

        res.status(httpStatus.OK).send({ data: true })
    } catch (e) {
        res.status(httpStatus.OK).send({ data: true })
    }
}

module.exports = {
    runTest
}

const runWebTest = async (testCaseId) => {
    try {
        // 1. test할 데이터 db에서 불러오기
        const testDataIds = await dbService.getTestDataIdsByTestCaseId(testCaseId)
        let dataContentsArr = []
        if (testDataIds.length > 0) {
            for (const dataId of testDataIds) {
                dataContentsArr.push(await dbService.getTestDataCollection(dataId["id"]))
            }
        } else {
            return null
        }
        // 2. target api서버에 테스트 요청 보내기
        let successAmount = 0
        for (const val of dataContentsArr) {
            const testResult = await testService.calResTime(val[0], true)
            // 3. target api서버 응답 결과 db에 저장하기
            await dbService.insertWebTestResult(testResult, val[0].id, testCaseId)
            testResult.isSuccess && (successAmount += 1)
        }
        // 4. 테스트 케이스 결과 정리하기
        const testSuccessRatio = Math.round(successAmount / dataContentsArr.length * 100)/100
        const testErrorRatio = Math.round((1 - testSuccessRatio) * 100)/100
        const testCaseResult = {
            testSuccessRatio : String(testSuccessRatio),
            testErrorRatio : String(testErrorRatio)
        }
        
        return testCaseResult
    } catch (e) {
        return null
    }
}

const runChainTest = async (testCaseId) => {

}