const express = require('express');
const { userController } = require("../controller")

const router = express.Router();

// api 서버 정보 저장
router.route('/createServerInfo').post(userController.createServerInfo)
// api 서버 정보 가져오기
router.route('/getServerInfo/:serverInfoId').get(userController.getServerInfo)

// 테스트 데이터 저장 
router.route('/createTestData/:serverInfoId').post(userController.createTestData)

// 테스트 케이스 저장 
router.route('/createTestCase/:testDataId').post(userController.createTestCase)

// 테스트 수행 및 결과 저장 
router.route('/runTest/:testCaseId').get(userController.runTest)

module.exports = router;