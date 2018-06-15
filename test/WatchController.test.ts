process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "HelloWorld";
process.env.DEBUG = "knex:query";

import * as Knex from "knex";
import "mocha";
import * as Database from "./../src/Database";
import app from "./../src/index";

import { SignToken } from "./../src/utils/JwtUtils";

const validUser = {
  userId: 1,
  email: "testuser@email.com",
  firstName: "Test",
  lastName: "User",
  unionId: 1,
  permissions: 67108863
};

const generateToken = (userData?: any) => {
  if (userData) {
    return "Bearer " + SignToken(Object.assign({}, validUser, userData));
  } else {
    return "Bearer " + SignToken(validUser);
  }
};

const knex: Knex = Database.connect();
const chai: Chai.ChaiStatic = require("chai");
const should = chai.should();
const chaiHttp = require("chai-http");
chai.use(chaiHttp);

const url = "/api/v1/watch";

describe("WatchController", () => {
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

  describe("API endpoint protection", () => {
    it("Missing Authorization header should throw an error", done => {
      chai
        .request(app)
        .get(url + "/ongoing")
        .end((err, res) => {
          res.status.should.equal(403);
          should.exist(res.body.error);
          res.body.error.should.equal("Missing Authorization header");
          done();
        });
    });

    it("Malformed Authorization header should throw an error", done => {
      chai
        .request(app)
        .get(url + "/ongoing")
        .set("Authorization", "Bearer HelloWorld")
        .end((err, res) => {
          res.status.should.equal(403);
          should.exist(res.body.error);
          res.body.error.should.equal("Malformed Authorization header");
          done();
        });
    });
  });

  describe("GET /api/v1/watch/ongoing", () => {
    it("Returns all ongoing watches", done => {
      chai
        .request(app)
        .get(url + "/ongoing")
        .set("Authorization", generateToken())
        .end((err, res) => {
          res.status.should.equal(200);
          res.body.length.should.equal(1);
          res.body[0].watchId.should.equal(2);
          res.body[0].userId.should.equal(1);
          res.body[0].startMessage.should.equal(
            "Good evening, I'm taking responsibility of a few exchange students."
          );
          should.not.exist(res.body[0].endMessage);
          Date.parse(res.body[0].startTime).should.equal(1530478680000);
          should.not.exist(res.body[0].endTime);
          done();
        });
    });
  });

  describe("GET /api/v1/watch/user/:userId", () => {
    it("Returns watches (old and ongoing) by a single user", done => {
      chai
        .request(app)
        .get(url + "/user/1")
        .set("Authorization", generateToken())
        .end((err, res) => {
          res.status.should.equal(200);
          should.not.exist(res.body.error);
          res.body.length.should.equal(2);

          // First
          res.body[0].watchId.should.equal(1);
          res.body[0].userId.should.equal(1);
          res.body[0].startMessage.should.equal(
            "Let's get this party started."
          );
          res.body[0].endMessage.should.equal(
            "I have left the building. Moved people under my supervision to another keyholder."
          );
          Date.parse(res.body[0].startTime).should.equal(1498856400000);
          Date.parse(res.body[0].endTime).should.equal(1498857000000);

          // Second
          res.body[1].watchId.should.equal(2);
          res.body[1].userId.should.equal(1);
          res.body[1].startMessage.should.equal(
            "Good evening, I'm taking responsibility of a few exchange students."
          );
          should.not.exist(res.body[1].endMessage);
          Date.parse(res.body[1].startTime).should.equal(1530478680000);
          should.not.exist(res.body[1].endTime);

          done();
        });
    });
  });

  describe("GET /api/v1/watch/ongoing/user/:userId", () => {
    it("Returns all ongoing watches by a single user.", done => {
      chai
        .request(app)
        .get(url + "/ongoing/user/1")
        .set("Authorization", generateToken())
        .end((err, res) => {
          res.status.should.equal(200);
          should.not.exist(res.body.error);
          res.body.length.should.equal(1);

          // First
          res.body[0].watchId.should.equal(2);
          res.body[0].userId.should.equal(1);
          res.body[0].startMessage.should.equal(
            "Good evening, I'm taking responsibility of a few exchange students."
          );
          should.not.exist(res.body[0].endMessage);
          Date.parse(res.body[0].startTime).should.equal(1530478680000);
          should.not.exist(res.body[0].endTime);

          done();
        });
    });
  });

  describe("POST /api/v1/watch/begin & POST /api/v1/watch/end", () => {
    it("User can start and stop a watch.", done => {
      // Start the watch
      chai
        .request(app)
        .post(url + "/start")
        .set("Authorization", generateToken({ userId: 2 }))
        .send({ startMessage: "Let's rock and roll!" })
        .end((err, res) => {
          res.status.should.equal(201);
          should.not.exist(res.body.error);
          should.exist(res.body.message);
          res.body.message.should.equal("Watch started");
          // End the watch
          chai
            .request(app)
            .post(url + "/stop")
            .set("Authorization", generateToken({ userId: 2 }))
            .send({ endMessage: "Good night all!" })
            .end((err2, res2) => {
              res2.status.should.equal(200);
              should.not.exist(res2.body.error);
              should.exist(res2.body.message);
              res2.body.message.should.equal(
                "Watch ended with message 'Good night all!'"
              );
              done();
            });
        });
    });

    it("User can not start a watch if he/she already has an ongoing watch.", done => {
      // Start the watch
      chai
        .request(app)
        .post(url + "/start")
        .set("Authorization", generateToken())
        .send({ startMessage: "Let's rock and roll!" })
        .end((err, res) => {
          res.status.should.equal(400);
          should.exist(res.body.error);
          should.not.exist(res.body.message);
          res.body.error.should.equal("You already have an ongoing watch");
          done();
        });
    });

    it("User can not stop a watch if he/she doesn't have an ongoing watch.", done => {
      // Start the watch
      chai
        .request(app)
        .post(url + "/stop")
        .set("Authorization", generateToken({ userId: 2 }))
        .send({ endMessage: "Let's rock and roll!" })
        .end((err, res) => {
          res.status.should.equal(400);
          should.exist(res.body.error);
          should.not.exist(res.body.message);
          res.body.error.should.equal("You don't have an ongoing watch.");
          done();
        });
    });
  });
});
