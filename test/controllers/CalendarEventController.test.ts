process.env.NODE_ENV = "test";

import * as Knex from "knex";
import "mocha";
import CalendarEventDao from "../../src/dao/CalendarEventDao";
import * as Database from "../../src/Database";
import app from "../../src/index";
import { ICalendarEvent } from "../../src/models/ICalendarEvent";
import { createICal, iCalFilter } from "../../src/utils/iCalUtils";
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

  it("Returns a single calendar event", async () => {
    const calendarEvent: ICalendarEvent = await calendarEventDao.findOne(1);

    const res: any = await chai
      .request(app)
      .get(calendarUrl + "/1")
      .set("Authorization", generateToken());
    should.not.exist(res.body.error);
    res.status.should.equal(200);

    Object.keys(calendarEvent).length.should.equal(
      Object.keys(res.body).length
    );

    for (const key of Object.keys(calendarEvent)) {
      should.exist(res.body[key]);
      if (key === "created_at" || key === "updated_at") {
        return;
      }
      if (key === "startTime" || key === "endTime") {
        new Date(res.body[key])
          .toISOString()
          .should.equal(new Date(res.body[key]).toISOString());
        return;
      }
      res.body[key].should.equal(res.body[key]);
    }
  }).timeout(5000);

  it("Returns a single calendar event as iCal", async () => {
    const calendarEvent: ICalendarEvent = await calendarEventDao.findOne(1);
    const mockDate: Date = new Date(2015, 1, 1);
    const calendarEventString: string = await createICal(
      calendarEvent,
      mockDate,
      mockDate
    );
    const parsedString: string = iCalFilter(calendarEventString);

    const res: any = await chai
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
    const calendarEvents: ICalendarEvent[] = await calendarEventDao.findAll();
    const sortedEvents: ICalendarEvent[] = calendarEvents.sort(
      (a: ICalendarEvent, b: ICalendarEvent) => a.eventId - b.eventId
    );
    const res: any = await chai
      .request(app)
      .get(calendarUrl)
      .set("Authorization", generateToken());
    should.not.exist(res.body.error);
    res.body.length.should.equal(calendarEvents.length);
    res.status.should.equal(200);

    const sortedRes: ICalendarEvent[] = res.body.sort(
      (a: ICalendarEvent, b: ICalendarEvent) => a.eventId - b.eventId
    );

    for (let i: number = 0; i < sortedEvents.length; i++) {
      Object.keys(sortedEvents[i]).forEach((key: string) => {
        should.exist(sortedRes[i][key]);
        if (key === "created_at" || key === "updated_at") {
          return;
        }
        if (key === "startTime" || key === "endTime") {
          new Date(sortedEvents[i][key])
            .toISOString()
            .should.equal(new Date(sortedRes[i][key]).toISOString());
          return;
        }
        sortedEvents[i][key].should.equal(sortedRes[i][key]);
      });
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
        should.exist(res.body.error);
        should.exist(res.body.errors);
        res.body.errors.length.should.equal(1);
        res.body.errors[0].should.equal(
          "Missing: name, description, locationId, restricted, startTime, endTime, unionId"
        );
        should.not.exist(res.body.token);
        res.status.should.equal(400);
        res.body.error.should.equal("Missing request body parameters");
        done();
      });
  }).timeout(5000);
});
