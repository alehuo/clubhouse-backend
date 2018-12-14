process.env.NODE_ENV = "test";
process.env.PORT = "5090";

import { CalendarEvent } from "@alehuo/clubhouse-shared";
import * as Knex from "knex";
import "mocha";
import CalendarEventDao from "../../src/dao/CalendarEventDao";
import * as Database from "../../src/Database";
import app from "../../src/index";
import { createICal, iCalFilter } from "../../src/utils/iCalUtils";
import { ApiResponse } from "../../src/utils/MessageFactory";
import { generateToken } from "../TestUtils";

const knex: Knex = Database.connect();
const chai: Chai.ChaiStatic = require("chai");
const should: Chai.Should = chai.should();
const chaiHttp: Chai.ChaiHttpRequest = require("chai-http");
chai.use(chaiHttp);

const calendarEventDao: CalendarEventDao = new CalendarEventDao(knex);

const calendarUrl: string = "/api/v1/calendar";

describe("CalendarEventController", () => {
  // Roll back
  beforeEach((done: Mocha.Done) => {
    knex.migrate.rollback().then(() => {
      knex.migrate.latest().then(() => {
        knex.seed.run().then(() => {
          done();
        });
      });
    });
  });

  // After each
  afterEach((done: Mocha.Done) => {
    knex.migrate.rollback().then(() => {
      done();
    });
  });
  /*
  describe("API endpoint protection", () => {
    it("Missing Authorization header should throw an error", (done: Mocha.Done) => {
      chai
        .request(app)
        .get(calendarUrl)
        .end((err: any, res: ChaiHttp.Response) => {
          res.status.should.equal(403);
          should.exist(res.body.error);
          res.body.error.should.equal("Missing Authorization header");
          done();
        });
    });

    it("Malformed Authorization header should throw an error", (done: Mocha.Done) => {
      chai
        .request(app)
        .get(calendarUrl)
        .set("Authorization", "Bearer HelloWorld")
        .end((err: any, res: ChaiHttp.Response) => {
          res.status.should.equal(403);
          should.exist(res.body.error);
          res.body.error.should.equal("Malformed Authorization header");
          done();
        });
    });
  });
  */

  it("Returns a single calendar event", async () => {
    const calendarEvent = await calendarEventDao.findOne(1);

    const res = await chai
      .request(app)
      .get(calendarUrl + "/1")
      .set("Authorization", generateToken());

    const body = res.body as ApiResponse<CalendarEvent>;
    should.not.exist(body.error);
    should.exist(body.payload);
    should.exist(body.success);
    body.success.should.equal(true);

    res.status.should.equal(200);

    Object.keys(calendarEvent).length.should.equal(
      Object.keys(body.payload!).length
    );

    const event = body.payload!;
    event.addedBy.should.equal(calendarEvent.addedBy);
    event.created_at.should.equal(calendarEvent.created_at);
    event.description.should.equal(calendarEvent.description);
    event.endTime.should.equal(calendarEvent.endTime);
    event.eventId.should.equal(calendarEvent.eventId);
    event.locationId.should.equal(calendarEvent.locationId);
    event.name.should.equal(calendarEvent.name);
    event.restricted.should.equal(calendarEvent.restricted);
    event.startTime.should.equal(calendarEvent.startTime);
    event.unionId.should.equal(calendarEvent.unionId);
    event.updated_at.should.equal(calendarEvent.updated_at);
  }).timeout(5000);

  it("Returns a single calendar event as iCal", async () => {
    const calendarEvent = await calendarEventDao.findOne(1);
    const mockDate: Date = new Date(2015, 1, 1);
    const calendarEventString: string = await createICal(
      calendarEvent,
      mockDate,
      mockDate
    );
    const parsedString: string = iCalFilter(calendarEventString);

    const res = await chai
      .request(app)
      .get(calendarUrl + "/1/ical")
      .set("Authorization", generateToken());
    res.type.should.equal("text/calendar");
    res.charset.should.equal("utf-8");
    const parsedBodyString: string = iCalFilter(res.text);

    parsedBodyString.should.equal(parsedString);
    should.not.exist(res.body.error);
    res.status.should.equal(200);
  }).timeout(5000);

  it("Returns all calendar events", async () => {
    const calendarEvents = await calendarEventDao.findAll();
    const sortedEvents = calendarEvents.sort(
      (a, b) => Number(a.eventId) - Number(b.eventId)
    );
    const res = await chai
      .request(app)
      .get(calendarUrl)
      .set("Authorization", generateToken());
    const body = res.body as ApiResponse<CalendarEvent[]>;
    should.not.exist(body.error);
    should.exist(body.payload);
    should.exist(body.success);
    body.success.should.equal(true);
    body.payload!.length.should.equal(calendarEvents.length);
    res.status.should.equal(200);

    const sortedRes = body.payload!.sort(
      (a, b) => Number(a.eventId) - Number(b.eventId)
    );

    for (let i = 0; i < sortedRes.length; i++) {
      const event = sortedRes[i];
      const calendarEvent = sortedEvents[i];

      event.addedBy.should.equal(calendarEvent.addedBy);
      event.created_at.should.equal(calendarEvent.created_at);
      event.description.should.equal(calendarEvent.description);
      event.endTime.should.equal(calendarEvent.endTime);
      event.eventId.should.equal(calendarEvent.eventId);
      event.locationId.should.equal(calendarEvent.locationId);
      event.name.should.equal(calendarEvent.name);
      event.restricted.should.equal(calendarEvent.restricted);
      event.startTime.should.equal(calendarEvent.startTime);
      event.unionId.should.equal(calendarEvent.unionId);
      event.updated_at.should.equal(calendarEvent.updated_at);
    }
  }).timeout(5000);

  it("Returns an error if request parameters are missing", (done: Mocha.Done) => {
    chai
      .request(app)
      .post(calendarUrl)
      .send({
        test: "Something"
      })
      .end((err: any, res: ChaiHttp.Response) => {
        const body = res.body as ApiResponse<undefined>;
        should.exist(body.error);
        should.exist(body.success);
        body.success.should.equal(false);
        should.exist(body.error!.errors);
        should.exist(body.error!.message);
        body.error!.errors!.length.should.equal(1);
        body.error!.errors![0].should.equal(
          "Missing: description, endTime, locationId, name, restricted, startTime, unionId"
        );
        should.not.exist(res.body.payload);
        res.status.should.equal(400);
        body.error!.message.should.equal("Missing request body parameters");
        done();
      });
  }).timeout(5000);
});
