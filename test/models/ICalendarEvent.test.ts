process.env.NODE_ENV = "test";

import { expect } from "chai";
import "mocha";
import {
  calendarEventFilter,
  ICalendarEvent
} from "../../src/models/ICalendarEvent";
const chai: Chai.ChaiStatic = require("chai");
const should: Chai.Should = chai.should();

describe("ICalendarEvent", () => {
  it("should get and set properties correctly", (done: Mocha.Done) => {
    const calendarEvent: ICalendarEvent = {
      addedBy: 1,
      created_at: new Date(2016, 1, 1, 22, 12),
      description: "Test description",
      endTime: new Date(2016, 1, 2, 6, 2),
      eventId: 1,
      locationId: 22,
      name: "Test event",
      restricted: true,
      startTime: new Date(2016, 1, 1, 23, 0),
      unionId: 52,
      updated_at: new Date(2016, 1, 1, 22, 13)
    };

    should.exist(calendarEvent.addedBy);
    should.exist(calendarEvent.created_at);
    should.exist(calendarEvent.description);
    should.exist(calendarEvent.endTime);
    should.exist(calendarEvent.locationId);
    should.exist(calendarEvent.name);
    should.exist(calendarEvent.restricted);
    should.exist(calendarEvent.startTime);
    should.exist(calendarEvent.unionId);
    should.exist(calendarEvent.updated_at);

    expect(calendarEvent.addedBy).to.equal(1);
    expect(calendarEvent.created_at.toISOString()).to.equal(
      new Date(2016, 1, 1, 22, 12).toISOString()
    );
    expect(calendarEvent.description).to.equal("Test description");
    expect(calendarEvent.endTime.toISOString()).to.equal(
      new Date(2016, 1, 2, 6, 2).toISOString()
    );
    expect(calendarEvent.eventId).to.equal(1);
    expect(calendarEvent.locationId).to.equal(22);
    expect(calendarEvent.name).to.equal("Test event");
    expect(calendarEvent.restricted).to.equal(true);
    expect(calendarEvent.startTime.toISOString()).to.equal(
      new Date(2016, 1, 1, 23, 0).toISOString()
    );
    expect(calendarEvent.unionId).to.equal(52);
    expect(calendarEvent.updated_at.toISOString()).to.equal(
      new Date(2016, 1, 1, 22, 13).toISOString()
    );
    done();
  });

  it("should filter event correctly", (done: Mocha.Done) => {
    const calendarEvent1: ICalendarEvent = {
      addedBy: 1,
      created_at: new Date(2016, 1, 1, 22, 12),
      description: "Test description",
      endTime: new Date(2016, 1, 2, 6, 2),
      eventId: 1,
      locationId: 22,
      name: "Test event",
      restricted: true,
      startTime: new Date(2016, 1, 1, 23, 0),
      unionId: 52,
      updated_at: new Date(2016, 1, 1, 22, 13)
    };

    const calendarEvent: ICalendarEvent = calendarEventFilter(calendarEvent1);

    should.exist(calendarEvent.addedBy);
    should.exist(calendarEvent.created_at);
    should.exist(calendarEvent.description);
    should.exist(calendarEvent.endTime);
    should.exist(calendarEvent.locationId);
    should.exist(calendarEvent.name);
    should.exist(calendarEvent.restricted);
    should.exist(calendarEvent.startTime);
    should.exist(calendarEvent.unionId);
    should.exist(calendarEvent.updated_at);

    expect(calendarEvent.addedBy).to.equal(1);
    expect(calendarEvent.created_at.toISOString()).to.equal(
      new Date(2016, 1, 1, 22, 12).toISOString()
    );
    expect(calendarEvent.description).to.equal("Test description");
    expect(calendarEvent.endTime.toISOString()).to.equal(
      new Date(2016, 1, 2, 6, 2).toISOString()
    );
    expect(calendarEvent.eventId).to.equal(1);
    expect(calendarEvent.locationId).to.equal(22);
    expect(calendarEvent.name).to.equal("Test event");
    expect(calendarEvent.restricted).to.equal(true);
    expect(calendarEvent.startTime.toISOString()).to.equal(
      new Date(2016, 1, 1, 23, 0).toISOString()
    );
    expect(calendarEvent.unionId).to.equal(52);
    expect(calendarEvent.updated_at.toISOString()).to.equal(
      new Date(2016, 1, 1, 22, 13).toISOString()
    );
    done();
  });
});
