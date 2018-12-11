process.env.NODE_ENV = "test";

import "mocha";
import moment from "moment";
import { timestampFilter } from "../../src/utils/Filters";
const chai: Chai.ChaiStatic = require("chai");
const should: Chai.Should = chai.should();

describe("Filters", () => {
  it("should filter timestamps correctly", (done: Mocha.Done) => {
    const obj = {
      something: "hello",
      created_at: moment(new Date()).toISOString(),
      updated_at: moment(new Date()).toISOString()
    };
    should.exist(obj.created_at);
    should.exist(obj.updated_at);
    const filteredObj = timestampFilter(obj);
    should.not.exist(filteredObj.created_at);
    should.not.exist(filteredObj.updated_at);
    done();
  });

  it("should not filter if either if the timestamps are missing", (done: Mocha.Done) => {
    const obj = {
      something: "hello",
      created_at: moment(new Date()).toISOString()
    };
    should.exist(obj.something);
    should.exist(obj.created_at);
    const filteredObj = timestampFilter(obj);
    should.exist(filteredObj.something);
    should.exist(filteredObj.created_at);
    done();
  });
});
