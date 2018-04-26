import * as express from "express";
import * as bcrypt from "bcrypt";
import Controller from "./Controller";
import { JwtMiddleware } from "../JwtUtils";
import NewsPostDao from "../dao/NewsPostDao";
import INewsPost from "../models/INewsPost";

import MessageFactory from "./../MessageFactory";

export default class NewsPostController extends Controller {
  constructor(private newsPostDao: NewsPostDao) {
    super();
  }

  public routes(): express.Router {
    // All newsposts
    this.router.get(
      "",
      JwtMiddleware,
      async (req: express.Request, res: express.Response) => {
        try {
          const newsPosts: INewsPost[] = await this.newsPostDao.findAll();
          return res.status(200).json(newsPosts);
        } catch (err) {
          return res
            .status(500)
            .json(MessageFactory.createError("Internal server error"));
        }
      }
    );
    // A single newspost
    this.router.get(
      "/:newsPostId(\\d+)",
      JwtMiddleware,
      async (req: express.Request, res: express.Response) => {
        try {
          const newsPost: INewsPost = await this.newsPostDao.findOne(
            req.params.newsPostId
          );
          if (newsPost) {
            return res.status(200).json(newsPost);
          } else {
            return res
              .status(404)
              .json(MessageFactory.createError("Newspost not found"));
          }
        } catch (err) {
          return res
            .status(500)
            .json(MessageFactory.createError("Internal server error"));
        }
      }
    );
    // All newsposts by a single user
    this.router.get(
      "/user/:userId(\\d+)",
      JwtMiddleware,
      async (req: express.Request, res: express.Response) => {
        try {
          const newsPost: INewsPost = await this.newsPostDao.findByAuthor(
            req.params.userId
          );
          return res.status(200).json(newsPost);
        } catch (err) {
          return res
            .status(500)
            .json(MessageFactory.createError("Internal server error"));
        }
      }
    );

    // Add a newspost
    this.router.post(
      "",
      JwtMiddleware,
      async (req: express.Request, res: express.Response) => {
        try {
          const userId = res.locals.token.data.userId;
          if (!(req.body.title && req.body.message)) {
            return res
              .status(400)
              .json(
                MessageFactory.createError("Missing request body parameters")
              );
          } else {
            const savedPost: INewsPost = {
              message: req.body.message,
              title: req.body.title,
              author: userId
            };
            const newsPost: number[] = await this.newsPostDao.save(savedPost);
            if (newsPost.length > 0) {
              return res
                .status(201)
                .json(Object.assign({}, savedPost, { postId: newsPost[0] }));
            } else {
              return res
                .status(400)
                .json(MessageFactory.createError("Error saving newspost"));
            }
          }
        } catch (err) {
          return res
            .status(500)
            .json(MessageFactory.createError("Internal server error"));
        }
      }
    );

    // Delete a newspost
    this.router.delete(
      "/:newsPostId(\\d+)",
      JwtMiddleware,
      async (req: express.Request, res: express.Response) => {
        try {
          const newsPost: INewsPost = await this.newsPostDao.findOne(
            req.params.newsPostId
          );
          if (newsPost) {
            const result: boolean = await this.newsPostDao.remove(
              req.params.newsPostId
            );
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
            .json(MessageFactory.createError("Internal server error"));
        }
      }
    );

    return this.router;
  }
}
