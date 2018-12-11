process.env.NODE_ENV = "test";

import { Location } from "@alehuo/clubhouse-shared";
import { expect } from "chai";
import "mocha";
import moment from "moment";
import { locationFilter } from "../../src/models/ILocation";
const chai: Chai.ChaiStatic = require("chai");
const should: Chai.Should = chai.should();

describe("ILocation", () => {
  it("should get and set properties correctly", (done: Mocha.Done) => {
    const location: Location = {
      address: "Test Address",
      created_at: moment(new Date(2017, 2, 12, 23, 55)).toISOString(),
      locationId: 2,
      name: "Test",
      updated_at: moment(new Date(2018, 1, 2, 11, 28)).toISOString()
    };

    should.exist(location.address);
    location.address.should.equal("Test Address");

    should.exist(location.created_at);
    location.created_at!.should.equal(
      moment(new Date(2017, 2, 12, 23, 55)).toISOString()
    );

    should.exist(location.locationId);
    (location.locationId as number).should.equal(2);

    should.exist(location.name);
    location.name.should.equal("Test");

    should.exist(location.updated_at);
    location.updated_at!.should.equal(
      moment(new Date(2018, 1, 2, 11, 28)).toISOString()
    );

    done();
  });

  it("Location filter should filter properties properties correctly", (done: Mocha.Done) => {
    const tmpLocation: Location = {
      address: "Test Address",
      created_at: moment(new Date(2017, 2, 12, 23, 55)).toISOString(),
      locationId: 2,
      name: "Test",
      updated_at: moment(new Date(2018, 1, 2, 11, 28)).toISOString()
    };

    const location = locationFilter(tmpLocation);

    should.exist(location.address);
    expect(location.address).to.equal("Test Address");

    should.exist(location.created_at);
    expect(location.created_at).to.equal(
      moment(new Date(2017, 2, 12, 23, 55)).toISOString()
    );

    should.exist(location.locationId);
    expect(location.locationId).to.equal(2);

    should.exist(location.name);
    expect(location.name).to.equal("Test");

    should.exist(location.updated_at);
    expect(location.updated_at).to.equal(
      moment(new Date(2018, 1, 2, 11, 28)).toISOString()
    );
    done();
  });
});
