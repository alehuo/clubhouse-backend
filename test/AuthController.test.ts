process.env.NODE_ENV = "test";

import * as Knex from "knex";
import "mocha";
import * as Database from "./../src/Database";
import app from "./../src/index";

const knex: Knex = Database.connect();
const chai: Chai.ChaiStatic = require("chai");
const should = chai.should();
const chaiHttp = require("chai-http");
chai.use(chaiHttp);

const authUrl = "/api/v1/authenticate";
const correctCreds = {
  email: "testuser@email.com",
  password: "testuser"
};
const incorrectCreds = {
  email: "wronguser@email.com",
  password: "wrongpassword"
};

describe("AuthController", () => {
  // Roll back
  beforeEach(done => {
    knex.migrate.rollback().then(() => {
      knex.migrate.latest().then(() => {
        knex.seed.run().then(() => {
          done();
        });
      });
    });
  });

  // After each
  afterEach(done => {
    knex.migrate.rollback().then(() => {
      done();
    });
  });

  it("Authenticates with correct credentials", done => {
    chai
      .request(app)
      .post(authUrl)
      .send(correctCreds)
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.equal(200);
        should.exist(res.body.token);
        done();
      });
  });

  it("Does not authenticate with incorrect credentials", done => {
    chai
      .request(app)
      .post(authUrl)
      .send(incorrectCreds)
      .end((err, res) => {
        should.exist(res.body.error);
        should.not.exist(res.body.token);
        res.status.should.equal(400);
        done();
      });
  });
});
