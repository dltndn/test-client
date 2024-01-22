const express = require('express');
const clientRoute = require('./client.route');

const router = express.Router(); 

const defaultRoutes = [
    {
        path: '/api',
        route: clientRoute,
    }
]

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route)
})

module.exports = router