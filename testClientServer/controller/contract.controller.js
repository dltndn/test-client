const httpStatus = require("http-status");
const { dbService } = require("../services");

const SERVER_ERROR = (res) => {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ data: null })
}

const BAD_REQUEST = (res) => {
    res.status(httpStatus.BAD_REQUEST).send({ data: null })
}

// 체인 정보 저장
const createChainInfo = async (req, res) => {
    try {
        const chainInfo = req.body

        try {
            await dbService.insertChainInfo(chainInfo)
            res.status(httpStatus.OK).send({ data: true })
        } catch (e) {
            BAD_REQUEST(res)
        }
    } catch (e) {
        SERVER_ERROR(res)
    }
}

// ChainTestData 저장
const createChainTestData = async (req, res) => {
    try {
        const chainInfoId = Number(req.params.chainInfoId)
    } catch (e) {
        SERVER_ERROR(res)
    }
}

module.exports = {
    createChainInfo
}