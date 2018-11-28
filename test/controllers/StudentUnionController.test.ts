process.env.NODE_ENV = "test";
process.env.PORT = "5090";
process.env.JWT_SECRET = "HelloWorld";

import * as Knex from "knex";
import "mocha";
import * as Database from "../../src/Database";
import app from "../../src/index";

import { IStudentUnion } from "../../src/models/IStudentUnion";
import { generateToken } from "../TestUtils";

const knex: Knex = Database.connect();
const chai: Chai.ChaiStatic = require("chai");
const should: Chai.Should = chai.should();
const chaiHttp: Chai.ChaiHttpRequest = require("chai-http");
chai.use(chaiHttp);

const url: string = "/api/v1/studentunion";

const unions: IStudentUnion[] = [
  { unionId: 1, name: "Union 1", description: "Union 1 description" },
  { unionId: 2, name: "Union 2", description: "Union 2 description" },
  { unionId: 3, name: "Union 3", description: "Union 3 description" },
  { unionId: 4, name: "Union 4", description: "Union 4 description" },
  { unionId: 5, name: "Union 5", description: "Union 5 description" }
];

describe("StudentUnionController", () => {
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

  describe("GET /api/v1/studentunion", () => {
    it("Returns all student unions", (done: Mocha.Done) => {
      chai
        .request(app)
        .get(url)
        .set("Authorization", generateToken())
        .end((err: any, res: ChaiHttp.Response) => {
          res.status.should.equal(200);
          // Number of student unions returned
          res.body.length.should.equal(unions.length);
          for (let i: number = 0; i < unions.length; i++) {
            should.exist(res.body[i]);
            const stdu: IStudentUnion = res.body[i];
            stdu.description.should.equal(unions[i].description);
            stdu.name.should.equal(unions[i].name);
            Number(stdu.unionId).should.equal(i + 1);
          }
          done();
        });
    });

    it("Returns all student unions : Wrong permissions should return unauthorized", (done: Mocha.Done) => {
      chai
        .request(app)
        .get(url)
        .set(
          "Authorization",
          generateToken({
            permissions: Math.pow(2, 2)
          })
        )
        .end((err: any, res: ChaiHttp.Response) => {
          res.status.should.equal(400);
          should.exist(res.body.error);
          res.body.error.should.equal("Unauthorized");
          done();
        });
    });

    it("Returns a single student union", (done: Mocha.Done) => {
      chai
        .request(app)
        .get(url + "/1")
        .set("Authorization", generateToken())
        .end((err: any, res: ChaiHttp.Response) => {
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

    it("Returns a single student union : Wrong permissions should return unauthorized", (done: Mocha.Done) => {
      chai
        .request(app)
        .get(url + "/1")
        .set(
          "Authorization",
          generateToken({
            permissions: Math.pow(2, 2)
          })
        )
        .end((err: any, res: ChaiHttp.Response) => {
          res.status.should.equal(400);
          should.exist(res.body.error);
          res.body.error.should.equal("Unauthorized");
          done();
        });
    });

    it("Returns an error if a student union does not exist", (done: Mocha.Done) => {
      chai
        .request(app)
        .get(url + "/100")
        .set("Authorization", generateToken())
        .end((err: any, res: ChaiHttp.Response) => {
          res.status.should.equal(404);
          should.exist(res.body.error);
          res.body.error.should.equal("Student union not found");
          done();
        });
    });
  });

  describe("POST /api/v1/studentunion", () => {
    it("Can add a new student union", (done: Mocha.Done) => {
      chai
        .request(app)
        .post(url)
        .set("Authorization", generateToken())
        .send({
          name: "TestUnion",
          description: "Union description"
        })
        .end((err: any, res: ChaiHttp.Response) => {
          res.status.should.equal(201);
          should.exist(res.body.name);
          res.body.name.should.equal("TestUnion");
          should.exist(res.body.description);
          res.body.description.should.equal("Union description");
          should.exist(res.body.unionId);
          res.body.unionId.should.equal(unions.length + 1);
          done();
        });
    });

    it("Can't add a new student union with an empty name", (done: Mocha.Done) => {
      chai
        .request(app)
        .post(url)
        .set("Authorization", generateToken())
        .send({
          name: "",
          description: "Union description"
        })
        .end((err: any, res: ChaiHttp.Response) => {
          should.exist(res.body.error);
          res.status.should.equal(400);
          should.not.exist(res.body.name);
          should.not.exist(res.body.description);
          should.not.exist(res.body.unionId);
          res.body.error.should.equal("Name or description cannot be empty");
          done();
        });
    });

    it("Can't add a new student union with an empty description", (done: Mocha.Done) => {
      chai
        .request(app)
        .post(url)
        .set("Authorization", generateToken())
        .send({
          name: "Union title",
          description: ""
        })
        .end((err: any, res: ChaiHttp.Response) => {
          should.exist(res.body.error);
          res.status.should.equal(400);
          should.not.exist(res.body.name);
          should.not.exist(res.body.description);
          should.not.exist(res.body.unionId);
          res.body.error.should.equal("Name or description cannot be empty");
          done();
        });
    });

    it("Can add a new student union : Wrong permissions should return unauthorized", (done: Mocha.Done) => {
      chai
        .request(app)
        .post(url)
        .set(
          "Authorization",
          generateToken({
            permissions: Math.pow(2, 2)
          })
        )
        .send({
          name: "TestUnion",
          description: "Union description"
        })
        .end((err: any, res: ChaiHttp.Response) => {
          res.status.should.equal(400);
          should.exist(res.body.error);
          res.body.error.should.equal("Unauthorized");
          done();
        });
    });

    it("Can't add a new student union with missing parameters", (done: Mocha.Done) => {
      chai
        .request(app)
        .post(url)
        .set("Authorization", generateToken())
        .send({
          name: "TestUnion"
        })
        .end((err: any, res: ChaiHttp.Response) => {
          res.status.should.equal(400);
          should.exist(res.body.error);
          res.body.error.should.equal("Missing request body parameters");
          should.exist(res.body.errors);
          res.body.errors.length.should.equal(1);
          res.body.errors[0].should.equal("Missing: description");
          done();
        });
    });
  });

  describe("DELETE /api/v1/studentunion", () => {
    it("A student union can be removed", (done: Mocha.Done) => {
      chai
        .request(app)
        .del(url + "/5")
        .set("Authorization", generateToken())
        .end((err: any, res: ChaiHttp.Response) => {
          res.status.should.equal(200);
          should.not.exist(res.body.error);
          should.exist(res.body.message);
          res.body.message.should.equal("Student union removed");
          // Check that the union was really removed
          chai
            .request(app)
            .get(url + "/5")
            .set("Authorization", generateToken())
            .end((err2: any, res2: ChaiHttp.Response) => {
              should.exist(res2.body.error);
              res2.body.error.should.equal("Student union not found");
              res2.status.should.equal(404);
              done();
            });
        });
    });

    it("A student union can be removed : Wrong permissions should return unauthorized", (done: Mocha.Done) => {
      chai
        .request(app)
        .del(url + "/5")
        .set(
          "Authorization",
          generateToken({
            permissions: Math.pow(2, 2)
          })
        )
        .end((err: any, res: ChaiHttp.Response) => {
          res.status.should.equal(400);
          should.exist(res.body.error);
          res.body.error.should.equal("Unauthorized");
          done();
        });
    });
  });
});
