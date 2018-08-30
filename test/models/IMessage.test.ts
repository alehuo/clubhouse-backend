process.env.NODE_ENV = "test";

import { expect } from "chai";
import "mocha";
import { IMessage, messageFilter } from "../../src/models/IMessage";
const chai: Chai.ChaiStatic = require("chai");
const should: Chai.Should = chai.should();

describe("IMessage", () => {
  it("should get and set message correctly", (done: Mocha.Done) => {
    // const date: Date = new Date();
    const message: IMessage = {
      message: "HelloWorld",
      userId: 1,
      messageId: 1
    };
    expect(message.message).to.equal("HelloWorld");
    done();
  });
  it("should get and set userid correctly", (done: Mocha.Done) => {
    // const date: Date = new Date();
    const message: IMessage = {
      message: "HelloWorld",
      userId: 1,
      messageId: 1
    };
    expect(message.userId).to.equal(1);
    done();
  });
  it("should get and set messageId correctly", (done: Mocha.Done) => {
    // const date: Date = new Date();
    const message: IMessage = {
      message: "HelloWorld",
      userId: 1,
      messageId: 1
    };

    expect(message.messageId).to.equal(1);
    done();
  });

  it("should filter message correctly", (done: Mocha.Done) => {
    // const date: Date = new Date();
    const message1: IMessage = {
      message: "HelloWorld",
      userId: 1,
      messageId: 1
    };

    const message: IMessage = messageFilter(message1);

    should.exist(message.message);
    should.exist(message.userId);
    should.exist(message.messageId);
    expect(message.messageId).to.equal(1);
    expect(message.message).to.equal("HelloWorld");
    expect(message.messageId).to.equal(1);
    done();
  });
});
