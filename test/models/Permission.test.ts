process.env.NODE_ENV = "test";

import { Permission } from "@alehuo/clubhouse-shared";
import { expect } from "chai";
import "mocha";
import { permissionFilter } from "../../src/models/IPermission";
const chai: Chai.ChaiStatic = require("chai");
const should: Chai.Should = chai.should();

describe("IPermission", () => {
  it("should get and set permission correctly", (done: Mocha.Done) => {
    const perm: Permission = {
      name: "TestPermission",
      permissionId: 1,
      value: 55
    };
    should.exist(perm.name);
    should.exist(perm.permissionId);
    should.exist(perm.value);
    expect(perm.name).to.equal("TestPermission");
    expect(perm.permissionId).to.equal(1);
    expect(perm.value).to.equal(55);
    done();
  });

  it("should filter permission correctly", (done: Mocha.Done) => {
    const perm1: Permission = {
      name: "TestPermission",
      permissionId: 1,
      value: 55
    };
    const perm = permissionFilter(perm1);
    should.exist(perm.name);
    should.exist(perm.permissionId);
    should.exist(perm.value);
    expect(perm.name).to.equal("TestPermission");
    expect(perm.permissionId).to.equal(1);
    expect(perm.value).to.equal(55);
    done();
  });
});
