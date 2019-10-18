process.env.NODE_ENV = "test";
process.env.PORT = "5090";

import { ApiResponse } from "@alehuo/clubhouse-shared";
import "mocha";
import knex from "../../src/Database";
import app from "../../src/index";

import chai from "chai";
const should = chai.should();
import chaiHttp from "chai-http";
import { StatusCode } from "../../src/utils/StatusCodes";
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
  beforeEach(async function() {
    this.timeout(60 * 1000);
    await knex.migrate.rollback();
    await knex.migrate.latest();
    await knex.seed.run();
  });

  // After each
  afterEach(async function() {
    await knex.migrate.rollback();
  });

  it("Authenticates with correct credentials", (done) => {
    chai
      .request(app)
      .post(authUrl)
      .send(correctCreds)
      .end((err, res: ChaiHttp.Response) => {
        const body = res.body as ApiResponse<{ token: string }>;
        should.not.exist(err);
        res.status.should.equal(StatusCode.OK);
        should.not.exist(body.error);
        should.exist(body.payload);
        should.exist(body.payload!.token);
        done();
      });
  }).timeout(10000);

  it("Does not authenticate with incorrect credentials", (done) => {
    chai
      .request(app)
      .post(authUrl)
      .send(incorrectCreds)
      .end((err, res: ChaiHttp.Response) => {
        const body = res.body as ApiResponse<undefined>;
        should.exist(body.error);
        should.exist(body.error!.message);
        should.not.exist(body.payload);
        res.status.should.equal(StatusCode.BAD_REQUEST);
        body.error!.message.should.equal("Invalid username or password");
        done();
      });
  }).timeout(10000);

  it("Does not authenticate with a non-existent user", (done) => {
    chai
      .request(app)
      .post(authUrl)
      .send({
        email: "something",
        password: "something"
      })
      .end((err, res: ChaiHttp.Response) => {
        const body = res.body as ApiResponse<undefined>;
        should.exist(body.error);
        should.exist(body.error!.message);
        should.not.exist(body.payload);
        res.status.should.equal(StatusCode.BAD_REQUEST);
        body.error!.message.should.equal("Invalid username or password");
        done();
      });
  }).timeout(10000);

  it("Returns an error if request parameters are missing", (done) => {
    chai
      .request(app)
      .post(authUrl)
      .send({
        email: "something"
      })
      .end((err, res: ChaiHttp.Response) => {
        const body = res.body as ApiResponse<undefined>;
        should.exist(body.error);
        should.exist(body.error!.message);
        should.not.exist(res.body.token);
        res.status.should.equal(StatusCode.BAD_REQUEST);
        body.error!.message.should.equal("Missing request body parameters");
        done();
      });
  }).timeout(5000);
});
