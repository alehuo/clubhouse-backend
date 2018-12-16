process.env.NODE_ENV = "test";
process.env.PORT = "5090";
process.env.JWT_SECRET = "HelloWorld";

import * as Knex from "knex";
import "mocha";
import * as Database from "../../src/Database";
import app from "../../src/index";

import { ApiResponse, Session } from "@alehuo/clubhouse-shared";
import moment from "moment";
import { SignToken } from "../../src/utils/JwtUtils";

const validUser: any = {
  userId: 1,
  email: "testuser@email.com",
  firstName: "Test",
  lastName: "User",
  unionId: 1,
  permissions: 67108863
};

const generateToken: (userData?: any) => string = (userData?: any): string => {
  if (userData) {
    return "Bearer " + SignToken(Object.assign({}, validUser, userData));
  } else {
    return "Bearer " + SignToken(validUser);
  }
};

const knex: Knex = Database.connect();
const chai: Chai.ChaiStatic = require("chai");
const should: Chai.Should = chai.should();
const chaiHttp: Chai.ChaiHttpRequest = require("chai-http");
chai.use(chaiHttp);

const url: string = "/api/v1/session";

describe("SessionController", () => {
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

  describe("API endpoint protection", () => {
    it("Missing Authorization header should throw an error", (done: Mocha.Done) => {
      chai
        .request(app)
        .get(url + "/ongoing")
        .end((err: any, res: ChaiHttp.Response) => {
          res.status.should.equal(403);
          const body = res.body as ApiResponse<undefined>;
          should.exist(body.error);
          should.exist(body.error!.message);
          body.error!.message.should.equal("Missing Authorization header");
          done();
        });
    });

    it("Malformed Authorization header should throw an error", (done: Mocha.Done) => {
      chai
        .request(app)
        .get(url + "/ongoing")
        .set("Authorization", "Bearer HelloWorld")
        .end((err: any, res: ChaiHttp.Response) => {
          res.status.should.equal(403);
          const body = res.body as ApiResponse<undefined>;
          should.exist(body.error);
          should.exist(body.error!.message);
          body.error!.message.should.equal("Malformed Authorization header");
          done();
        });
    });
  });

  describe("GET /api/v1/session/ongoing", () => {
    it("Returns all ongoing sessions", (done: Mocha.Done) => {
      chai
        .request(app)
        .get(url + "/ongoing")
        .set("Authorization", generateToken())
        .end((err: any, res: ChaiHttp.Response) => {
          const body = res.body as ApiResponse<Session[]>;
          res.status.should.equal(200);
          body.payload!.length.should.equal(1);
          body.payload![0].sessionId.should.equal(2);
          body.payload![0].userId.should.equal(1);
          body.payload![0].startMessage.should.equal(
            "Good evening, I'm taking responsibility of a few exchange students."
          );
          should.not.exist(body.payload![0].endMessage);
          should.exist(body.payload![0].startTime);
          should.not.exist(body.payload![0].endTime);
          done();
        });
    });
  });

  describe("GET /api/v1/session/user/:userId", () => {
    it("Returns sessions (old and ongoing) by a single user", (done: Mocha.Done) => {
      chai
        .request(app)
        .get(url + "/user/1")
        .set("Authorization", generateToken())
        .end((err: any, res: ChaiHttp.Response) => {
          const body = res.body as ApiResponse<Session[]>;
          res.status.should.equal(200);
          should.not.exist(body.error);
          body.payload!.length.should.equal(2);

          // First
          body.payload![0].sessionId.should.equal(1);
          body.payload![0].userId.should.equal(1);
          body.payload![0].startMessage.should.equal(
            "Let's get this party started."
          );
          body.payload![0].endMessage.should.equal(
            "I have left the building. Moved people under my supervision to another keyholder."
          );
          should.exist(body.payload![0].startTime);
          should.exist(body.payload![0].endTime);

          // Second
          body.payload![1].sessionId.should.equal(2);
          body.payload![1].userId.should.equal(1);
          body.payload![1].startMessage.should.equal(
            "Good evening, I'm taking responsibility of a few exchange students."
          );
          should.not.exist(body.payload![1].endMessage);
          should.exist(body.payload![1].startTime);
          moment(body.payload![1].startTime)
            .toISOString()
            .should.equal(moment(new Date(2018, 6, 1, 23, 58)).toISOString());
          should.not.exist(body.payload![1].endTime);

          done();
        });
    });
  });

  describe("GET /api/v1/session/ongoing/user/:userId", () => {
    it("Returns all ongoing sessions by a single user.", (done: Mocha.Done) => {
      chai
        .request(app)
        .get(url + "/ongoing/user/1")
        .set("Authorization", generateToken())
        .end((err: any, res: ChaiHttp.Response) => {
          const body = res.body as ApiResponse<Session[]>;
          const sessions = body.payload!;
          res.status.should.equal(200);
          should.not.exist(body.error);
          sessions.length.should.equal(1);

          // First
          sessions[0].sessionId.should.equal(2);
          sessions[0].userId.should.equal(1);
          sessions[0].startMessage.should.equal(
            "Good evening, I'm taking responsibility of a few exchange students."
          );
          should.not.exist(sessions[0].endMessage);
          should.exist(sessions[0].startTime);
          should.not.exist(sessions[0].endTime);

          done();
        });
    });
  });

  describe("POST /api/v1/session/start & POST /api/v1/session/stop", () => {
    it("User can start and stop a session.", (done: Mocha.Done) => {
      // Start the watch
      chai
        .request(app)
        .post(url + "/start")
        .set("Authorization", generateToken({ userId: 2 }))
        .send({ startMessage: "Let's rock and roll!" })
        .end((err: any, res: ChaiHttp.Response) => {
          const body = res.body as ApiResponse<undefined>;
          res.status.should.equal(201);
          should.not.exist(body.error);
          should.exist(body.message);
          body.message!.should.equal("Session started");
          // Stop the watch
          chai
            .request(app)
            .post(url + "/stop")
            .set("Authorization", generateToken({ userId: 2 }))
            .send({ endMessage: "Good night all!" })
            .end((err2: any, res2: ChaiHttp.Response) => {
              const body2 = res2.body as ApiResponse<undefined>;
              res2.status.should.equal(200);
              should.not.exist(body2.error);
              should.exist(body2.message);
              body2.message!.should.equal(
                "Session ended with message 'Good night all!'"
              );
              done();
            });
        });
    });

    it("User can not start a session if he/she already has an ongoing session.", (done: Mocha.Done) => {
      chai
        .request(app)
        .post(url + "/start")
        .set("Authorization", generateToken())
        .send({ startMessage: "Let's rock and roll!" })
        .end((err: any, res: ChaiHttp.Response) => {
          const body = res.body as ApiResponse<undefined>;
          res.status.should.equal(400);
          should.exist(body.error);
          should.exist(body.error!.message);
          body.error!.message.should.equal(
            "You already have an ongoing session running."
          );
          done();
        });
    });

    it("User can not stop a session if he/she doesn't have an ongoing session.", (done: Mocha.Done) => {
      chai
        .request(app)
        .post(url + "/stop")
        .set("Authorization", generateToken({ userId: 2 }))
        .send({ endMessage: "Let's rock and roll!" })
        .end((err: any, res: ChaiHttp.Response) => {
          const body = res.body as ApiResponse<undefined>;
          res.status.should.equal(400);
          should.exist(body.error);
          should.exist(body.error!.message);
          body.error!.message.should.equal(
            "You don't have an ongoing session."
          );
          done();
        });
    });

    it("User can not start a session with missing request parameters.", (done: Mocha.Done) => {
      chai
        .request(app)
        .post(url + "/start")
        .set("Authorization", generateToken({ userId: 2 }))
        .send({ test: "Let's rock and roll!" })
        .end((err: any, res: ChaiHttp.Response) => {
          const body = res.body as ApiResponse<undefined>;
          res.status.should.equal(400);
          should.exist(body.error);
          should.exist(body.error!.message);
          body.error!.message.should.equal("Missing request body parameters");
          should.exist(body.error!.errors);
          body.error!.errors!.length.should.equal(1);
          body.error!.errors![0].should.equal("Missing: startMessage");
          done();
        });
    });

    it("User can not stop a session with missing request parameters.", (done: Mocha.Done) => {
      chai
        .request(app)
        .post(url + "/stop")
        .set("Authorization", generateToken({ userId: 2 }))
        .send({ test: "Let's rock and roll!" })
        .end((err: any, res: ChaiHttp.Response) => {
          const body = res.body as ApiResponse<undefined>;
          res.status.should.equal(400);
          should.exist(body.error);
          should.exist(body.error!.message);
          body.error!.message.should.equal("Missing request body parameters");
          should.exist(body.error!.errors);
          body.error!.errors!.length.should.equal(1);
          body.error!.errors![0].should.equal("Missing: endMessage");
          done();
        });
    });
  });
});
