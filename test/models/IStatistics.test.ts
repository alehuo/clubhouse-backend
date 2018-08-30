process.env.NODE_ENV = "test";

import { expect } from "chai";
import "mocha";
import { IStatistics } from "../../src/models/IStatistics";
const chai: Chai.ChaiStatic = require("chai");
const should: Chai.Should = chai.should();

describe("IUserStatistics", () => {
  it("should get and set user statistics correctly", (done: Mocha.Done) => {
    const post: IStatistics = {
      eventCount: 55,
      hoursOnWatch: 225,
      messageCount: 2,
      newspostCount: 42,
      watchCount: 1,
      userCount: 225
    };
    should.exist(post.eventCount);
    should.exist(post.hoursOnWatch);
    should.exist(post.messageCount);
    should.exist(post.newspostCount);
    should.exist(post.watchCount);
    should.exist(post.userCount);

    expect(post.eventCount).to.equal(55);
    expect(post.hoursOnWatch).to.equal(225);
    expect(post.messageCount).to.equal(2);
    expect(post.newspostCount).to.equal(42);
    expect(post.watchCount).to.equal(1);
    expect(post.userCount).to.equal(225);
    done();
  });
});
