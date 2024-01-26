const httpStatus = require("http-status");
const { checkNum, checkJson } = require("../utils/validateType")
const { redisService } = require('../services')

const CREATE_SERVER_INFO_KEYS = ["name", "protocol", "host"]
const CREATE_TEST_DATA_KEYS = ["name", "method", "header", "qry_parameter", "path_parameter", "path", "body", "testCaseId"]
const CREATE_CHAIN_TEST_DATA_KEYS = ["testCaseId", "node_url", "name"]
const CREATE_TEST_CASE_KEYS = ["name", "interval", "test_start_date", "test_end_date", "is_web_test"]
const CREATE_CHAIN_INFO_KEYS = ["label", "network_id"]

const BAD_REQUEST = async (res) => {
    await redisService.deleteWorkingPid()
    res.status(httpStatus.BAD_REQUEST).send({ data: null })
}

const v_createServerInfo = async (req, res, next) => {
    if (!hasAllKeys(CREATE_SERVER_INFO_KEYS, req.body)) {
        await BAD_REQUEST(res)
    } else {
        next()
    }
}

const v_getServerInfo = async (req, res, next) => {
    const serverInfoId = checkNum(req.params.serverInfoId)
    if (serverInfoId === undefined) {
        await BAD_REQUEST(res)
    } else {
        next()
    }
}

const v_createTestCase = async (req, res, next) => {
    if (!hasAllKeys(CREATE_TEST_CASE_KEYS, req.body)) {
        await BAD_REQUEST(res)
    } else {
        next()
    }
}

const v_createTestData = async (req, res, next) => {
    const serverInfoId = checkNum(req.params.serverInfoId)
    if (serverInfoId === undefined) {
        await BAD_REQUEST(res)
    }
    if (!hasAllKeys(CREATE_TEST_DATA_KEYS, req.body)) {
        await BAD_REQUEST(res)
    } else {
        next()
    }
}

const v_createChainTestData = async (req, res, next) => {
    const chainInfoId = checkNum(req.params.chainInfoId)
    if (chainInfoId === undefined) {
        await BAD_REQUEST(res)
    }
    if (!hasAllKeys(CREATE_CHAIN_TEST_DATA_KEYS, req.body)) {
        await BAD_REQUEST(res)
    } else {
        next()
    }
}

const v_createChainInfo = async (req, res, next) => {
    if (!hasAllKeys(CREATE_CHAIN_INFO_KEYS, req.body)) {
        await BAD_REQUEST(res)
    } else {
        next()
    }
}

module.exports = {
    v_createServerInfo,
    v_getServerInfo,
    v_createTestCase,
    v_createTestData,
    v_createChainTestData,
    v_createChainInfo
}

const hasAllKeys = (keyList, obj) => {
    const hasAllKeys = keyList.every(key => obj.hasOwnProperty(key));
    return hasAllKeys
}