const chai = require('chai');
const chai_http = require('chai-http');
const server = require('../../index');

const expect = chai.expect;

chai.use(chai_http);

describe('Basic controller', () => {

  it('Cannot find endpoint in api/v1', (done) => {

    chai.request(server)
      .get('/api/v1/test')
      .end((err, res) => {
        expect(err).to.not.be.null;
        expect(res).to.have.status(404);
        expect(res.body).to.include({"msg": "Api endpoint not available"});
        done();
      });

  });

  it('Cannot find endpoint out of api/v1', (done) => {

    chai.request(server)
      .get('/test')
      .end((err, res) => {
        expect(err).to.not.be.null;
        expect(res).to.have.status(404);
        expect(res.body).to.include({"msg": "Api endpoint not available"});
        done();
      });

  });

});
