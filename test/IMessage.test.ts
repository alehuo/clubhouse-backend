import IMessage from "./../src/models/IMessage";
import { expect } from "chai";
import "mocha";

describe("IMessage", () => {
  it("should get and set message correctly", () => {
    const date: Date = new Date();
    const message: IMessage = {
      message: "HelloWorld",
      userId: 1,
      timestamp: date,
      messageId: 1
    };
    expect(message.message).to.equal("HelloWorld");
  });
  it("should get and set userid correctly", () => {
    const date: Date = new Date();
    const message: IMessage = {
      message: "HelloWorld",
      userId: 1,
      timestamp: date,
      messageId: 1
    };
    expect(message.userId).to.equal(1);
  });
  it("should get and set timestamp correctly", () => {
    const date: Date = new Date();
    const message: IMessage = {
      message: "HelloWorld",
      userId: 1,
      timestamp: date,
      messageId: 1
    };
    expect(message.timestamp).to.equal(date);
  });
  it("should get and set messageId correctly", () => {
    const date: Date = new Date();
    const message: IMessage = {
      message: "HelloWorld",
      userId: 1,
      timestamp: date,
      messageId: 1
    };

    expect(message.messageId).to.equal(1);
  });
});
