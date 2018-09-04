process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "HelloWorld";

import * as Knex from "knex";
import "mocha";
import * as Database from "../../src/Database";
import app from "../../src/index";
import { generateToken } from "../TestUtils";

const knex: Knex = Database.connect();
const chai: Chai.ChaiStatic = require("chai");
const should: Chai.Should = chai.should();
const chaiHttp: Chai.ChaiHttpRequest = require("chai-http");
chai.use(chaiHttp);

const url: string = "/api/v1/users";

describe("UserController", () => {
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
        .get(url)
        .end((err: any, res: ChaiHttp.Response) => {
          res.status.should.equal(403);
          should.exist(res.body.error);
          res.body.error.should.equal("Missing Authorization header");
          done();
        });
    });

    it("Malformed Authorization header should throw an error", (done: Mocha.Done) => {
      chai
        .request(app)
        .get(url)
        .set("Authorization", "Bearer HelloWorld")
        .end((err: any, res: ChaiHttp.Response) => {
          res.status.should.equal(403);
          should.exist(res.body.error);
          res.body.error.should.equal("Malformed Authorization header");
          done();
        });
    });
  });

  describe("GET /api/v1/users", () => {
    it("Returns all users", (done: Mocha.Done) => {
      chai
        .request(app)
        .get(url)
        .set("Authorization", generateToken())
        .end((err: any, res: ChaiHttp.Response) => {
          res.status.should.equal(200);
          // Number of users returned
          res.body.length.should.equal(2);
          // First
          res.body[0].userId.should.equal(1);
          res.body[0].email.should.equal("testuser@email.com");
          res.body[0].firstName.should.equal("Test");
          res.body[0].lastName.should.equal("User");
          res.body[0].unionId.should.equal(1);
          res.body[0].permissions.should.equal(67108863);
          // Second
          res.body[1].userId.should.equal(2);
          res.body[1].email.should.equal("testuser2@email.com");
          res.body[1].firstName.should.equal("Test2");
          res.body[1].lastName.should.equal("User2");
          res.body[1].unionId.should.equal(1);
          res.body[1].permissions.should.equal(8);
          done();
        });
    });

    it("Returns a single user", (done: Mocha.Done) => {
      chai
        .request(app)
        .get(url + "/1")
        .set("Authorization", generateToken())
        .end((err: any, res: ChaiHttp.Response) => {
          res.status.should.equal(200);
          should.exist(res.body.userId);
          res.body.userId.should.equal(1);
          should.exist(res.body.email);
          res.body.email.should.equal("testuser@email.com");
          should.exist(res.body.firstName);
          res.body.firstName.should.equal("Test");
          should.exist(res.body.lastName);
          res.body.lastName.should.equal("User");
          should.exist(res.body.unionId);
          res.body.unionId.should.equal(1);
          should.exist(res.body.permissions);
          res.body.permissions.should.equal(67108863);
          done();
        });
    });

    it("Returns an error if a user does not exist", (done: Mocha.Done) => {
      chai
        .request(app)
        .get(url + "/100")
        .set("Authorization", generateToken())
        .end((err: any, res: ChaiHttp.Response) => {
          res.status.should.equal(404);
          should.exist(res.body.error);
          res.body.error.should.equal("User not found");
          done();
        });
    });
  });

  describe("PUT /api/v1/users", () => {
    // TODO: Create additional test cases for
    // 1. Invalid email
    // 2. Invalid first name
    // 3. Invalid last name
    // 4. Invalid password
    // 5. Invalid unionId
    it("User can not edit his/her email to something that already exists", (done: Mocha.Done) => {
      chai
        .request(app)
        .put(url + "/1")
        .set("Authorization", generateToken())
        .send({
          email: "testuser2@email.com"
        })
        .end((err: any, res: ChaiHttp.Response) => {
          res.status.should.equal(400);
          should.exist(res.body.error);
          res.body.error.should.equal("Email address is already in use");
          done();
        });
    });

    it("User can edit his/her information", (done: Mocha.Done) => {
      chai
        .request(app)
        .put(url + "/1")
        .set("Authorization", generateToken())
        .send({
          email: "testemail@email.com"
        })
        .end((err: any, res: ChaiHttp.Response) => {
          res.status.should.equal(200);
          res.body.userId.should.equal(1);
          res.body.email.should.equal("testemail@email.com");
          res.body.firstName.should.equal("Test");
          res.body.lastName.should.equal("User");
          res.body.unionId.should.equal(1);
          res.body.permissions.should.equal(67108863);
          done();
        });
    });
  });

  describe("POST /api/v1/users", () => {
    it("Can register a new user", (done: Mocha.Done) => {
      chai
        .request(app)
        .post(url)
        .send({
          email: "test@test.com",
          firstName: "John",
          lastName: "Doe",
          unionId: 1,
          password: "JohnDoe123"
        })
        .end((err: any, res: ChaiHttp.Response) => {
          res.status.should.equal(201);
          should.exist(res.body.email);
          res.body.email.should.equal("test@test.com");
          should.exist(res.body.firstName);
          res.body.firstName.should.equal("John");
          should.exist(res.body.lastName);
          res.body.lastName.should.equal("Doe");
          should.exist(res.body.unionId);
          res.body.unionId.should.equal(1);
          should.exist(res.body.userId);
          res.body.userId.should.equal(3);
          done();
        });
    }).timeout(5000);

    it("Can't register a new user with too short password", (done: Mocha.Done) => {
      chai
        .request(app)
        .post(url)
        .send({
          email: "test@test.com",
          firstName: "John",
          lastName: "Doe",
          unionId: 1,
          password: "JohnDoe"
        })
        .end((err: any, res: ChaiHttp.Response) => {
          res.status.should.equal(400);
          should.exist(res.body.error);
          res.body.errors.length.should.equal(1);
          res.body.errors[0].should.equal(
            "Password cannot be empty or shorter than 8 characters"
          );
          done();
        });
    });

    it("Can't register a new user with an unknown student union", (done: Mocha.Done) => {
      chai
        .request(app)
        .post(url)
        .send({
          email: "test@test.com",
          firstName: "John",
          lastName: "Doe",
          unionId: 42,
          password: "JohnDoe123"
        })
        .end((err: any, res: ChaiHttp.Response) => {
          res.status.should.equal(400);
          should.exist(res.body.error);
          res.body.errors.length.should.equal(1);
          res.body.error.should.equal("Error registering user");
          res.body.errors[0].should.equal("Student union does not exist");
          done();
        });
    });

    it("Can't register a new user with an invalid email address", (done: Mocha.Done) => {
      chai
        .request(app)
        .post(url)
        .send({
          email: "test",
          firstName: "John",
          lastName: "Doe",
          unionId: 1,
          password: "JohnDoe123"
        })
        .end((err: any, res: ChaiHttp.Response) => {
          res.status.should.equal(400);
          should.exist(res.body.error);
          res.body.errors.length.should.equal(1);
          res.body.error.should.equal("Error registering user");
          res.body.errors[0].should.equal(
            "Email address is invalid"
          );
          done();
        });
    });

    it("Can't register a new user with missing request params", (done: Mocha.Done) => {
      chai
        .request(app)
        .post(url)
        .send({
          email: "test@test.com",
          firstName: "John"
        })
        .end((err: any, res: ChaiHttp.Response) => {
          res.status.should.equal(500);
          res.body.error.should.equal("Missing request body parameters");
          should.exist(res.body.error);
          done();
        });
    });
  });

  describe("DELETE /api/v1/users", () => {
    it("User can't delete him/herself", (done: Mocha.Done) => {
      chai
        .request(app)
        .del(url + "/1")
        .set("Authorization", generateToken())
        .end((err: any, res: ChaiHttp.Response) => {
          res.status.should.equal(400);
          should.exist(res.body.error);
          should.not.exist(res.body.message);
          res.body.error.should.equal(
            "You cannot delete yourself. Please contact a server admin to do this operation."
          );
          done();
        });
    });

    it("Administrator can delete another user", (done: Mocha.Done) => {
      chai
        .request(app)
        .del(url + "/1")
        .set("Authorization", generateToken({ userId: 2 }))
        .end((err: any, res: ChaiHttp.Response) => {
          res.status.should.equal(200);
          should.not.exist(res.body.error);
          should.exist(res.body.message);
          res.body.message.should.equal(
            "User deleted from the server (including his/her created calendar events, messages, watches and newsposts.)"
          );
          done();
        });
    });
  });
});
