import IMessage from "./../src/models/IMessage";
import { expect } from "chai";
import "mocha";

describe("IMessage", () => {
  it("should get and set message correctly", () => {
    const date: Date = new Date();
    const message: IMessage = {
      message: "HelloWorld",
      userId: 1,
      messageId: 1
    };
    expect(message.message).to.equal("HelloWorld");
  });
  it("should get and set userid correctly", () => {
    const date: Date = new Date();
    const message: IMessage = {
      message: "HelloWorld",
      userId: 1,
      messageId: 1
    };
    expect(message.userId).to.equal(1);
  });
  it("should get and set messageId correctly", () => {
    const date: Date = new Date();
    const message: IMessage = {
      message: "HelloWorld",
      userId: 1,
      messageId: 1
    };

    expect(message.messageId).to.equal(1);
  });
});
