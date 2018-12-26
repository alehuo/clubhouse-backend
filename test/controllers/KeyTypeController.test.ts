process.env.NODE_ENV = "test";
process.env.PORT = "5090";

import { ApiResponse, KeyType } from "@alehuo/clubhouse-shared";
import "mocha";
import * as Database from "../../src/Database";
import app from "../../src/index";
import { generateToken } from "../TestUtils";

const knex = Database.connect();
import chai from "chai";
const should = chai.should();
import chaiHttp from "chai-http";
import { StatusCode } from "../../src/utils/StatusCodes";
chai.use(chaiHttp);

const url = "/api/v1/keyType";

describe("KeyTypeController", () => {
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
        .end((err, res: ChaiHttp.Response) => {
          const body = res.body as ApiResponse<undefined>;
          res.status.should.equal(StatusCode.BAD_REQUEST);
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
        .end((err, res: ChaiHttp.Response) => {
          const body = res.body as ApiResponse<undefined>;
          res.status.should.equal(StatusCode.BAD_REQUEST);
          should.exist(body.error);
          should.exist(body.error!.message);
          should.not.exist(body.payload);
          body.error!.message.should.equal("Malformed Authorization header");
          done();
        });
    });
  });

  describe("GET /api/v1/keyType", () => {
    it("Returns all key types", (done) => {
      chai
        .request(app)
        .get(url)
        .set("Authorization", generateToken())
        .end((err, res: ChaiHttp.Response) => {
          const body = res.body as ApiResponse<KeyType[]>;

          res.status.should.equal(200);
          should.exist(body.payload);
          should.not.exist(body.error);
          // Number of users returned
          body.payload!.length.should.equal(3);
          const pload = body.payload!;
          // First
          pload[0].keyTypeId.should.equal(1);
          pload[0].title.should.equal("24hr");
          // Second
          pload[1].keyTypeId.should.equal(2);
          pload[1].title.should.equal("Day");
          // Third
          pload[2].keyTypeId.should.equal(3);
          pload[2].title.should.equal("Test key");
          done();
        });
    });

    it("Returns a single key type", (done) => {
      chai
        .request(app)
        .get(url + "/1")
        .set("Authorization", generateToken())
        .end((err, res: ChaiHttp.Response) => {
          const body = res.body as ApiResponse<KeyType>;
          res.status.should.equal(200);
          should.exist(body.payload);
          should.not.exist(body.error);
          body.payload!.keyTypeId.should.equal(1);
          should.exist(body.payload!.title);
          body.payload!.title.should.equal("24hr");
          done();
        });
    });

    it("Returns an error if a key type does not exist", (done) => {
      chai
        .request(app)
        .get(url + "/100")
        .set("Authorization", generateToken())
        .end((err, res: ChaiHttp.Response) => {
          const body = res.body as ApiResponse<undefined>;
          res.status.should.equal(404);
          should.exist(body.error);
          should.exist(body.error!.message);
          should.not.exist(body.payload);
          body.error!.message.should.equal("Key type not found");
          done();
        });
    });
  });
});
