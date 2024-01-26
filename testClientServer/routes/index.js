const express = require('express');
const cors = require('cors');
const checkPid = require('../middleware/checkPid')
const clientRoute = require('./client.route');
const contractRoute = require('./contract.route')
const schedulerRoute = require('./scheduler.route')

const router = express.Router(); 

const CLIENT = 'http://localhost:3000'
const TRIGGER_SERVER = 'http://localhost:8081'

const defaultRoutes = [
    {
        path: '/api',
        route: clientRoute,
        corsOptions: { origin: CLIENT }
    },
    {
        path: '/chain',
        route: contractRoute,
        corsOptions: { origin: CLIENT }
    },
    {
        path: '/schedule',
        route: schedulerRoute,
        corsOptions: { origin: TRIGGER_SERVER }
    }
]

// pid 관리 미들웨어 추가
defaultRoutes.forEach((route) => {
    router.use(route.path, cors(route.corsOptions), checkPid.isWoking, route.route)
})

module.exports = router