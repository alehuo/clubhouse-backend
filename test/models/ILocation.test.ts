process.env.NODE_ENV = "test";

import { expect } from "chai";
import "mocha";
import { ILocation, locationFilter } from "../../src/models/ILocation";
const chai: Chai.ChaiStatic = require("chai");
const should: Chai.Should = chai.should();

describe("ILocation", () => {
  it("should get and set properties correctly", (done: Mocha.Done) => {
    const location: ILocation = {
      address: "Test Address",
      created_at: new Date(2017, 2, 12, 23, 55),
      locationId: 2,
      name: "Test",
      updated_at: new Date(2018, 1, 2, 11, 28)
    };

    should.exist(location.address);
    expect(location.address).to.equal("Test Address");

    should.exist(location.created_at);
    expect(location.created_at.toISOString()).to.equal(
      new Date(2017, 2, 12, 23, 55).toISOString()
    );

    should.exist(location.locationId);
    expect(location.locationId).to.equal(2);

    should.exist(location.name);
    expect(location.name).to.equal("Test");

    should.exist(location.updated_at.toISOString());
    expect(location.updated_at.toISOString()).to.equal(
      new Date(2018, 1, 2, 11, 28).toISOString()
    );

    done();
  });

  it("Location filter should filter properties properties correctly", (done: Mocha.Done) => {
    const tmpLocation: ILocation = {
      address: "Test Address",
      created_at: new Date(2017, 2, 12, 23, 55),
      locationId: 2,
      name: "Test",
      updated_at: new Date(2018, 1, 2, 11, 28)
    };

    const location: ILocation = locationFilter(tmpLocation);

    should.exist(location.address);
    expect(location.address).to.equal("Test Address");

    should.exist(location.created_at);
    expect(location.created_at.toISOString()).to.equal(
      new Date(2017, 2, 12, 23, 55).toISOString()
    );

    should.exist(location.locationId);
    expect(location.locationId).to.equal(2);

    should.exist(location.name);
    expect(location.name).to.equal("Test");

    should.exist(location.updated_at.toISOString());
    expect(location.updated_at.toISOString()).to.equal(
      new Date(2018, 1, 2, 11, 28).toISOString()
    );
    done();
  });
});
