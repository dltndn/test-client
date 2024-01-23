const httpStatus = require("http-status");
const { checkNum, checkJson } = require("../utils/validateType")

const CREATE_SERVER_INFO_KEYS = ["name", "protocol", "host"]
const CREATE_TEST_DATA_KEYS = ["name", "method", "header", "qry_parameter", "path_parameter", "path", "body", "testCaseId"]
const CREATE_TEST_CASE_KEYS = ["name", "interval", "test_start_date", "test_end_date"]
const CREATE_CHAIN_INFO_KEYS = ["label", "network_id"]

const BAD_REQUEST = (res) => {
    res.status(httpStatus.BAD_REQUEST).send({ data: null })
}

const v_createServerInfo = (req, res, next) => {
    if (!hasAllKeys(CREATE_SERVER_INFO_KEYS, req.body)) {
        BAD_REQUEST(res)
    } else {
        next()
    }
}

const v_getServerInfo = (req, res, next) => {
    const serverInfoId = checkNum(req.params.serverInfoId)
    if (serverInfoId === undefined) {
        BAD_REQUEST(res)
    } else {
        next()
    }
}

const v_createTestCase = (req, res, next) => {
    if (!hasAllKeys(CREATE_TEST_CASE_KEYS, req.body)) {
        BAD_REQUEST(res)
    } else {
        next()
    }
}

const v_createTestData = (req, res, next) => {
    const serverInfoId = checkNum(req.params.serverInfoId)
    if (serverInfoId === undefined) {
        BAD_REQUEST(res)
    }
    if (!hasAllKeys(CREATE_TEST_DATA_KEYS, req.body)) {
        BAD_REQUEST(res)
    } else {
        next()
    }
}

const v_createChainInfo = (req, res, next) => {
    if (!hasAllKeys(CREATE_CHAIN_INFO_KEYS, req.body)) {
        BAD_REQUEST(res)
    } else {
        next()
    }
}

module.exports = {
    v_createServerInfo,
    v_getServerInfo,
    v_createTestCase,
    v_createTestData,
    v_createChainInfo
}

const hasAllKeys = (keyList, obj) => {
    const hasAllKeys = keyList.every(key => obj.hasOwnProperty(key));
    return hasAllKeys
}