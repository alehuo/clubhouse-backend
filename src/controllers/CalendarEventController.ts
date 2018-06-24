import * as express from "express";

import CalendarEventDao from "../dao/CalendarEventDao";
import ICalendarEvent from "../models/ICalendarEvent";
import JwtMiddleware from "./../Middleware/JWTMiddleware";
import { createICal } from "./../utils/iCalUtils";
import Controller from "./Controller";

import { PermissionMiddleware } from "../middleware/PermissionMiddleware";
import permissions = require("./../Permissions");
import MessageFactory from "./../Utils/MessageFactory";

export default class CalendarEventController extends Controller {
  constructor(private calendarEventDao: CalendarEventDao) {
    super();
  }

  public routes(): express.Router {
    this.router.post(
      "",
      JwtMiddleware,
      PermissionMiddleware([permissions.ALLOW_ADD_EVENT]),
      async (req: express.Request, res: express.Response) => {
        const calendarEventData: ICalendarEvent = req.body;
        if (!calendarEventData) {
          return res
            .status(403)
            .json(
              MessageFactory.createError("Missing request body parameters")
            );
        } else {
          try {
            const calendarEvent: number[] = await this.calendarEventDao.save(
              calendarEventData
            );
            return res.status(201).json(
              Object.assign({}, calendarEventData, {
                eventId: calendarEvent[0]
              })
            );
          } catch (ex) {
            return res
              .status(500)
              .json(
                MessageFactory.createError(
                  "Internal server error: Cannot add a new event",
                  ex as Error
                )
              );
          }
        }
      }
    );

    this.router.get(
      "",
      JwtMiddleware,
      PermissionMiddleware([permissions.ALLOW_VIEW_EVENTS]),
      async (req: express.Request, res: express.Response) => {
        try {
          const events: ICalendarEvent[] = await this.calendarEventDao.findAll();
          return res.status(200).json(events);
        } catch (ex) {
          return res
            .status(500)
            .json(
              MessageFactory.createError(
                "Internal server error: Cannot get all events",
                ex as Error
              )
            );
        }
      }
    );

    this.router.get(
      "/:eventId(\\d+)",
      JwtMiddleware,
      PermissionMiddleware([permissions.ALLOW_VIEW_EVENTS]),
      async (req: express.Request, res: express.Response) => {
        try {
          const event: ICalendarEvent = await this.calendarEventDao.findOne(
            req.params.eventId
          );
          if (!event) {
            return res
              .status(404)
              .json(MessageFactory.createError("Calendar event not found"));
          } else {
            return res.status(200).json(event);
          }
        } catch (ex) {
          return res
            .status(500)
            .json(
              MessageFactory.createError(
                "Internal server error: Cannot get a single event",
                ex as Error
              )
            );
        }
      }
    );

    this.router.delete(
      "/:eventId(\\d+)",
      JwtMiddleware,
      PermissionMiddleware([permissions.ALLOW_REMOVE_EVENT]),
      async (req: express.Request, res: express.Response) => {
        try {
          const event: ICalendarEvent = await this.calendarEventDao.findOne(
            req.params.eventId
          );
          if (!event) {
            return res
              .status(404)
              .json(MessageFactory.createError("Calendar event not found"));
          } else {
            const result: boolean = await this.calendarEventDao.remove(
              req.params.eventId
            );
            if (result) {
              return res
                .status(200)
                .json(MessageFactory.createMessage("Calendar event removed"));
            } else {
              return res
                .status(400)
                .json(
                  MessageFactory.createError("Failed to remove calendar event")
                );
            }
          }
        } catch (ex) {
          return res
            .status(500)
            .json(
              MessageFactory.createError(
                "Internal server error: Cannot delete a single event",
                ex as Error
              )
            );
        }
      }
    );

    // iCal
    this.router.get(
      "/:eventId(\\d+)/ical",
      JwtMiddleware,
      PermissionMiddleware([permissions.ALLOW_VIEW_EVENTS]),
      async (req: express.Request, res: express.Response) => {
        try {
          const event: ICalendarEvent = await this.calendarEventDao.findOne(
            req.params.eventId
          );
          if (!event) {
            return res
              .status(404)
              .json(MessageFactory.createError("Event not found"));
          } else {
            const calData: string = createICal(event);
            res.setHeader(
              "Content-disposition",
              "attachment; filename=event_" + event.eventId + ".ics"
            );
            res.setHeader("Content-type", "text/calendar");
            return res.send(calData);
          }
        } catch (ex) {
          return res
            .status(500)
            .json(
              MessageFactory.createError(
                "Internal server erro: Cannot get a single event as iCal",
                ex as Error
              )
            );
        }
      }
    );

    return this.router;
  }
}
