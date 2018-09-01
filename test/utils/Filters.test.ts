process.env.NODE_ENV = "test";

import "mocha";
import { timestampFilter } from "../../src/utils/Filters";
const chai: Chai.ChaiStatic = require("chai");
const should: Chai.Should = chai.should();

describe("Filters", () => {
  it("should filter timestamps correctly", (done: Mocha.Done) => {
    const obj: any = {
      something: "hello",
      created_at: new Date(),
      updated_at: new Date()
    };
    should.exist(obj.created_at);
    should.exist(obj.updated_at);
    const filteredObj: any = timestampFilter(obj);
    should.not.exist(filteredObj.created_at);
    should.not.exist(filteredObj.updated_at);
    done();
  });

  it("should not filter if either if the timestamps are missing", (done: Mocha.Done) => {
    const obj: any = {
      something: "hello",
      created_at: new Date()
    };
    should.exist(obj.something);
    should.exist(obj.created_at);
    const filteredObj: any = timestampFilter(obj);
    should.exist(filteredObj.something);
    should.exist(filteredObj.created_at);
    done();
  });
});
