process.env.NODE_ENV = "test";
process.env.PORT = "5090";

import { ApiResponse, CalendarEvent } from "@alehuo/clubhouse-shared";
import "mocha";
import CalendarEventDao from "../../src/dao/CalendarEventDao";
import * as Database from "../../src/Database";
import app from "../../src/index";
import { createICal, iCalFilter } from "../../src/utils/iCalUtils";
import { generateToken } from "../TestUtils";

const knex = Database.connect();
import chai from "chai";
const should = chai.should();
import chaiHttp from "chai-http";
import moment from "moment";
import { StatusCode } from "../../src/utils/StatusCodes";
chai.use(chaiHttp);

const calendarEventDao = new CalendarEventDao(knex);

const calendarUrl = "/api/v1/calendar";

describe("CalendarEventController", () => {
  // Roll back
  beforeEach((done) => {
    knex.migrate.rollback().then(() => {
      knex.migrate.latest().then(() => {
        knex.seed.run().then(() => {
          done();
        });
      });
    });
  });

  // After each
  afterEach((done) => {
    knex.migrate.rollback().then(() => {
      done();
    });
  });
  /*
  describe("API endpoint protection", () => {
    it("Missing Authorization header should throw an error", (done) => {
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

    it("Malformed Authorization header should throw an error", (done) => {
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

    res.status.should.equal(StatusCode.OK);

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
    const mockDate = moment(new Date(2015, 1, 1)).toISOString();
    const calendarEventString = await createICal(
      calendarEvent,
      mockDate,
      mockDate
    );
    const parsedString = iCalFilter(calendarEventString);

    const res = await chai
      .request(app)
      .get(calendarUrl + "/1/ical")
      .set("Authorization", generateToken());
    res.type.should.equal("text/calendar");
    res.charset.should.equal("utf-8");
    const parsedBodyString = iCalFilter(res.text);

    parsedBodyString.should.equal(parsedString);
    should.not.exist(res.body.error);
    res.status.should.equal(StatusCode.OK);
  }).timeout(5000);

  it("Returns all calendar events", async () => {
    const calendarEvents = await calendarEventDao.findAll();
    const sortedEvents = calendarEvents.sort((a, b) => a.eventId - b.eventId);
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
    res.status.should.equal(StatusCode.OK);

    const sortedRes = body.payload!.sort((a, b) => a.eventId - b.eventId);

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

  it("Returns an error if request parameters are missing", (done) => {
    chai
      .request(app)
      .post(calendarUrl)
      .send({
        test: "Something"
      })
      .end((err, res: ChaiHttp.Response) => {
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
        res.status.should.equal(StatusCode.BAD_REQUEST);
        body.error!.message.should.equal("Missing request body parameters");
        done();
      });
  }).timeout(5000);

  it("Adds a calendar event", async () => {
    const calendarEvent: Partial<CalendarEvent> = {
      addedBy: 1,
      description: "Hello World",
      locationId: 1,
      name: "Test event",
      startTime: moment().format("YYYY-MM-DD HH:mm:ss"),
      endTime: moment()
        .add(2, "hours")
        .format("YYYY-MM-DD HH:mm:ss"),
      unionId: 1,
      restricted: 0
    };
    const res = await chai
      .request(app)
      .post(calendarUrl)
      .send(calendarEvent)
      .set("Authorization", generateToken());
    const body = res.body as ApiResponse<CalendarEvent>;
    should.not.exist(body.error);
    should.exist(body.payload);
    should.exist(body.success);
    body.success.should.equal(true);
    res.status.should.equal(StatusCode.CREATED);

    const event = body!.payload!;

    should.exist(event.description);
    should.exist(event.addedBy);
    should.exist(event.created_at);
    should.exist(event.updated_at);
    should.exist(event.endTime);
    should.exist(event.startTime);
    should.exist(event.restricted);
    should.exist(event.eventId);
    should.exist(event.locationId);
    should.exist(event.name);
    should.exist(event.unionId);

    event.description.should.equal(calendarEvent.description);
    moment(event.endTime)
      .format("YYYY-MM-DD HH:mm:ss")
      .should.equal(calendarEvent.endTime);
    event.locationId.should.equal(calendarEvent.locationId);
    event.name.should.equal(calendarEvent.name);
    event.restricted.should.equal(calendarEvent.restricted);
    moment(event.startTime)
      .format("YYYY-MM-DD HH:mm:ss")
      .should.equal(calendarEvent.startTime);
    event.unionId.should.equal(calendarEvent.unionId);
  }).timeout(5000);
});
