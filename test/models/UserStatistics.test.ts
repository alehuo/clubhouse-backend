process.env.NODE_ENV = "test";

import { UserStatistics } from "@alehuo/clubhouse-shared";
import "mocha";
import {
  userStatisticsFilter
} from "../../src/models/IUserStatistics";
const chai: Chai.ChaiStatic = require("chai");
const should: Chai.Should = chai.should();

describe("IUserStatistics", () => {
  it("should get and set user statistics correctly", (done: Mocha.Done) => {
    const post: UserStatistics = {
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
    const post1: UserStatistics = {
      eventCount: 55,
      hoursOnWatch: 225,
      messageCount: 2,
      newspostCount: 42,
      watchCount: 1
    };

    const post: UserStatistics = userStatisticsFilter(post1);

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
