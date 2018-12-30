import express from "express";
import Controller from "./Controller";

import NewsPostDao from "../dao/NewsPostDao";
import { JWTMiddleware } from "../middleware/JWTMiddleware";
import { MessageFactory } from "../utils/MessageFactory";

import { isNewspost, Newspost, Permission } from "@alehuo/clubhouse-shared";
import { logger } from "../index";
import { PermissionMiddleware } from "../middleware/PermissionMiddleware";
import { RequestParamMiddleware } from "../middleware/RequestParamMiddleware";
import { StatusCode } from "../utils/StatusCodes";

export default class NewsPostController extends Controller {
  constructor(private newsPostDao: NewsPostDao) {
    super();
  }

  public routes(): express.Router {
    // All newsposts
    this.router.get("", async (req, res) => {
      try {
        const newsPosts = await this.newsPostDao.findAll();

        if (!newsPosts.every(isNewspost)) {
          return res
            .status(StatusCode.INTERNAL_SERVER_ERROR)
            .json(MessageFactory.createModelValidationError("Newspost"));
        }

        return res
          .status(StatusCode.OK)
          .json(MessageFactory.createResponse<Newspost[]>(true, "", newsPosts));
      } catch (err) {
        logger.log("error", err);
        return res
          .status(StatusCode.INTERNAL_SERVER_ERROR)
          .json(
            MessageFactory.createError(
              "Server error: Cannot get all newsposts",
              err as Error
            )
          );
      }
    });
    // A single newspost
    this.router.get("/:newsPostId(\\d+)", async (req, res) => {
      try {
        const newsPost = await this.newsPostDao.findOne(req.params.newsPostId);
        if (newsPost) {
          if (!isNewspost(newsPost)) {
            return res
              .status(StatusCode.INTERNAL_SERVER_ERROR)
              .json(MessageFactory.createModelValidationError("Newspost"));
          }
          return res
            .status(200)
            .json(MessageFactory.createResponse<Newspost>(true, "", newsPost));
        }
        return res
          .status(StatusCode.NOT_FOUND)
          .json(MessageFactory.createError("Newspost not found"));
      } catch (err) {
        logger.log("error", err);
        return res
          .status(StatusCode.INTERNAL_SERVER_ERROR)
          .json(
            MessageFactory.createError(
              "Server error: Cannot get a single newspost",
              err as Error
            )
          );
      }
    });
    // All newsposts by a single user
    this.router.get("/user/:userId(\\d+)", async (req, res) => {
      try {
        const newsPost = await this.newsPostDao.findByAuthor(req.params.userId);
        if (!newsPost.every(isNewspost)) {
          return res
            .status(StatusCode.INTERNAL_SERVER_ERROR)
            .json(MessageFactory.createModelValidationError("Newspost"));
        }
        return res
          .status(StatusCode.OK)
          .json(MessageFactory.createResponse<Newspost[]>(true, "", newsPost));
      } catch (err) {
        logger.log("error", err);
        return res
          .status(StatusCode.INTERNAL_SERVER_ERROR)
          .json(
            MessageFactory.createError(
              "Internal server error: Cannot get newspost from a single user",
              err as Error
            )
          );
      }
    });

    // Add a newspost
    this.router.post(
      "",
      RequestParamMiddleware<Newspost>("title", "message"),
      JWTMiddleware,
      PermissionMiddleware(Permission.ALLOW_ADD_EDIT_REMOVE_POSTS),
      async (req, res) => {
        try {
          const userId: number = res.locals.token.data.userId;

          const savedPost: Partial<Newspost> = {
            created_at: "", // Placeholder
            postId: -1, // Placeholder
            updated_at: "", // Placeholder
            message: req.body.message,
            title: req.body.title,
            author: userId
          };

          if (!isNewspost(savedPost)) {
            return res
              .status(StatusCode.INTERNAL_SERVER_ERROR)
              .json(
                MessageFactory.createError(
                  "The request did not contain a valid newspost."
                )
              );
          }

          const newsPost = await this.newsPostDao.save(savedPost);
          if (newsPost.length > 0) {
            return res.status(StatusCode.CREATED).json(
              MessageFactory.createResponse<Newspost>(true, "", {
                ...savedPost,
                ...{ postId: newsPost[0] }
              })
            );
          }
          return res
            .status(StatusCode.BAD_REQUEST)
            .json(MessageFactory.createError("Error saving newspost"));
        } catch (err) {
          logger.log("error", err);
          return res
            .status(StatusCode.INTERNAL_SERVER_ERROR)
            .json(
              MessageFactory.createError(
                "Server error: Cannot add a newspost",
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
      async (req, res) => {
        try {
          const newsPost = await this.newsPostDao.findOne(
            req.params.newsPostId
          );
          if (newsPost) {
            const result = await this.newsPostDao.remove(req.params.newsPostId);
            if (result) {
              return res
                .status(StatusCode.OK)
                .json(MessageFactory.createMessage("Newspost deleted"));
            }
            return res
              .status(StatusCode.BAD_REQUEST)
              .json(MessageFactory.createMessage("Failed to delete newspost"));
          } else {
            return res
              .status(StatusCode.NOT_FOUND)
              .json(MessageFactory.createError("Newspost not found"));
          }
        } catch (err) {
          logger.log("error", err);
          return res
            .status(StatusCode.INTERNAL_SERVER_ERROR)
            .json(
              MessageFactory.createError(
                "Server error: Cannot delete newspost",
                err as Error
              )
            );
        }
      }
    );

    return this.router;
  }
}
