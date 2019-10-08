'use strict';

const should = require('chai').Should();
const request = require("supertest");
const config = require('./config');


describe('OAuth2 API', function() {
  this.enableTimeouts(false)
  let result;
  let oAuth = request(config.host + '/' + config.tenant + '/oauth2');

  let params = {
    grant_type: 'client_credentials',
    client_id: config.id,
    client_secret: config.secret,
    resource: "https://azure-devices-provisioning.net"
  }


  describe('Client Credentials', () => {
    it('creates a token with app key and secret', (done) => {

      oAuth.post('/token')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send(params)
        .expect(200)
        .then((res) => {
          result = res.body;
          done();
        });
    });

    it('should test something', () => true.should.be.true);

    it('should have an access_token', () => result.access_token.should.exist);
    it('should be a bearer token', () => result.token_type.should.be.equal('Bearer'));
    it('should maintain requested scope', () => result.resource.should.be.equal(params.resource));
  });

  after((done) => {
    if (process.env.LOG_LEVEL === 'debug') {
      console.log(result);
    }
    done();
  });
});
