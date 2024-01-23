const express = require('express');
const cors = require('cors');
const clientRoute = require('./client.route');
const contractRoute = require('./contract.route')
const schedulerRoute = require('./scheduler.route')

const router = express.Router(); 

const defaultRoutes = [
    {
        path: '/api',
        route: clientRoute,
        corsOptions: { origin: 'http://localhost:3000' }
    },
    {
        path: '/chain',
        route: contractRoute,
        corsOptions: { origin: 'http://localhost:3000' }
    },
    {
        path: '/schedule',
        route: schedulerRoute,
        corsOptions: { origin: 'http://localhost:8081' }
    }
]

defaultRoutes.forEach((route) => {
    router.use(route.path, cors(route.corsOptions), route.route)
})

module.exports = router