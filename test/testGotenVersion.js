const assert = require('assert')

const GotenVersion = require('goten-versioning').GotenVersion

describe('GotenVersion', function() {
  const routes = []

  const version = new GotenVersion(routes)
  it('GotenVersion object has attribute routes', function() {
    assert.ok(version.routes, routes)
  })
  it('GotenVersion object has attribute ignorePrevious (default is [])', function() {
    assert.ok(version.ignorePrevious, [])
  })
  it('GotenVersion object has attribute deprecated (default is false)', function() {
    assert.ok(version.deprecated, false)
  })

  version.deprecate()
  it('Deprecating a GotenVersion sets deprecated to true', function() {
    assert.ok(version.deprecated, true)
  })
})