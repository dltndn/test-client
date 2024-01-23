const express = require('express');
const clientRoute = require('./client.route');
const contractRoute = require('./contract.route')
const schedulerRoute = require('./scheduler.route')

const router = express.Router(); 

const defaultRoutes = [
    {
        path: '/api',
        route: clientRoute,
    },
    {
        path: '/chain',
        route: contractRoute
    },
    {
        path: '/schedule',
        route: schedulerRoute
    }
]

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route)
})

module.exports = router