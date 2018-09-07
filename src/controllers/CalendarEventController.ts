import * as express from "express";

import CalendarEventDao from "../dao/CalendarEventDao";
import { JWTMiddleware } from "../middleware/JWTMiddleware";
import { PermissionMiddleware } from "../middleware/PermissionMiddleware";
import { ICalendarEvent } from "../models/ICalendarEvent";
import { createICal, createICalStream } from "../utils/iCalUtils";
import { MessageFactory } from "../utils/MessageFactory";
import Controller from "./Controller";

import { Permissions } from "@alehuo/clubhouse-shared";
import { RequestParamMiddleware } from "../middleware/RequestParamMiddleware";

export default class CalendarEventController extends Controller {
  constructor(private calendarEventDao: CalendarEventDao) {
    super();
  }

  public routes(): express.Router {
    this.router.post(
      "",
      RequestParamMiddleware(
        "name",
        "description",
        "locationId",
        "restricted",
        "startTime",
        "endTime",
        "unionId"
      ),
      JWTMiddleware,
      PermissionMiddleware(Permissions.ALLOW_ADD_EDIT_REMOVE_EVENTS),
      async (req: express.Request, res: express.Response) => {
        const {
          name,
          description,
          locationId,
          restricted,
          startTime,
          endTime,
          unionId
        }: ICalendarEvent = req.body;
        const calendarEventData: ICalendarEvent = {
          name,
          description,
          locationId,
          restricted,
          startTime,
          endTime,
          addedBy: res.locals.token.userId,
          unionId
        };
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
    );

    this.router.get(
      "",
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
      "/ical",
      async (req: express.Request, res: express.Response) => {
        try {
          const events: ICalendarEvent[] = await this.calendarEventDao.findAll();
          const ical: string = await createICalStream(events);
          res.setHeader(
            "Content-disposition",
            "attachment; filename=events_all.ics"
          );
          res.setHeader("Content-type", "text/calendar");
          return res.send(ical);
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
      JWTMiddleware,
      PermissionMiddleware(Permissions.ALLOW_ADD_EDIT_REMOVE_EVENTS),
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
            const calData: string = await createICal(event);
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
                "Internal server error: Cannot get a single event as iCal",
                ex as Error
              )
            );
        }
      }
    );

    return this.router;
  }
}
