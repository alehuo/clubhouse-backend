process.env.NODE_ENV = "test";
process.env.PORT = "5090";

import * as Knex from "knex";
import "mocha";
import * as Database from "../../src/Database";
import app from "../../src/index";

const knex: Knex = Database.connect();
const chai: Chai.ChaiStatic = require("chai");
const should: Chai.Should = chai.should();
const chaiHttp: Chai.ChaiHttpRequest = require("chai-http");
chai.use(chaiHttp);

const authUrl: string = "/api/v1/authenticate";
const correctCreds: any = {
  email: "testuser@email.com",
  password: "testuser"
};
const incorrectCreds: any = {
  email: "wronguser@email.com",
  password: "wrongpassword"
};

describe("AuthController", () => {
  // Roll back
  beforeEach((done: Mocha.Done) => {
    knex.migrate.rollback().then(() => {
      knex.migrate.latest().then(() => {
        knex.seed.run().then(() => {
          done();
        });
      });
    });
  });

  // After each
  afterEach((done: Mocha.Done) => {
    knex.migrate.rollback().then(() => {
      done();
    });
  });

  it("Authenticates with correct credentials", (done: Mocha.Done) => {
    chai
      .request(app)
      .post(authUrl)
      .send(correctCreds)
      .end((err: any, res: ChaiHttp.Response) => {
        should.not.exist(err);
        res.status.should.equal(200);
        should.exist(res.body.token);
        done();
      });
  }).timeout(10000);

  it("Does not authenticate with incorrect credentials", (done: Mocha.Done) => {
    chai
      .request(app)
      .post(authUrl)
      .send(incorrectCreds)
      .end((err: any, res: ChaiHttp.Response) => {
        should.exist(res.body.error);
        should.not.exist(res.body.token);
        res.status.should.equal(400);
        res.body.error.should.equal("Invalid username or password");
        done();
      });
  }).timeout(10000);

  it("Does not authenticate with a non-existent user", (done: Mocha.Done) => {
    chai
      .request(app)
      .post(authUrl)
      .send({
        email: "something",
        password: "something"
      })
      .end((err: any, res: ChaiHttp.Response) => {
        should.exist(res.body.error);
        should.not.exist(res.body.token);
        res.status.should.equal(400);
        res.body.error.should.equal("Invalid username or password");
        done();
      });
  }).timeout(10000);

  it("Returns an error if request parameters are missing", (done: Mocha.Done) => {
    chai
      .request(app)
      .post(authUrl)
      .send({
        email: "something"
      })
      .end((err: any, res: ChaiHttp.Response) => {
        should.exist(res.body.error);
        should.not.exist(res.body.token);
        res.status.should.equal(400);
        res.body.error.should.equal("Missing request body parameters");
        done();
      });
  }).timeout(5000);
});
