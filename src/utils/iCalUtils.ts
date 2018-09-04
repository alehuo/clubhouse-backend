import * as moment from "moment";
import { ICalendarEvent } from "../models/ICalendarEvent";

import * as Knex from "knex";
import LocationDao from "../dao/LocationDao";
import * as Database from "../Database";
import { ILocation } from "../models/ILocation";
const knex: Knex = Database.connect();

const locationDao: LocationDao = new LocationDao(knex);

export const createICal: (
  data: ICalendarEvent,
  dtStamp?: Date,
  uidStamp?: Date
) => Promise<string> = async (
  data: ICalendarEvent,
  dtStamp: Date = new Date(),
  uidStamp: Date = new Date()
): Promise<string> => {
  const dStart: string = moment(new Date(data.startTime)).format(
    "YYYYMMDDTHHmmss"
  );
  const dEnd: string = moment(new Date(data.endTime)).format("YYYYMMDDTHHmmss");

  // Let's construct a valid iCal formatted string.

  let iCalData: string = "";
  iCalData += "BEGIN:VCALENDAR\r\n";
  iCalData += "VERSION:2.0\r\n";
  iCalData += "PRODID:clubhouse\r\n";
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
    "\r\n";
  iCalData += "DTSTART:" + dStart + "\r\n";
  iCalData += "DTEND:" + dEnd + "\r\n";
  iCalData += "SUMMARY: " + data.name + "\r\n";
  iCalData += "DESCRIPTION: " + data.description + "\r\n";
  if (data.locationId !== null) {
    const location: ILocation = await locationDao.findOne(data.locationId);
    iCalData += "LOCATION: " + location.address.trim() + "\r\n";
  }
  iCalData += "CLASS:PRIVATE\r\n";
  iCalData += "END:VEVENT\r\n";
  iCalData += "END:VCALENDAR";
  return iCalData;
};

export const iCalFilter: (cal: string) => string = (cal: string) =>
  cal
    .split("\r\n")
    .filter((line: string) => {
      return !(line.indexOf("DTSTAMP:") > -1 || line.indexOf("UID:") > -1);
    })
    .join("\r\n");
