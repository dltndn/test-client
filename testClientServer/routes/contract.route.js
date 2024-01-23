const express = require('express');
const { contractController } = require("../controller")
const checkReqData = require("../middleware/checkReqData")

const router = express.Router();

// 블록체인 정보 저장
router.route('/createChainInfo').post(checkReqData.v_createChainInfo, contractController.createChainInfo)

// 블록체인 testData 저장
// router.route('/createChainTestData/:chainInfoId').post()

module.exports = router