import express from "express";
import Controller from "./Controller";

import NewsPostDao from "../dao/NewsPostDao";
import { JWTMiddleware } from "../middleware/JWTMiddleware";
import { MessageFactory } from "../utils/MessageFactory";

import {
  isNewspost,
  isNumber,
  Newspost,
  Permission
} from "@alehuo/clubhouse-shared";
import { PermissionMiddleware } from "../middleware/PermissionMiddleware";
import { RequestParamMiddleware } from "../middleware/RequestParamMiddleware";

export default class NewsPostController extends Controller {
  constructor(private newsPostDao: NewsPostDao) {
    super();
  }

  public routes(): express.Router {
    // All newsposts
    this.router.get("", async (req: express.Request, res: express.Response) => {
      try {
        const newsPosts = await this.newsPostDao.findAll();
        return res
          .status(200)
          .json(MessageFactory.createResponse<Newspost[]>(true, "", newsPosts));
      } catch (err) {
        return res
          .status(500)
          .json(
            MessageFactory.createError(
              "Internal server error: Cannot get all newsposts",
              err as Error
            )
          );
      }
    });
    // A single newspost
    this.router.get(
      "/:newsPostId(\\d+)",
      async (req: express.Request, res: express.Response) => {
        if (!isNumber(req.params.newsPostId)) {
          return res
            .status(400)
            .json(MessageFactory.createError("Invalid newspost ID"));
        }
        try {
          const newsPost = await this.newsPostDao.findOne(
            req.params.newsPostId
          );
          if (newsPost) {
            return res
              .status(200)
              .json(
                MessageFactory.createResponse<Newspost>(true, "", newsPost)
              );
          } else {
            return res
              .status(404)
              .json(MessageFactory.createError("Newspost not found"));
          }
        } catch (err) {
          return res
            .status(500)
            .json(
              MessageFactory.createError(
                "Internal server error: Cannot get a single newspost",
                err as Error
              )
            );
        }
      }
    );
    // All newsposts by a single user
    this.router.get(
      "/user/:userId(\\d+)",
      async (req: express.Request, res: express.Response) => {
        if (!isNumber(req.params.userId)) {
          return res
            .status(400)
            .json(MessageFactory.createError("Invalid user ID"));
        }
        try {
          const newsPost = await this.newsPostDao.findByAuthor(
            req.params.userId
          );
          return res
            .status(200)
            .json(
              MessageFactory.createResponse<Newspost[]>(true, "", newsPost)
            );
        } catch (err) {
          return res
            .status(500)
            .json(
              MessageFactory.createError(
                "Internal server error: Cannot get newspost from a single user",
                err as Error
              )
            );
        }
      }
    );

    // Add a newspost
    this.router.post(
      "",
      RequestParamMiddleware("title", "message"),
      JWTMiddleware,
      PermissionMiddleware(Permission.ALLOW_ADD_EDIT_REMOVE_POSTS),
      async (req: express.Request, res: express.Response) => {
        try {
          const userId: number = res.locals.token.data.userId;

          const savedPost: Newspost = {
            created_at: "", // Placeholder
            postId: -1, // Placeholder
            updated_at: "", // Placeholder
            message: req.body.message,
            title: req.body.title,
            author: userId
          };

          if (!isNewspost(savedPost)) {
            return res
              .status(400)
              .json(
                MessageFactory.createError(
                  "The request did not contain a valid newspost."
                )
              );
          }

          const newsPost = await this.newsPostDao.save(savedPost);
          if (newsPost.length > 0) {
            return res.status(201).json(
              MessageFactory.createResponse<Newspost>(true, "", {
                ...savedPost,
                ...{ postId: newsPost[0] }
              })
            );
          } else {
            return res
              .status(400)
              .json(MessageFactory.createError("Error saving newspost"));
          }
        } catch (err) {
          return res
            .status(500)
            .json(
              MessageFactory.createError(
                "Internal server error: Cannot add a newspost",
                err as Error
              )
            );
        }
      }
    );

    // Delete a newspost
    this.router.delete(
      "/:newsPostId(\\d+)",
      JWTMiddleware,
      PermissionMiddleware(Permission.ALLOW_ADD_EDIT_REMOVE_POSTS),
      async (req: express.Request, res: express.Response) => {
        if (!isNumber(req.params.newsPostId)) {
          return res
            .status(400)
            .json(MessageFactory.createError("Invalid newspost ID"));
        }
        try {
          const newsPost = await this.newsPostDao.findOne(
            req.params.newsPostId
          );
          if (newsPost) {
            const result = await this.newsPostDao.remove(req.params.newsPostId);
            if (result) {
              return res
                .status(200)
                .json(MessageFactory.createMessage("Newspost deleted"));
            } else {
              return res
                .status(400)
                .json(
                  MessageFactory.createMessage("Failed to delete newspost")
                );
            }
          } else {
            return res
              .status(404)
              .json(MessageFactory.createError("Newspost not found"));
          }
        } catch (err) {
          return res
            .status(500)
            .json(
              MessageFactory.createError(
                "Internal server error: Cannot delete newspost",
                err as Error
              )
            );
        }
      }
    );

    return this.router;
  }
}
