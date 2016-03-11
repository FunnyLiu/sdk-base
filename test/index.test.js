/**
 * Copyright(c) dead_horse and other contributors.
 * MIT Licensed
 *
 * Authors:
 * 	 dead_horse <dead_horse@qq.com>
 *   fengmk2 <fengmk2@gmail.com> (http://fengmk2.com)
 */

'use strict';

/**
 * Module dependencies.
 */

var inherits = require('util').inherits;
var Base = require('..');

describe('sdk-base', function () {
  function SomeServiceClient() {
    Base.call(this);
  }

  inherits(SomeServiceClient, Base);

  describe('default error handler', function () {
    it('should auto add the default error handler and show error message', function () {
      var c = new SomeServiceClient();
      c.listeners('error').length.should.equal(1);
      var err = new Error('mock error 1');
      err.data = {foo: 'bar', url: '/foo'};
      err.status = 500;
      err.type = 'DUMP';
      c.emit('error', err);
      // should stderr output
      // [Thu Nov 06 2014 11:14:33 GMT+0800 (CST)] ERROR 63189 [sdk-base] Unhandle SomeServiceClientError: mock error 1, stack:
      // Error: mock error 1
      //     at null._onTimeout (/Users/mk2/git/sdk-base/test/index.test.js:29:19)
      //     at Timer.listOnTimeout (timers.js:133:15)
      // { [SomeServiceClientError: mock error 1]
      //   data: { foo: 'bar', url: '/foo' },
      //   name: 'SomeServiceClientError' }
    });

    it('should not change the error name and show error message', function (done) {
      var c = new SomeServiceClient();
      setTimeout(function () {
        c.listeners('error').length.should.equal(1);
        var err = new Error('mock some error');
        err.name = 'SomeApiError';
        c.emit('error', err);
        // should stderr output
        // [Thu Nov 06 2014 11:14:33 GMT+0800 (CST)] ERROR 63189 [sdk-base] Unhandle SomeApiError: mock some error, stack:
        // Error: mock some error
        //     at null._onTimeout (/Users/mk2/git/sdk-base/test/index.test.js:29:19)
        //     at Timer.listOnTimeout (timers.js:133:15)
        // { [SomeApiError: mock some error]
        //   name: 'SomeApiError' }
        done();
      }, 10);
    });
  });

  describe('custom error handler and do not show error message', function () {
    it('should use the exists error handler', function (done) {
      var c = new SomeServiceClient();
      c.on('error', function (err) {
        err.message.should.equal('mock error 2');
        done();
      });
      c.listeners('error').length.should.equal(2);
      c.emit('error', new Error('mock error 2'));
      // should not stderr output
    });
  });

  describe('ready', function() {
    it('should ready once', function(done) {
      var client = new SomeServiceClient();
      client.ready(done);
      client.ready(true);
      // again should work
      client.ready(true);
    });
  });
});
