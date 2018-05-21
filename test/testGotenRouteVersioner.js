const assert = require('assert')

const GotenRoute = require('goten-versioning').GotenRoute
const GotenVersion = require('goten-versioning').GotenVersion
const GotenRouteVersioner = require('goten-versioning').GotenRouteVersioner

describe('GotenRouteVersioner', function() {
  const path = '/'
  const middlewares = []
  const getRoute = new GotenRoute('get', path, middlewares)
  const postRoute = new GotenRoute('post', path, middlewares)

  const routes = [getRoute, postRoute]
  const version = new GotenVersion(routes)

  const nextVersion = new GotenVersion(routes, ["post/"])
  
  const routeVersioner = new GotenRouteVersioner([version, nextVersion])
  it('GotenRouteVersioner object has attribute routeVersions', function() {
    assert.ok(routeVersioner.routeVersions)
  })
  it('GotenRouteVersioner method "getVersionedRoutes" returns routeVersions', function() {
    assert.equal(routeVersioner.getVersionedRoutes(), routeVersioner.routeVersions)
  })
  it('GotenRouteVersioner.getVersionedRoutes() returns an object that has "vx" as keys', function() {
    assert.deepEqual(Object.keys(routeVersioner.getVersionedRoutes()), Object.keys({v1: null, v2: null}))
  })
  it('GotenRouteVersioner.getVersionedRoutes() has "version" routes as v1', function() {
    assert.equal(routeVersioner.getVersionedRoutes().v1, version)
  })
  it('GotenRouteVersioner.getVersionedRoutes() has "nextVersion" routes as v2', function() {
    assert.equal(routeVersioner.getVersionedRoutes().v2, nextVersion)
  })
})
