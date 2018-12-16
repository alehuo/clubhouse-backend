import express from "express";

import CalendarEventDao from "../dao/CalendarEventDao";
import { JWTMiddleware } from "../middleware/JWTMiddleware";
import { PermissionMiddleware } from "../middleware/PermissionMiddleware";
import { createICal, createICalStream } from "../utils/iCalUtils";
import { MessageFactory } from "../utils/MessageFactory";
import Controller from "./Controller";

import { CalendarEvent, Permission } from "@alehuo/clubhouse-shared";
import { isCalendarEvent } from "@alehuo/clubhouse-shared/dist/Validators";
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
      PermissionMiddleware(Permission.ALLOW_ADD_EDIT_REMOVE_EVENTS),
      async (req, res) => {
        const {
          name,
          description,
          locationId,
          restricted,
          startTime,
          endTime,
          unionId
        }: {
          name: string;
          description: string;
          locationId: number;
          restricted: 0 | 1;
          startTime: string;
          endTime: string;
          unionId: number;
        } = req.body;

        const calendarEventData: CalendarEvent = {
          eventId: -1, // Placeholder
          created_at: "placeholder", // Placeholder
          updated_at: "placeholder", // Placeholder
          name,
          description,
          locationId,
          restricted,
          startTime,
          endTime,
          addedBy: res.locals.token.userId,
          unionId
        };

        if (!isCalendarEvent(calendarEventData)) {
          return res
            .status(400)
            .json(
              MessageFactory.createError(
                "The request did not contain a valid calendar event."
              )
            );
        }

        try {
          const calendarEvent = await this.calendarEventDao.save(
            calendarEventData
          );
          return res.status(201).json(
            MessageFactory.createResponse<CalendarEvent>(
              true,
              "Succesfully saved calendar event",
              {
                ...{},
                ...calendarEventData,
                ...{
                  eventId: calendarEvent[0]
                }
              }
            )
          );
        } catch (ex) {
          return res
            .status(500)
            .json(
              MessageFactory.createError(
                "Server error: Cannot add a new event",
                ex as Error
              )
            );
        }
      }
    );

    this.router.get("", async (req, res) => {
      try {
        const events = await this.calendarEventDao.findAll();
        return res
          .status(200)
          .json(
            MessageFactory.createResponse<CalendarEvent[]>(
              true,
              "Succesfully fetched calendar events",
              events
            )
          );
      } catch (ex) {
        return res
          .status(500)
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
          .status(500)
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
            .status(400)
            .json(
              MessageFactory.createError(
                "The calendar event that was returned is invalid. Please contact a system administrator."
              )
            );
        }

        if (!event) {
          return res
            .status(404)
            .json(MessageFactory.createError("Calendar event not found"));
        } else {
          return res
            .status(200)
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
          .status(500)
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
              .status(404)
              .json(MessageFactory.createError("Calendar event not found"));
          } else {
            const result = await this.calendarEventDao.remove(
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
            .status(404)
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
          .status(500)
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
