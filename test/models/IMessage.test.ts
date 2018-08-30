process.env.NODE_ENV = "test";

import { expect } from "chai";
import "mocha";
import { IMessage } from "../../src/models/IMessage";

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
});
