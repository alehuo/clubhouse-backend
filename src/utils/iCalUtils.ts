import { CalendarEvent } from "@alehuo/clubhouse-shared";
import moment from "moment";

import LocationDao from "../dao/LocationDao";
import * as Database from "../Database";

const knex = Database.connect();

const locationDao = new LocationDao(knex);

export const createICal = async (
  data: CalendarEvent,
  dtStamp: string = moment().format("YYYYMMDDTHHmmss"),
  uidStamp: string = moment().format("YYYYMMDDTHHmmss")
) => {
  const dStart = moment(data.startTime).format("YYYYMMDDTHHmmss");
  const dEnd = moment(data.endTime).format("YYYYMMDDTHHmmss");

  // Let's construct a valid iCal formatted string.

  let iCalData = "";
  iCalData += "BEGIN:VCALENDAR\r\n";
  iCalData += "VERSION:2.0\r\n";
  iCalData += "PRODID:clubhouse\r\n";
  iCalData += "METHOD:PUBLISH\r\n";
  iCalData += "BEGIN:VEVENT\r\n";
  iCalData += "CATEGORIES:MEETING\r\n";
  iCalData += "STATUS:TENTATIVE\r\n";
  iCalData += "DTSTAMP:" + moment(dtStamp).format("YYYYMMDDTHHmmss") + "\r\n";
  iCalData += "DTSTART:" + dStart + "\r\n";
  iCalData +=
    "UID:" +
    moment(uidStamp).format("YYYYMMDDTHHmmss") +
    "@" +
    process.env.CAL_DOMAIN +
    "_" +
    data.eventId +
    "\r\n";
  iCalData += "DTSTART:" + dStart + "\r\n";
  iCalData += "DTEND:" + dEnd + "\r\n";
  iCalData += "SUMMARY: " + data.name + "\r\n";
  iCalData += "DESCRIPTION: " + data.description + "\r\n";
  if (data.locationId !== undefined) {
    const location = await locationDao.findOne(data.locationId);
    iCalData += "LOCATION: " + location.address.trim() + "\r\n";
  }
  iCalData += "CLASS:PRIVATE\r\n";
  iCalData += "END:VEVENT\r\n";
  iCalData += "END:VCALENDAR";
  return iCalData;
};

export const createICalStream = async (
  data: CalendarEvent[],
  dtStamp: string = moment().format("YYYYMMDDTHHmmss"),
  uidStamp: string = moment().format("YYYYMMDDTHHmmss")
) => {
  let iCalData = "";
  iCalData += "BEGIN:VCALENDAR\r\n";
  iCalData += "VERSION:2.0\r\n";
  iCalData += "PRODID:clubhouse\r\n";
  iCalData += "METHOD:PUBLISH\r\n";

  for (const event of data) {
    const dStart = moment(event.startTime).format("YYYYMMDDTHHmmss");
    const dEnd = moment(event.endTime).format("YYYYMMDDTHHmmss");

    // Let's construct a valid iCal formatted string.

    iCalData += "BEGIN:VEVENT\r\n";
    iCalData += "CATEGORIES:MEETING\r\n";
    iCalData += "STATUS:TENTATIVE\r\n";
    iCalData += "DTSTAMP:" + moment(dtStamp).format("YYYYMMDDTHHmmss") + "\r\n";
    iCalData += "DTSTART:" + dStart + "\r\n";
    iCalData +=
      "UID:" +
      moment(uidStamp).format("YYYYMMDDTHHmmss") +
      "@" +
      process.env.CAL_DOMAIN +
      "_" +
      event.eventId +
      "\r\n";
    iCalData += "DTSTART:" + dStart + "\r\n";
    iCalData += "DTEND:" + dEnd + "\r\n";
    iCalData += "SUMMARY: " + event.name + "\r\n";
    iCalData += "DESCRIPTION: " + event.description + "\r\n";
    if (event.locationId !== undefined) {
      const location = await locationDao.findOne(event.locationId);
      iCalData += "LOCATION: " + location.address.trim() + "\r\n";
    }
    iCalData += "CLASS:PRIVATE\r\n";
    iCalData += "END:VEVENT\r\n";
  }

  iCalData += "END:VCALENDAR";
  return iCalData;
};

export const iCalFilter = (cal: string) =>
  cal
    .split("\r\n")
    .filter(
      (line) => !(line.indexOf("DTSTAMP:") > -1 || line.indexOf("UID:") > -1)
    )
    .join("\r\n");
