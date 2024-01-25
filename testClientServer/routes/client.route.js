const express = require('express');
const { clientController } = require("../controller")
const checkReqData = require("../middleware/checkReqData")

const router = express.Router();

// api 서버 정보 저장
router.route('/createServerInfo').post(checkReqData.v_createServerInfo, clientController.createServerInfo)
// api 서버 정보 가져오기
router.route('/getServerInfo/:serverInfoId').get(checkReqData.v_getServerInfo, clientController.getServerInfo)

// chain 정보 저장
router.route('/createChainInfo').post(checkReqData.v_createChainInfo, clientController.createChainInfo)

// 웹 테스트 데이터 저장 
router.route('/createTestData/:serverInfoId').post(checkReqData.v_createTestData, clientController.createTestData)

// 체인 테스트 데이터 저장 
router.route('/createChainTestData/:chainInfoId').post(checkReqData.v_createChainTestData, clientController.createChainTestData)

// 테스트 케이스 저장 
router.route('/createTestCase').post(checkReqData.v_createTestCase, clientController.createTestCase)

// 테스트 수행 및 결과 저장 
router.route('/runTest/:testCaseId').get(clientController.runTest)

module.exports = router;