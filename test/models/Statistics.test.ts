process.env.NODE_ENV = "test";

import { Statistics } from "@alehuo/clubhouse-shared";
import { expect } from "chai";
import "mocha";
import { statisticsFilter } from "../../src/models/IStatistics";
const chai: Chai.ChaiStatic = require("chai");
const should: Chai.Should = chai.should();

describe("IUserStatistics", () => {
  it("should get and set user statistics correctly", (done: Mocha.Done) => {
    const stats: Statistics = {
      eventCount: 55,
      hoursOnWatch: 225,
      messageCount: 2,
      newspostCount: 42,
      watchCount: 1,
      userCount: 225
    };
    should.exist(stats.eventCount);
    should.exist(stats.hoursOnWatch);
    should.exist(stats.messageCount);
    should.exist(stats.newspostCount);
    should.exist(stats.watchCount);
    should.exist(stats.userCount);

    expect(stats.eventCount).to.equal(55);
    expect(stats.hoursOnWatch).to.equal(225);
    expect(stats.messageCount).to.equal(2);
    expect(stats.newspostCount).to.equal(42);
    expect(stats.watchCount).to.equal(1);
    expect(stats.userCount).to.equal(225);
    done();
  });

  it("should filter statistics correctly", (done: Mocha.Done) => {
    const stats1: Statistics = {
      eventCount: 55,
      hoursOnWatch: 225,
      messageCount: 2,
      newspostCount: 42,
      watchCount: 1,
      userCount: 225
    };

    const stats = statisticsFilter(stats1);

    should.exist(stats.eventCount);
    should.exist(stats.hoursOnWatch);
    should.exist(stats.messageCount);
    should.exist(stats.newspostCount);
    should.exist(stats.watchCount);
    should.exist(stats.userCount);

    expect(stats.eventCount).to.equal(55);
    expect(stats.hoursOnWatch).to.equal(225);
    expect(stats.messageCount).to.equal(2);
    expect(stats.newspostCount).to.equal(42);
    expect(stats.watchCount).to.equal(1);
    expect(stats.userCount).to.equal(225);
    done();
  });
});
