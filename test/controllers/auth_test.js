const chai = require('chai');
const chai_http = require('chai-http');
const server = require('../../index.js');
const sinon = require('sinon');
const auth = require('../../auth/auth');
const expect = chai.expect;
const bcrypt = require('bcryptjs')

const User = require('../../models/user');

chai.use(chai_http);

describe('User login', function() {
  let test;
  let credentials = { email: 'test@test.com', password: 'test1234' };

  beforeEach((done) => {
    test = new User({email: 'test@test.com', password: bcrypt.hashSync('test1234') });
    test.save().then(() => done());
  });

  it('Valid login', (done) => {
    chai.request(server)
      .post('/api/v1/login')
      .send(credentials)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.include({"token" : auth.encodeToken(credentials.email)});
        done();
      });
  });

  it('Invalid password', function(done) {
    chai.request(server)
      .post('/api/v1/login')
      .send({email: credentials.email, password: 'test'})
      .end((err, res) => {
        expect(err).to.not.be.null;
        expect(res).to.have.status(401);
        expect(res.body).to.include({"error" : "Invalid password"});
        done();
      });
  });

  it('Invalid email', function(done) {
    chai.request(server)
      .post('/api/v1/login')
      .send({email: "invalid@hotmail.com", password: test.password})
      .end((err, res) => {
        expect(err).to.not.be.null;
        expect(res).to.have.status(401);
        expect(res.body).to.include({"error" : "User not found"});
        done();
      });
  });

  it('No email and password', function(done) {
    chai.request(server)
      .post('/api/v1/login')
      .end((err, res) => {
        expect(err).to.not.be.null;
        expect(res).to.have.status(401);
        expect(res.body).to.include({error: "Invalid Login Credentials"});
        done();
      });

  });
});

// describe('User registration', function(done) {
//   var randomNumber = Math.floor((Math.random() * 1000000000) + 1),
//       userEmail = "testUser" + randomNumber + "@gmail.com",
//       password = Math.random().toString(36).slice(-8),
//       firstName = "Subject",
//       lastName = randomNumber;
//
//
//   it('Valid registration', function(done) {
//     chai.request(server)
//       .post('/api/v1/register')
//       .send({"email" : userEmail, "password" : password, "firstname" : firstName, "lastname" : lastName})
//       .end(function(err, res) {
//         expect(err).to.be.null;
//         expect(res).to.have.status(200);
//         expect(JSON.parse(res.text)).to.have.property("affectedRows", 1);
//         done();
//       });
//   });
//
//   it('User already exists', function(done) {
//     chai.request(server)
//       .post('/api/v1/register')
//       .send({"email" : userEmail, "password" : password, "firstname" : firstName, "lastname" : lastName})
//       .end(function(err, res) {
//         expect(err).to.not.be.null;
//         expect(res).to.have.status(401);
//         expect(res.body).to.include({"error" : "User already exists."});
//         done();
//       });
//   });
//
//   it('No information given', function(done) {
//     chai.request(server)
//       .post('/api/v1/register')
//       .end(function(err, res) {
//         expect(err).to.not.be.null;
//         expect(res).to.have.status(401);
//         expect(res.body).to.include({"error" : "No(t enough) register credentials in the body."});
//         done();
//       });
//   });
// });
