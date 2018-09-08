process.env.NODE_ENV = "test";

import { expect } from "chai";
import "mocha";
import { IPermission, permissionFilter } from "../../src/models/IPermission";
const chai: Chai.ChaiStatic = require("chai");
const should: Chai.Should = chai.should();

describe("IPermission", () => {
  it("should get and set permission correctly", (done: Mocha.Done) => {
    const perm: IPermission = {
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
    const perm1: IPermission = {
      name: "TestPermission",
      permissionId: 1,
      value: 55
    };
    const perm: IPermission = permissionFilter(perm1);
    should.exist(perm.name);
    should.exist(perm.permissionId);
    should.exist(perm.value);
    expect(perm.name).to.equal("TestPermission");
    expect(perm.permissionId).to.equal(1);
    expect(perm.value).to.equal(55);
    done();
  });
});
