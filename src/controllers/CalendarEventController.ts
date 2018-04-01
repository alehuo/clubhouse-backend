import * as express from "express";
import * as bcrypt from "bcrypt";
import IUser from "../models/IUser";

import Controller from "./Controller";
import CalendarEventDao from "../dao/CalendarEventDao";
import ICalendarEvent from "../models/ICalendarEvent";
import { createICal } from "./../iCalService";
import fs from "fs";
import { PermissionMiddleware } from "./../PermissionMiddleware";
import { JwtMiddleware } from "../JwtUtils";
import { getPermission, permissionNames } from "../PermissionUtils";

export default class CalendarEventController extends Controller {
  constructor(private calendarEventDao: CalendarEventDao) {
    super();
  }

  public routes(): express.Router {
    this.router.post(
      "",
      JwtMiddleware,
      PermissionMiddleware([getPermission(permissionNames.ADD_EVENT)]),
      async (req: express.Request, res: express.Response) => {
        const calendarEventData: ICalendarEvent = req.body;
        if (!calendarEventData) {
          return res
            .status(403)
            .json({ error: "Missing request body parameters" });
        } else {
          try {
            const calendarEvent = await this.calendarEventDao.save(
              calendarEventData
            );
            return res.status(200).json(
              Object.assign({}, calendarEventData, {
                eventId: calendarEvent[0]
              })
            );
          } catch (ex) {
            return res
              .status(500)
              .json({ error: "Error saving calendar event." });
          }
        }
      }
    );

    this.router.get("", async (req: express.Request, res: express.Response) => {
      try {
        const events: ICalendarEvent[] = await this.calendarEventDao.findAll();
        return res.status(200).json(events);
      } catch (ex) {
        return res.status(500).json({ error: "Internal server error" });
      }
    });

    this.router.get(
      "/:eventId",
      async (req: express.Request, res: express.Response) => {
        try {
          const events: ICalendarEvent[] = await this.calendarEventDao.findOne(
            req.params.eventId
          );
          if (!(events && events.length === 1)) {
            return res.status(404).json({ error: "Calendar event not found" });
          } else {
            return res.status(200).json(events[0]);
          }
        } catch (ex) {
          return res.status(500).json({ error: "Internal server error" });
        }
      }
    );

    // iCal
    this.router.get(
      "/:eventId/ical",
      async (req: express.Request, res: express.Response) => {
        try {
          const events: ICalendarEvent[] = await this.calendarEventDao.findOne(
            req.params.eventId
          );
          if (!(events && events.length > 0)) {
            return res.status(404).json({ error: "Event not found" });
          } else {
            const calData: string = createICal(events[0]);
            res.setHeader(
              "Content-disposition",
              "attachment; filename=event_" + events[0].eventId + ".ics"
            );
            res.setHeader("Content-type", "text/calendar");
            res.send(calData);
          }
        } catch (ex) {
          console.error(ex);
          return res.status(500).json({ error: "Internal server error" });
        }
      }
    );

    return this.router;
  }
}
