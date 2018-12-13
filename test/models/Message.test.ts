process.env.NODE_ENV = "test";

import { Message } from "@alehuo/clubhouse-shared";
import { expect } from "chai";
import "mocha";
import { messageFilter } from "../../src/models/IMessage";
const chai: Chai.ChaiStatic = require("chai");
const should: Chai.Should = chai.should();

describe("IMessage", () => {
  it("should get and set message correctly", (done: Mocha.Done) => {
    // const date: Date = new Date();
    const message: Message = {
      message: "HelloWorld",
      userId: 1,
      messageId: 1,
      created_at: "",
      title: "Title",
      updated_at: ""
    };
    expect(message.message).to.equal("HelloWorld");
    done();
  });
  it("should get and set userid correctly", (done: Mocha.Done) => {
    // const date: Date = new Date();
    const message: Message = {
      message: "HelloWorld",
      userId: 1,
      messageId: 1,
      created_at: "",
      title: "Title",
      updated_at: ""
    };
    expect(message.userId).to.equal(1);
    done();
  });
  it("should get and set messageId correctly", (done: Mocha.Done) => {
    // const date: Date = new Date();
    const message: Message = {
      message: "HelloWorld",
      userId: 1,
      messageId: 1,
      created_at: "",
      title: "Title",
      updated_at: ""
    };

    expect(message.messageId).to.equal(1);
    done();
  });

  it("should filter message correctly", (done: Mocha.Done) => {
    // const date: Date = new Date();
    const message1: Message = {
      message: "HelloWorld",
      userId: 1,
      messageId: 1,
      created_at: "",
      title: "Title",
      updated_at: ""
    };

    const message = messageFilter(message1);

    should.exist(message.message);
    should.exist(message.userId);
    should.exist(message.messageId);
    expect(message.messageId).to.equal(1);
    expect(message.message).to.equal("HelloWorld");
    expect(message.messageId).to.equal(1);
    done();
  });
});
