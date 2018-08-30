import * as express from "express";
import Controller from "./Controller";

import MessageDao from "../dao/MessageDao";
import { JWTMiddleware } from "../middleware/JWTMiddleware";
import { IMessage } from "../models/IMessage";
import { MessageFactory } from "../utils/MessageFactory";

export default class MessageController extends Controller {
  constructor(private messageDao: MessageDao) {
    super();
  }

  public routes(): express.Router {
    // All messages
    this.router.get(
      "",
      JWTMiddleware,
      async (req: express.Request, res: express.Response) => {
        try {
          const messages: IMessage[] = await this.messageDao.findAll();
          return res.status(200).json(messages);
        } catch (err) {
          return res
            .status(500)
            .json(
              MessageFactory.createError(
                "Internal server error: Cannot get all messages",
                err as Error
              )
            );
        }
      }
    );
    // A single message
    this.router.get(
      "/:messageId(\\d+)",
      JWTMiddleware,
      async (req: express.Request, res: express.Response) => {
        try {
          const message: IMessage = await this.messageDao.findOne(
            req.params.messageId
          );
          if (message) {
            return res.status(200).json(message);
          } else {
            return res
              .status(404)
              .json(MessageFactory.createError("Message not found"));
          }
        } catch (err) {
          return res
            .status(500)
            .json(
              MessageFactory.createError(
                "Internal server error: Cannot get a single message",
                err as Error
              )
            );
        }
      }
    );
    // Add a message
    this.router.post(
      "",
      JWTMiddleware,
      async (req: express.Request, res: express.Response) => {
        try {
          if (!req.body.message) {
            return res
              .status(400)
              .json(MessageFactory.createError("Missing message"));
          }

          const userId: number = res.locals.token.data.userId;
          // const currentTimestamp: Date = new Date();

          const msg: IMessage = {
            message: req.body.message,
            userId
          };

          const savedMessage: number[] = await this.messageDao.save(msg);

          return res
            .status(201)
            .json(Object.assign({}, msg, { messageId: savedMessage[0] }));
        } catch (err) {
          return res
            .status(500)
            .json(
              MessageFactory.createError(
                "Internal server error: Cannot add a message",
                err as Error
              )
            );
        }
      }
    );

    this.router.delete(
      "/:messageId(\\d+)",
      JWTMiddleware,
      async (req: express.Request, res: express.Response) => {
        try {
          const message: IMessage = await this.messageDao.findOne(
            req.params.messageId
          );
          if (message) {
            const result: boolean = await this.messageDao.remove(
              req.params.messageId
            );
            if (result) {
              return res
                .status(200)
                .json(MessageFactory.createError("Message removed"));
            } else {
              return res
                .status(400)
                .json(MessageFactory.createError("Failed to remove message"));
            }
          } else {
            return res
              .status(404)
              .json(MessageFactory.createError("Message not found"));
          }
        } catch (err) {
          return res
            .status(500)
            .json(
              MessageFactory.createError(
                "Internal server error: Cannot delete a message",
                err as Error
              )
            );
        }
      }
    );

    return this.router;
  }
}
