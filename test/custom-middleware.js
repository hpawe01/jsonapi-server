'use strict'

const assert = require('assert')
const request = require('request')
const jsonApiTestServer = require('../example/server')

describe('Testing custom express middleware', () => {
  describe('Custom headers', () => {
    it('should add custom headers to response', done => {
      const url = 'http://localhost:16006/rest/'
      request({
        method: 'OPTIONS',
        url
      }, (err, res) => {
        assert(!err)
        assert.strictEqual(res.statusCode, 204, 'Expecting 200 OK')
        assert.equal(res.headers['x-test-header'], 'working', 'should have a custom header')
        assert.equal(res.headers['access-control-allow-methods'], 'GET, OPTIONS', 'should have a custom CORS header')
        done()
      })
    }),

    it('should not be overwritte by default headers', done => {
      const url = 'http://localhost:16006/rest/'
      request({
        method: 'OPTIONS',
        url
      }, (err, res) => {
        assert(!err)
        assert.strictEqual(res.statusCode, 204, 'Expecting 200 OK')
        assert.notEqual(res.headers['access-control-allow-methods'], 'GET, POST, PATCH, DELETE, OPTIONS', 'should not have the default CORS header')
        done()
      })
    })
  })

  before(() => {
    const app = jsonApiTestServer.getExpressServer();
    app.use(customHeaderMiddleware);
    jsonApiTestServer.start()
  })
  after(() => {
   jsonApiTestServer.close()
  })
})

const customHeaderMiddleware = function(req, res, next) {
  res.set('X-Test-Header', 'working');
  res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  return next();
}
