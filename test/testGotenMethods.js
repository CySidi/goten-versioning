const assert = require('assert')

const GotenMethods = require('goten-versioning').GotenMethods

describe('GotenMethods', function() {
  it('DELETE should print string "delete"', function() {
    assert.equal(GotenMethods.DELETE, 'delete')
  })
  it('GET should print string "get"', function() {
    assert.equal(GotenMethods.GET, 'get')
  })
  it('PATCH should print string "patch"', function() {
    assert.equal(GotenMethods.PATCH, 'patch')
  })
  it('POST should print string "post"', function() {
    assert.equal(GotenMethods.POST, 'post')
  })
  it('PUT should print string "put"', function() {
    assert.equal(GotenMethods.PUT, 'put')
  })
})
