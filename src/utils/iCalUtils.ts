import * as moment from "moment";
import ICalendarEvent from "../models/ICalendarEvent";

export const createICal = (data: ICalendarEvent) => {
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
  iCalData +=
    "DTSTAMP:" + moment(new Date()).format("YYYYMMDDTHHmmss") + "\r\n";
  iCalData += "DTSTART:" + dStart + "\r\n";
  iCalData +=
    "UID:" +
    moment(new Date()).format("YYYYMMDDTHHmmss") +
    "@" +
    process.env.CAL_DOMAIN +
    "\r\n";
  iCalData += "DTSTART:" + dStart + "\r\n";
  iCalData += "DTEND:" + dEnd + "\r\n";
  iCalData += "SUMMARY: " + data.name + "\r\n";
  iCalData += "DESCRIPTION: " + data.description + "\r\n";
  /*
  Temp
  if (data.location !== null) {
    iCalData += "LOCATION: " + data.location + "\r\n";
  }*/
  iCalData += "CLASS:PRIVATE\r\n";
  iCalData += "END:VEVENT\r\n";
  iCalData += "END:VCALENDAR";
  return iCalData;
};
