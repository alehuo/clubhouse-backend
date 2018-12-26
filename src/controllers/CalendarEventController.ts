import express from "express";

import CalendarEventDao from "../dao/CalendarEventDao";
import { JWTMiddleware } from "../middleware/JWTMiddleware";
import { PermissionMiddleware } from "../middleware/PermissionMiddleware";
import { createICal, createICalStream } from "../utils/iCalUtils";
import { MessageFactory } from "../utils/MessageFactory";
import Controller from "./Controller";

import {
  CalendarEvent,
  isCalendarEvent,
  Permission
} from "@alehuo/clubhouse-shared";
import { RequestParamMiddleware } from "../middleware/RequestParamMiddleware";
import { StatusCode } from "../utils/StatusCodes";

export default class CalendarEventController extends Controller {
  constructor(private calendarEventDao: CalendarEventDao) {
    super();
  }

  public routes(): express.Router {
    this.router.post(
      "",
      RequestParamMiddleware<CalendarEvent>(
        "name",
        "description",
        "locationId",
        "restricted",
        "startTime",
        "endTime",
        "unionId"
      ),
      JWTMiddleware,
      PermissionMiddleware(Permission.ALLOW_ADD_EDIT_REMOVE_EVENTS),
      async (req, res) => {
        const calendarEventData: Partial<CalendarEvent> = {
          eventId: -1,
          name: req.body.name,
          description: req.body.description,
          locationId: req.body.locationId,
          restricted: req.body.restricted,
          startTime: req.body.startTime,
          endTime: req.body.endTime,
          addedBy: res.locals.token.data.userId,
          unionId: req.body.unionId,
          created_at: "",
          updated_at: ""
        };

        if (!isCalendarEvent(calendarEventData)) {
          return res
            .status(StatusCode.INTERNAL_SERVER_ERROR)
            .json(MessageFactory.createModelValidationError("CalendarEvent"));
        }

        try {
          const calendarEvent = await this.calendarEventDao.save(
            calendarEventData
          );
          if (calendarEvent[0]) {
            const event = await this.calendarEventDao.findOne(calendarEvent[0]);
            return res
              .status(StatusCode.CREATED)
              .json(
                MessageFactory.createResponse<CalendarEvent>(
                  true,
                  "Succesfully saved calendar event",
                  event
                )
              );
          } else {
            return res
              .status(StatusCode.BAD_REQUEST)
              .json(MessageFactory.createError("Failed to add calendar event"));
          }
        } catch (ex) {
          return res
            .status(StatusCode.INTERNAL_SERVER_ERROR)
            .json(
              MessageFactory.createError(
                "Server error: Cannot add a new calendar event",
                ex as Error
              )
            );
        }
      }
    );

    this.router.get("", async (req, res) => {
      try {
        const events = await this.calendarEventDao.findAll();
        if (!events.every(isCalendarEvent)) {
          return res
            .status(StatusCode.INTERNAL_SERVER_ERROR)
            .json(MessageFactory.createModelValidationError("CalendarEvent"));
        }
        return res
          .status(StatusCode.OK)
          .json(
            MessageFactory.createResponse<CalendarEvent[]>(
              true,
              "Succesfully fetched calendar events",
              events
            )
          );
      } catch (ex) {
        return res
          .status(StatusCode.INTERNAL_SERVER_ERROR)
          .json(
            MessageFactory.createError(
              "Server error: Cannot get all events",
              ex as Error
            )
          );
      }
    });

    this.router.get("/ical", async (req, res) => {
      try {
        const events = await this.calendarEventDao.findAll();
        const ical = await createICalStream(events);
        res.setHeader(
          "Content-disposition",
          "attachment; filename=events_all.ics"
        );
        res.setHeader("Content-type", "text/calendar");
        return res.send(ical);
      } catch (ex) {
        return res
          .status(StatusCode.INTERNAL_SERVER_ERROR)
          .json(
            MessageFactory.createError(
              "Server error: Cannot get all events",
              ex as Error
            )
          );
      }
    });

    this.router.get("/:eventId(\\d+)", async (req, res) => {
      try {
        const event = await this.calendarEventDao.findOne(req.params.eventId);
        if (!isCalendarEvent(event)) {
          return res
            .status(StatusCode.INTERNAL_SERVER_ERROR)
            .json(MessageFactory.createModelValidationError("CalendarEvent"));
        }

        if (!event) {
          return res
            .status(StatusCode.NOT_FOUND)
            .json(MessageFactory.createError("Calendar event not found"));
        } else {
          return res
            .status(StatusCode.OK)
            .json(
              MessageFactory.createResponse<CalendarEvent>(
                true,
                "Succesfully fetched single calendar event",
                event
              )
            );
        }
      } catch (ex) {
        return res
          .status(StatusCode.INTERNAL_SERVER_ERROR)
          .json(
            MessageFactory.createError(
              "Server error: Cannot get a single event",
              ex as Error
            )
          );
      }
    });

    this.router.delete(
      "/:eventId(\\d+)",
      JWTMiddleware,
      PermissionMiddleware(Permission.ALLOW_ADD_EDIT_REMOVE_EVENTS),
      async (req, res) => {
        try {
          const event = await this.calendarEventDao.findOne(req.params.eventId);
          if (!event) {
            return res
              .status(StatusCode.NOT_FOUND)
              .json(MessageFactory.createError("Calendar event not found"));
          } else {
            const result = await this.calendarEventDao.remove(
              req.params.eventId
            );
            if (result) {
              return res
                .status(StatusCode.OK)
                .json(MessageFactory.createMessage("Calendar event removed"));
            } else {
              return res
                .status(StatusCode.INTERNAL_SERVER_ERROR)
                .json(
                  MessageFactory.createError("Failed to remove calendar event")
                );
            }
          }
        } catch (ex) {
          return res
            .status(StatusCode.INTERNAL_SERVER_ERROR)
            .json(
              MessageFactory.createError(
                "Server error: Cannot delete a single event",
                ex as Error
              )
            );
        }
      }
    );

    // iCal
    this.router.get("/:eventId(\\d+)/ical", async (req, res) => {
      try {
        const event = await this.calendarEventDao.findOne(req.params.eventId);
        if (!event) {
          return res
            .status(StatusCode.NOT_FOUND)
            .json(MessageFactory.createError("Event not found"));
        } else {
          const calData = await createICal(event);
          res.setHeader(
            "Content-disposition",
            "attachment; filename=event_" + event.eventId + ".ics"
          );
          res.setHeader("Content-type", "text/calendar");
          return res.send(calData);
        }
      } catch (ex) {
        return res
          .status(StatusCode.INTERNAL_SERVER_ERROR)
          .json(
            MessageFactory.createError(
              "Server error: Cannot get a single event in iCal format",
              ex as Error
            )
          );
      }
    });

    return this.router;
  }
}
