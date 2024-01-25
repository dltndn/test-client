const express = require('express');
const { schedulerController } = require("../controller")
const checkReqData = require("../middleware/checkReqData")

const router = express.Router();

// api test 실행
router.route('/runTest').post(schedulerController.runTest)

module.exports = router