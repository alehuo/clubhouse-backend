process.env.NODE_ENV = "test";
process.env.PORT = "5090";
process.env.JWT_SECRET = "HelloWorld";

import "mocha";
import * as Database from "../../src/Database";
import app from "../../src/index";

import { ApiResponse, StudentUnion } from "@alehuo/clubhouse-shared";
import { generateToken } from "../TestUtils";

const knex = Database.connect();
import chai from "chai";
const should = chai.should();
import chaiHttp from "chai-http";
import { StatusCode } from "../../src/utils/StatusCodes";
chai.use(chaiHttp);

const url = "/api/v1/studentunion";

const unions: StudentUnion[] = [
  {
    unionId: 1,
    name: "Union 1",
    description: "Union 1 description",
    updated_at: "",
    created_at: ""
  },
  {
    unionId: 2,
    name: "Union 2",
    description: "Union 2 description",
    updated_at: "",
    created_at: ""
  },
  {
    unionId: 3,
    name: "Union 3",
    description: "Union 3 description",
    updated_at: "",
    created_at: ""
  },
  {
    unionId: 4,
    name: "Union 4",
    description: "Union 4 description",
    updated_at: "",
    created_at: ""
  },
  {
    unionId: 5,
    name: "Union 5",
    description: "Union 5 description",
    updated_at: "",
    created_at: ""
  }
];

describe("StudentUnionController", () => {
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


  describe("API endpoint protection", () => {
    it("Missing Authorization header should throw an error", (done) => {
      chai
        .request(app)
        .get(url)
        .end((err, res: ChaiHttp.Response) => {
          const body = res.body as ApiResponse<undefined>;
          res.status.should.equal(StatusCode.BAD_REQUEST);
          should.exist(body.error);
          should.exist(body.error!.message);
          body.error!.message.should.equal("Missing Authorization header");
          done();
        });
    });

    it("Malformed Authorization header should throw an error", (done) => {
      chai
        .request(app)
        .get(url)
        .set("Authorization", "Bearer HelloWorld")
        .end((err, res: ChaiHttp.Response) => {
          const body = res.body as ApiResponse<undefined>;
          res.status.should.equal(StatusCode.BAD_REQUEST);
          should.exist(body.error);
          should.exist(body.error!.message);
          body.error!.message.should.equal("Malformed Authorization header");
          done();
        });
    });
  });

  describe("GET /api/v1/studentunion", () => {
    it("Returns all student unions", (done) => {
      chai
        .request(app)
        .get(url)
        .set("Authorization", generateToken())
        .end((err, res: ChaiHttp.Response) => {
          const body = res.body as ApiResponse<StudentUnion[]>;
          should.exist(body.payload);
          should.not.exist(body.error);
          should.exist(body.success);
          body.success.should.equal(true);

          res.status.should.equal(200);
          // Number of student unions returned
          body.payload!.length.should.equal(unions.length);
          for (let i = 0; i < unions.length; i++) {
            should.exist(body.payload![i]);
            const stdu = body.payload![i];
            stdu.description.should.equal(unions[i].description);
            stdu.name.should.equal(unions[i].name);
            Number(stdu.unionId).should.equal(i + 1);
          }
          done();
        });
    });

    it("Returns all student unions : Wrong permissions should return unauthorized", (done) => {
      chai
        .request(app)
        .get(url)
        .set(
          "Authorization",
          generateToken({
            permissions: Math.pow(2, 2)
          })
        )
        .end((err, res: ChaiHttp.Response) => {
          res.status.should.equal(StatusCode.UNAUTHORIZED);
          const body = res.body as ApiResponse<undefined>;
          should.exist(body.error);
          should.exist(body.error!.message);
          body.error!.message.should.equal("Unauthorized");
          done();
        });
    });

    it("Returns a single student union", (done) => {
      chai
        .request(app)
        .get(url + "/1")
        .set("Authorization", generateToken())
        .end((err, res: ChaiHttp.Response) => {
          const body = res.body as ApiResponse<StudentUnion>;
          should.exist(body.payload);
          should.not.exist(body.error);
          const stdu = body.payload!;
          res.status.should.equal(200);
          should.exist(stdu.unionId);
          stdu.unionId.should.equal(unions[0].unionId);
          should.exist(stdu.name);
          stdu.name.should.equal(unions[0].name);
          should.exist(stdu.description);
          stdu.description.should.equal(unions[0].description);
          should.exist(stdu.created_at); // TODO: check timestamp
          should.exist(stdu.updated_at); // TODO: check timestamp
          done();
        });
    });

    it("Returns a single student union : Wrong permissions should return unauthorized", (done) => {
      chai
        .request(app)
        .get(url + "/1")
        .set(
          "Authorization",
          generateToken({
            permissions: Math.pow(2, 2)
          })
        )
        .end((err, res: ChaiHttp.Response) => {
          const body = res.body as ApiResponse<undefined>;
          res.status.should.equal(StatusCode.UNAUTHORIZED);
          should.exist(body.error);
          should.exist(body.error!.message);
          body.error!.message.should.equal("Unauthorized");
          done();
        });
    });

    it("Returns an error if a student union does not exist", (done) => {
      chai
        .request(app)
        .get(url + "/100")
        .set("Authorization", generateToken())
        .end((err, res: ChaiHttp.Response) => {
          res.status.should.equal(StatusCode.NOT_FOUND);
          const body = res.body as ApiResponse<undefined>;
          should.exist(body.error);
          should.exist(body.error!.message);
          body.error!.message.should.equal("Student union not found");
          done();
        });
    });
  });

  describe("POST /api/v1/studentunion", () => {
    it("Can add a new student union", (done) => {
      chai
        .request(app)
        .post(url)
        .set("Authorization", generateToken())
        .send({
          name: "TestUnion",
          description: "Union description"
        })
        .end((err, res: ChaiHttp.Response) => {
          const body = res.body as ApiResponse<StudentUnion>;
          should.exist(body.payload);
          const stdu = body.payload!;
          res.status.should.equal(StatusCode.CREATED);
          should.exist(stdu.name);
          stdu.name.should.equal("TestUnion");
          should.exist(stdu.description);
          stdu.description.should.equal("Union description");
          should.exist(stdu.unionId);
          stdu.unionId.should.equal(unions.length + 1);
          done();
        });
    });

    it("Can't add a new student union with an empty name", (done) => {
      chai
        .request(app)
        .post(url)
        .set("Authorization", generateToken())
        .send({
          name: "",
          description: "Union description"
        })
        .end((err, res: ChaiHttp.Response) => {
          const body = res.body as ApiResponse<undefined>;
          should.exist(body.error);
          should.exist(body.error!.message);
          res.status.should.equal(StatusCode.BAD_REQUEST);
          should.not.exist(body.payload);
          body.error!.message.should.equal(
            "Name or description cannot be empty"
          );
          done();
        });
    });

    it("Can't add a new student union with an empty description", (done) => {
      chai
        .request(app)
        .post(url)
        .set("Authorization", generateToken())
        .send({
          name: "Union title",
          description: ""
        })
        .end((err, res: ChaiHttp.Response) => {
          const body = res.body as ApiResponse<undefined>;
          should.exist(body.error);
          should.exist(body.error!.message);
          res.status.should.equal(400);
          should.not.exist(body.payload);
          body.error!.message.should.equal(
            "Name or description cannot be empty"
          );
          done();
        });
    });

    it("Can add a new student union : Wrong permissions should return unauthorized", (done) => {
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
        .end((err, res: ChaiHttp.Response) => {
          const body = res.body as ApiResponse<undefined>;
          should.exist(body.error);
          should.exist(body.error!.message);
          res.status.should.equal(StatusCode.UNAUTHORIZED);
          should.not.exist(body.payload);
          body.error!.message.should.equal("Unauthorized");
          done();
        });
    });

    it("Can't add a new student union with missing parameters", (done) => {
      chai
        .request(app)
        .post(url)
        .set("Authorization", generateToken())
        .send({
          name: "TestUnion"
        })
        .end((err, res: ChaiHttp.Response) => {
          const body = res.body as ApiResponse<undefined>;
          res.status.should.equal(StatusCode.BAD_REQUEST);
          should.exist(body.error);
          should.exist(body.error!.message);
          body.error!.message.should.equal("Missing request body parameters");
          should.exist(body.error!.errors);
          body.error!.errors!.length.should.equal(1);
          body.error!.errors![0].should.equal("Missing: description");
          done();
        });
    });
  });

  describe("DELETE /api/v1/studentunion", () => {
    it("A student union can be removed", (done) => {
      chai
        .request(app)
        .del(url + "/5")
        .set("Authorization", generateToken())
        .end((err, res: ChaiHttp.Response) => {
          const body = res.body as ApiResponse<undefined>;
          res.status.should.equal(200);
          should.not.exist(body.error);
          should.exist(body.message);
          body.message!.should.equal("Student union removed");
          // Check that the union was really removed
          chai
            .request(app)
            .get(url + "/5")
            .set("Authorization", generateToken())
            .end((err2, res2: ChaiHttp.Response) => {
              const body2 = res2.body as ApiResponse<undefined>;
              should.exist(body2.error);
              should.exist(body2.error!.message);
              body2.error!.message.should.equal("Student union not found");
              res2.status.should.equal(404);
              done();
            });
        });
    });

    it("A student union can be removed : Wrong permissions should return unauthorized", (done) => {
      chai
        .request(app)
        .del(url + "/5")
        .set(
          "Authorization",
          generateToken({
            permissions: Math.pow(2, 2)
          })
        )
        .end((err, res: ChaiHttp.Response) => {
          const body = res.body as ApiResponse<undefined>;
          res.status.should.equal(StatusCode.UNAUTHORIZED);
          should.exist(body.error);
          should.exist(body.error!.message);
          body.error!.message!.should.equal("Unauthorized");
          done();
        });
    });
  });
});
