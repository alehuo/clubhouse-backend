import * as express from "express";
import * as bcrypt from "bcrypt";
import Controller from "./Controller";
import { JwtMiddleware } from "../JwtUtils";
import { PermissionMiddleware } from "../PermissionMiddleware";
import { getPermission, permissionNames } from "../PermissionUtils";
import IMessage from "../models/IMessage";
import MessageDao from "../dao/MessageDao";

import MessageFactory from "./../MessageFactory";

export default class MessageController extends Controller {
  constructor(private messageDao: MessageDao) {
    super();
  }

  public routes(): express.Router {
    // All messages
    this.router.get(
      "",
      JwtMiddleware,
      async (req: express.Request, res: express.Response) => {
        try {
          const messages: IMessage[] = await this.messageDao.findAll();
          return res.status(200).json(messages);
        } catch (err) {
          return res
            .status(500)
            .json(MessageFactory.createError("Internal server error"));
        }
      }
    );
    // A single message
    this.router.get(
      "/:messageId(\\d+)",
      JwtMiddleware,
      async (req: express.Request, res: express.Response) => {
        try {
          const messages: IMessage[] = await this.messageDao.findOne(
            req.params.messageId
          );
          if (messages && messages.length === 1) {
            return res.status(200).json(messages[0]);
          } else {
            return res
              .status(404)
              .json(MessageFactory.createError("Message not found"));
          }
        } catch (err) {
          return res
            .status(500)
            .json(MessageFactory.createError("Internal server error"));
        }
      }
    );
    // Add a message
    this.router.post(
      "",
      JwtMiddleware,
      async (req: express.Request, res: express.Response) => {
        try {
          if (!req.body.message) {
            return res
              .status(400)
              .json(MessageFactory.createError("Missing message"));
          }

          const userId: number = res.locals.token.data.userId;
          const currentTimestamp: Date = new Date();

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
            .json(MessageFactory.createError("Internal server error"));
        }
      }
    );

    return this.router;
  }
}
