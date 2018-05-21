const assert = require('assert')

const GotenRoute = require('goten-versioning').GotenRoute

describe('GotenRoute', function() {
  const method = 'get'
  const path = '/'
  const middlewares = []
  const name = 'getValues'

  const route = new GotenRoute(method, path, middlewares, name)
  it('GotenRoute object has attribute method (a function)', function() {
    assert.ok(route.method)
  })
  it('GotenRoute object has attribute path', function() {
    assert.equal(route.path, path)
  })
  it('GotenRoute object has attribute middlewares', function() {
    assert.equal(route.middlewares, middlewares)
  })
  it('GotenRoute object has attribute name', function() {
    assert.equal(route.name, name)
  })

  const routeWithoutName = new GotenRoute(method, path, middlewares)
  it('GotenRoute name gets defined by default as method+path', function() {
    assert.equal(routeWithoutName.name, method+path)
  })
})