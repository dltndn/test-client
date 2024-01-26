const { redisService } = require("../services")

// 현재 pid가 working 중인지 확인
const isWoking = async (req, res, next) => {
    const workingPids = await redisService.getWorkingPid()
    console.log("workingPids: ", workingPids)
    for (const pid of workingPids) {
        if (pid === String(process.pid)) {
            // working 중
            res.end()
            return
        }
    }
    const result = await redisService.setWorkingPid()
    if (result) {
        next()
    } else {
        next()
    }
}

module.exports = {
    isWoking
}