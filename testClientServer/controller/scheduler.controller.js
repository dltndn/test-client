const httpStatus = require("http-status")

const runTest = async (req, res) => {
    // 1. TestTime 테이블에서 target_time이 가장 낮은 컬럼 출력

    // 2. 현재 시간 - 2 <= TestTime target_time

    console.log("run test")
    res.status(httpStatus.OK).send({})
}

module.exports = {
    runTest
}