const redisService = require("../service/redis.service");
const axiosService = require("../service/axios.service")

const runTest = async () => {
    const currentTime = Math.floor(Date.now() / 1000)
    // redis memory 저장 공간 확인
    // if (!(await redisService.isMemorySpaceAvailable())) {
    //     await redisService.deleteTargetTimes(currentTime)
    // }

    // target testCaseId 불러오기
    const testCaseIds = await redisService.getTestCaseIds(100)
    if (!testCaseIds) {
        console.log("target 없음")
        return
    }
    let index = 0
    let missingIdArr = []
    let targetIdArr = []
    let deletingIdMembers = []
    for (const val of testCaseIds) {
        const testCaseId = Number(val.split(':')[0])
        const targetTime = Number(val.split(':')[1])

        if (currentTime < targetTime) {
            if (index === 0) {
                console.log("target 없음")
            }
            break
        } else if (currentTime === targetTime) {
            targetIdArr.push(testCaseId)
            deletingIdMembers.push(val)    
        } else {
            // 놓친 test case들은 다른 키에 list형태로 저장
            missingIdArr.push(val)
            deletingIdMembers.push(val)
        }
        index++
    }

    if (targetIdArr.length !== 0) {
        // api 요청 코드
        axiosService.reqTest(targetIdArr, currentTime)
        await redisService.deleteTargetTimes(missingIdArr)
        missingIdArr = []
    }

    if (deletingIdMembers.length !== 0) {
        // test id 삭제 코드
        await redisService.deleteTargetTimes(deletingIdMembers)
    }

    if (missingIdArr.length !== 0) {
        // missing id 저장 코드
        await redisService.collectMissingIds(missingIdArr)
    }
}

const test = async () => {
    const arr = ['29:1706173694', "29:1706173698"]
    await redisService.deleteTargetTimes(arr)
}

module.exports = {
    runTest,
    test
}