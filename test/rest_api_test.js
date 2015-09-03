/* jshint camelcase: false */
var app = require('../server/server');
var request = require('supertest');
var assert = require('assert');
var loopback = require('loopback');

function json(verb, url) {
    return request(app)[verb](url)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);
  }

describe('REST API request', function() {
  before(function(done) {
    require('./start-server');
    done();
  });
  
  after(function(done) {
    app.removeAllListeners('started');
    app.removeAllListeners('loaded');
    done();
  });


  var id;
  it('should create a new account', function(done) {
    json('post', '/api/Accounts')
      .send({
        email: 'abc@foo.com'
      })
      .expect(200, function(err, res) {
        assert(typeof res.body === 'object');
        assert(res.body.id);
        assert(res.body.email);
        assert.equal(res.body.email, 'abc@foo.com');
        id = res.body.id;
        json('get', '/api/Accounts')
          .expect(200, function(err, res){
            var accounts = res.body;
            assert(Array.isArray(res.body));
            assert.isAbove(res.body.length, 0, 'Array should not be empty');
          });
        done();
      });
  });

  var accessToken;
  it('should delete the account', function(done) {
    json('delete', '/api/Accounts')
      .send({
        id: id
      })
      .expect(204, done());
  });
});

describe('Unexpected Usage', function(){
  it('should not crash the server when posting a bad id', function(done){
    json('post', '/api/Accounts/foobar')
      .send({})
      .expect(404, done);
  });
});
