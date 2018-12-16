process.env.NODE_ENV = "test";
process.env.PORT = "5090";
process.env.JWT_SECRET = "HelloWorld";

import { ApiResponse, User } from "@alehuo/clubhouse-shared";
import "mocha";
import * as Database from "../../src/Database";
import app from "../../src/index";
import { generateToken } from "../TestUtils";

const knex = Database.connect();
import chai from "chai";
const should = chai.should();
import chaiHttp from "chai-http";
chai.use(chaiHttp);

const url = "/api/v1/users";

describe("UserController", () => {
  // Roll back
  beforeEach((done) => {
    knex.migrate.rollback().then(() => {
      knex.migrate.latest().then(() => {
        knex.seed.run().then(() => {
          done();
        });
      });
    });
  });

  // After each
  afterEach((done) => {
    knex.migrate.rollback().then(() => {
      done();
    });
  });

  describe("API endpoint protection", () => {
    it("Missing Authorization header should throw an error", (done) => {
      chai
        .request(app)
        .get(url)
        .end((err: any, res: ChaiHttp.Response) => {
          const body = res.body as ApiResponse<undefined>;
          res.status.should.equal(403);
          should.exist(body.error);
          should.exist(body.error!.message);
          should.not.exist(body.payload);
          body.error!.message.should.equal("Missing Authorization header");
          done();
        });
    });

    it("Malformed Authorization header should throw an error", (done) => {
      chai
        .request(app)
        .get(url)
        .set("Authorization", "Bearer HelloWorld")
        .end((err: any, res: ChaiHttp.Response) => {
          const body = res.body as ApiResponse<undefined>;
          res.status.should.equal(403);
          should.exist(body.error);
          should.exist(body.error!.message);
          should.not.exist(body.payload);
          body.error!.message.should.equal("Malformed Authorization header");
          done();
        });
    });
  });

  describe("GET /api/v1/users", () => {
    it("Returns all users", (done) => {
      chai
        .request(app)
        .get(url)
        .set("Authorization", generateToken())
        .end((err: any, res: ChaiHttp.Response) => {
          const body = res.body as ApiResponse<User[]>;

          res.status.should.equal(200);
          should.exist(body.payload);
          should.not.exist(body.error);
          // Number of users returned
          body.payload!.length.should.equal(2);
          const pload = body.payload!;
          // First
          pload[0].userId.should.equal(1);
          pload[0].email.should.equal("testuser@email.com");
          pload[0].firstName.should.equal("Test");
          pload[0].lastName.should.equal("User");
          pload[0].permissions.should.equal(67108863);
          // Second
          pload[1].userId.should.equal(2);
          pload[1].email.should.equal("testuser2@email.com");
          pload[1].firstName.should.equal("Test2");
          pload[1].lastName.should.equal("User2");
          pload[1].permissions.should.equal(8);
          done();
        });
    });

    it("Returns a single user", (done) => {
      chai
        .request(app)
        .get(url + "/1")
        .set("Authorization", generateToken())
        .end((err: any, res: ChaiHttp.Response) => {
          const body = res.body as ApiResponse<User>;
          res.status.should.equal(200);
          should.exist(body.payload);
          should.not.exist(body.error);
          body.payload!.userId.should.equal(1);
          should.exist(body.payload!.email);
          body.payload!.email.should.equal("testuser@email.com");
          should.exist(body.payload!.firstName);
          body.payload!.firstName.should.equal("Test");
          should.exist(body.payload!.lastName);
          body.payload!.lastName.should.equal("User");
          should.exist(body.payload!.permissions);
          body.payload!.permissions.should.equal(67108863);
          done();
        });
    });

    it("Returns an error if a user does not exist", (done) => {
      chai
        .request(app)
        .get(url + "/100")
        .set("Authorization", generateToken())
        .end((err: any, res: ChaiHttp.Response) => {
          const body = res.body as ApiResponse<undefined>;
          res.status.should.equal(404);
          should.exist(body.error);
          should.exist(body.error!.message);
          should.not.exist(body.payload);
          body.error!.message.should.equal("User not found");
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
    it("User can not edit his/her email to something that already exists", (done) => {
      chai
        .request(app)
        .put(url + "/1")
        .set("Authorization", generateToken())
        .send({
          email: "testuser2@email.com"
        })
        .end((err: any, res: ChaiHttp.Response) => {
          const body = res.body as ApiResponse<undefined>;
          res.status.should.equal(400);
          should.exist(body.error);
          should.exist(body.error!.message);
          should.not.exist(body.payload);
          body.error!.message.should.equal("Email address is already in use");
          done();
        });
    });

    it("User can edit his/her information", (done) => {
      chai
        .request(app)
        .put(url + "/1")
        .set("Authorization", generateToken())
        .send({
          email: "testemail@email.com"
        })
        .end((err: any, res: ChaiHttp.Response) => {
          const body = res.body as ApiResponse<User>;
          should.exist(body.payload);
          const usr = body.payload!;
          should.not.exist(body.error);
          res.status.should.equal(200);
          should.exist(usr.userId);
          usr.userId.should.equal(1);
          should.exist(usr.email);
          usr.email.should.equal("testemail@email.com");
          should.exist(usr.firstName);
          usr.firstName.should.equal("Test");
          should.exist(usr.lastName);
          usr.lastName.should.equal("User");
          should.exist(usr.permissions);
          usr.permissions.should.equal(67108863);
          done();
        });
    });
  });

  describe("POST /api/v1/users", () => {
    it("Can register a new user with valid information", (done) => {
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
          const body = res.body as ApiResponse<User>;
          should.exist(body.payload);
          const usr = body.payload!;
          should.not.exist(body.error);
          res.status.should.equal(201);
          should.exist(usr.email);
          usr.email.should.equal("test@test.com");
          should.exist(usr.firstName);
          usr.firstName.should.equal("John");
          should.exist(usr.lastName);
          usr.lastName.should.equal("Doe");
          should.exist(usr.userId);
          usr.userId.should.equal(3);
          done();
        });
    }).timeout(5000);

    it("Can't register a new user with too short password", (done) => {
      chai
        .request(app)
        .post(url)
        .send({
          email: "test@test.com",
          firstName: "John",
          lastName: "Doe",
          password: "JohnDoe"
        })
        .end((err: any, res: ChaiHttp.Response) => {
          const body = res.body as ApiResponse<undefined>;
          res.status.should.equal(400);
          should.exist(body.error);
          should.exist(body.error!.message);
          should.exist(body.error!.errors);
          should.not.exist(body.payload);
          body.error!.errors!.length.should.equal(1);
          body.error!.errors![0].should.equal(
            "Password cannot be empty or shorter than 8 characters"
          );
          done();
        });
    });

    it("Can't register a new user with an invalid email address", (done) => {
      chai
        .request(app)
        .post(url)
        .send({
          email: "test",
          firstName: "John",
          lastName: "Doe",
          password: "JohnDoe123"
        })
        .end((err: any, res: ChaiHttp.Response) => {
          const body = res.body as ApiResponse<undefined>;
          res.status.should.equal(400);
          should.exist(body.error);
          should.exist(body.error!.message);
          should.exist(body.error!.errors);
          should.not.exist(body.payload);
          body.error!.errors!.length.should.equal(1);
          body.error!.message.should.equal("Error registering user");
          body.error!.errors![0].should.equal("Email address is invalid");
          done();
        });
    });

    it("Can't register a new user with missing request params", (done) => {
      chai
        .request(app)
        .post(url)
        .send({
          email: "test@test.com",
          firstName: "John"
        })
        .end((err: any, res: ChaiHttp.Response) => {
          const body = res.body as ApiResponse<undefined>;
          res.status.should.equal(400);
          should.exist(body.error);
          should.exist(body.error!.message);
          should.exist(body.error!.errors);
          should.not.exist(body.payload);
          body!.error!.message.should.equal("Missing request body parameters");
          body.error!.errors!.length.should.equal(1);
          body.error!.errors![0].should.equal("Missing: lastName, password");
          done();
        });
    });
  });

  describe("DELETE /api/v1/users", () => {
    it("User can't delete him/herself", (done) => {
      chai
        .request(app)
        .del(url + "/1")
        .set("Authorization", generateToken())
        .end((err: any, res: ChaiHttp.Response) => {
          const body = res.body as ApiResponse<undefined>;
          res.status.should.equal(400);
          should.exist(body.error);
          should.exist(body.message);
          should.exist(body.success);
          body.success.should.equal(false);
          should.exist(body.error!.message);
          should.not.exist(body.payload);
          body.error!.message.should.equal(
            "You cannot delete yourself. Please contact a server admin to do this operation."
          );
          done();
        });
    });

    it("Administrator can delete another user", (done) => {
      chai
        .request(app)
        .del(url + "/1")
        .set("Authorization", generateToken({ userId: 2 }))
        .end((err: any, res: ChaiHttp.Response) => {
          const body = res.body as ApiResponse<User>;
          should.exist(body.message);
          should.not.exist(body.error);
          res.status.should.equal(200);
          body.message!.should.equal(
            "User deleted from the server (including his/her created calendar " +
              "events, messages, sessions and newsposts.)"
          );
          done();
        });
    });
  });
});
