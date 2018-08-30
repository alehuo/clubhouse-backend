process.env.NODE_ENV = "test";

import "mocha";
import {
  IUserStatistics,
  userStatisticsFilter
} from "../../src/models/IUserStatistics";
const chai: Chai.ChaiStatic = require("chai");
const should: Chai.Should = chai.should();

describe("IUserStatistics", () => {
  it("should get and set user statistics correctly", (done: Mocha.Done) => {
    const post: IUserStatistics = {
      eventCount: 55,
      hoursOnWatch: 225,
      messageCount: 2,
      newspostCount: 42,
      watchCount: 1
    };
    should.exist(post.eventCount);
    should.exist(post.hoursOnWatch);
    should.exist(post.messageCount);
    should.exist(post.newspostCount);
    should.exist(post.watchCount);

    post.eventCount.should.equal(55);
    post.hoursOnWatch.should.equal(225);
    post.messageCount.should.equal(2);
    post.newspostCount.should.equal(42);
    post.watchCount.should.equal(1);
    done();
  });

  it("should filter user statistics correctly", (done: Mocha.Done) => {
    const post1: IUserStatistics = {
      eventCount: 55,
      hoursOnWatch: 225,
      messageCount: 2,
      newspostCount: 42,
      watchCount: 1
    };

    const post: IUserStatistics = userStatisticsFilter(post1);

    should.exist(post.eventCount);
    should.exist(post.hoursOnWatch);
    should.exist(post.messageCount);
    should.exist(post.newspostCount);
    should.exist(post.watchCount);

    post.eventCount.should.equal(55);
    post.hoursOnWatch.should.equal(225);
    post.messageCount.should.equal(2);
    post.newspostCount.should.equal(42);
    post.watchCount.should.equal(1);
    done();
  });
});
