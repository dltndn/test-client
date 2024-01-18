const express = require('express');
const dbManager = require('./dbManager')
const httpStatus = require("http-status");

const router = express.Router(); 

const getAllUsers = async (req, res) => {
    try {
        result = await dbManager.getAllUsers()
        res.status(httpStatus.OK).send({ data: result })
    } catch (e) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ data: null })
    }
}

router.route('/test').post(dbManager.createServerInfo)

module.exports = router