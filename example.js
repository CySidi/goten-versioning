const express = require('express')
const app = express()
const router = express.Router()

// Goten imports
const GotenRoute = require('./GotenVersioning/GotenRoute')
const GotenVersion = require('./GotenVersioning/GotenVersion')
const GotenRouteVersioner = require('./GotenVersioning/GotenRouteVersioner')
const gotenVersionManager = require('./GotenVersioning/GotenVersionManager')
const METHOD = require('./GotenVersioning/GotenMethods')

const controllerV1 = require('./routes/api/v1/testController')
const controllerV2 = require('./routes/api/v2/testController')

// v1 and default
const version1 = new GotenVersion([
  new GotenRoute(METHOD.GET, "/test", [controllerV1.getTestV1]),
])

// v2
const version2 = new GotenVersion([
    new GotenRoute(METHOD.GET, "/test2", [controllerV2.getTestV2]),
])

// v3
const version3 = new GotenVersion([
    new GotenRoute(METHOD.GET, "/test2", [controllerV1.getTestV1]),
  ],
  ["get/test"]
)

const routeVersioner = new GotenRouteVersioner([version1, version2, version3])

// creates router and sets versioned routes
gotenVersionManager.createRoutes(routeVersioner.routeVersions)

app.use(gotenVersionManager.getRouter())

app.listen(8001, () => {
  console.log("listo")
})