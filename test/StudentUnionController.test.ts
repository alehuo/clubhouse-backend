process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "HelloWorld";
process.env.DEBUG = "knex:query";

import * as Chai from "chai";
import "mocha";
import * as Database from "./../src/Database";
import * as Knex from "knex";
import app from "./../src/index";

import { SignToken } from "./../src/utils/JwtUtils";
import IStudentUnion from "../src/models/IStudentUnion";

const generateToken = (userData?: any) => {
  if (userData) {
    return (
      "Bearer " +
      SignToken(
        Object.assign(
          {},
          {
            userId: 1,
            email: "testuser@email.com",
            firstName: "Test",
            lastName: "User",
            unionId: 1,
            permissions: 67108863
          },
          userData
        )
      )
    );
  } else {
    return (
      "Bearer " +
      SignToken({
        userId: 1,
        email: "testuser@email.com",
        firstName: "Test",
        lastName: "User",
        unionId: 1,
        permissions: 67108863
      })
    );
  }
};

const knex: Knex = Database.connect();
const chai: Chai.ChaiStatic = require("chai");
const should = chai.should();
const chaiHttp = require("chai-http");
chai.use(chaiHttp);

const url = "/api/v1/studentunion";

const unions: IStudentUnion[] = [
  { unionId: 1, name: "Union 1", description: "Union 1 description" },
  { unionId: 2, name: "Union 2", description: "Union 2 description" },
  { unionId: 3, name: "Union 3", description: "Union 3 description" }
];

describe("StudentUnionController", () => {
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
        .get(url)
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
        .get(url)
        .set("Authorization", "Bearer HelloWorld")
        .end((err, res) => {
          res.status.should.equal(403);
          should.exist(res.body.error);
          res.body.error.should.equal("Malformed Authorization header");
          done();
        });
    });
  });

  describe("GET /api/v1/studentunion", () => {
    it("Returns all student unions", done => {
      chai
        .request(app)
        .get(url)
        .set("Authorization", generateToken())
        .end((err, res) => {
          res.status.should.equal(200);
          // Number of student unions returned
          res.body.length.should.equal(unions.length);
          for (let i = 0; i < unions.length; i++) {
            should.exist(res.body[i]);
            const stdu: IStudentUnion = res.body[i];
            stdu.description.should.equal(unions[i].description);
            stdu.name.should.equal(unions[i].name);
            stdu.unionId.should.equal(i + 1);
          }
          done();
        });
    });

    it("Returns a single student union", done => {
      chai
        .request(app)
        .get(url + "/1")
        .set("Authorization", generateToken())
        .end((err, res) => {
          res.status.should.equal(200);
          should.exist(res.body.unionId);
          res.body.unionId.should.equal(unions[0].unionId);
          should.exist(res.body.name);
          res.body.name.should.equal(unions[0].name);
          should.exist(res.body.description);
          res.body.description.should.equal(unions[0].description);
          done();
        });
    });
    it("Returns an error if a student union does not exist", done => {
      chai
        .request(app)
        .get(url + "/100")
        .set("Authorization", generateToken())
        .end((err, res) => {
          res.status.should.equal(404);
          should.exist(res.body.error);
          res.body.error.should.equal("Student union not found");
          done();
        });
    });
  });

  describe("POST /api/v1/studentunion", () => {
    it("Can add a new student union", done => {
      chai
        .request(app)
        .post(url)
        .set("Authorization", generateToken())
        .send({
          name: "TestUnion",
          description: "Union description"
        })
        .end((err, res) => {
          res.status.should.equal(201);
          should.exist(res.body.name);
          res.body.name.should.equal("TestUnion");
          should.exist(res.body.description);
          res.body.description.should.equal("Union description");
          should.exist(res.body.unionId);
          res.body.unionId.should.equal(4);
          done();
        });
    });

    it("Can't add a new student union with missing parameters", done => {
      chai
        .request(app)
        .post(url)
        .set("Authorization", generateToken())
        .send({
          name: "TestUnion"
        })
        .end((err, res) => {
          res.status.should.equal(500);
          should.exist(res.body.error);
          res.body.error.should.equal("Missing request body parameters");
          done();
        });
    });
  });

  describe("DELETE /api/v1/studentunion", () => {
    it("A student union can be removed", done => {
      chai
        .request(app)
        .del(url + "/1")
        .set("Authorization", generateToken())
        .end((err, res) => {
          res.status.should.equal(200);
          should.not.exist(res.body.error);
          should.exist(res.body.message);
          res.body.message.should.equal("Student union removed");
          // Check that the union was really removed
          chai
            .request(app)
            .get(url + "/1")
            .set("Authorization", generateToken())
            .end((err2, res2) => {
              should.exist(res2.body.error);
              res2.body.error.should.equal("Student union not found");
              res2.status.should.equal(404);
              done();
            });
        });
    });
  });
});
