const assert = require('assert')

const METHODS = require('goten-versioning').GotenMethods
const GotenRoute = require('goten-versioning').GotenRoute
const GotenVersion = require('goten-versioning').GotenVersion
const GotenRouteVersioner = require('goten-versioning').GotenRouteVersioner
const gotenVersionManager = require('goten-versioning').GotenVersionManager

describe('GotenVersionManager', function() {
  const path = '/'
  const middleware = (req, res, next) => console.log("testing")
  const getRoute = new GotenRoute(METHODS.GET, path, [middleware])
  const postRoute = new GotenRoute(METHODS.POST, path, [middleware])

  const routes = [getRoute, postRoute]
  const version1 = new GotenVersion(routes)

  const version2 = new GotenVersion([], ["post/"])

  const v3DeleteMiddleware = (req, res, next) => console.log("deleting v3")
  const v3GetMiddleware = (req, res, next) => console.log("testing v3")
  const v3DeleteRoute = new GotenRoute(METHODS.DELETE, path, [v3DeleteMiddleware])
  const v3GetRoute = new GotenRoute(METHODS.GET, path, [v3GetMiddleware])
  const v3Routes = [v3GetRoute, v3DeleteRoute]
  const version3 = new GotenVersion(v3Routes)

  const versionedRoutes = new GotenRouteVersioner([version1, version2, version3]).getVersionedRoutes()

  gotenVersionManager.createRoutes(versionedRoutes)
  const router = gotenVersionManager.getRouter()

  it('routes start with version number (/v1/, /v2/, etc..)', function() {
    let rootPathCount = 0
    let v1PathCount = 0
    let v2PathCount = 0
    let v3PathCount = 0
    
    router.stack.forEach((route) => {
      const routePath = route.route.path
      if (routePath.split('/')[1] == ""){
        rootPathCount += 1
      } else if (routePath.split('/')[1] == "v1"){
        v1PathCount += 1
      } else if (routePath.split('/')[1] == "v2"){
        v2PathCount += 1
      } else if (routePath.split('/')[1] == "v3") {
        v3PathCount += 1
      } else {
        assert.fail()
      }
    })
    assert.ok(rootPathCount == 2 && v1PathCount == rootPathCount)
    assert.equal(v2PathCount, 1)
    assert.equal(v3PathCount, 2)
  })
  it('v3GetRoute has a different middleware than getRoute', function() {
    const v3GetRouteMiddleware = router.stack[5].handle
    const getRouteMiddleware = router.stack[0].handle
    
    assert.ok(v3GetRouteMiddleware != getRouteMiddleware)
  })
})
