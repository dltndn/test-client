const httpStatus = require("http-status")
const { reqToWebTarget } = require("../services/handleTest.service")
const { insertChainInfo } = require("../services/db.service")

const runTest = async (req, res) => {
    // 1. 현재 시간 - 2 > TestTime target_time && 현재 시간 + 2 < TestTime target_time 컬럼 출력

    // 2. is_web_test 값에 따라 테스트 실행

    // 3. test 결과 저장

    // 4. test 완료 컬럼들 TestTime table에서 삭제

    

    console.log("run test")
    res.status(httpStatus.OK).send({})
}

module.exports = {
    runTest
}