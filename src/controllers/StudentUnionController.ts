import express from "express";

import StudentUnionDao from "../dao/StudentUnionDao";
import { JWTMiddleware } from "../middleware/JWTMiddleware";
import { IStudentUnion, studentUnionFilter } from "../models/IStudentUnion";
import { MessageFactory } from "../utils/MessageFactory";
import Controller from "./Controller";

import { Permissions } from "@alehuo/clubhouse-shared";
import { PermissionMiddleware } from "../middleware/PermissionMiddleware";
import { RequestParamMiddleware } from "../middleware/RequestParamMiddleware";

/**
 * Student union controller.
 */
export default class StudentUnionController extends Controller {
  constructor(private studentUnionDao: StudentUnionDao) {
    super();
  }

  public routes(): express.Router {
    this.router.get(
      "",
      JWTMiddleware,
      PermissionMiddleware(Permissions.ALLOW_VIEW_STUDENT_UNIONS),
      async (req: express.Request, res: express.Response) => {
        try {
          const result = await this.studentUnionDao.findAll();
          return res.json(result.map(studentUnionFilter));
        } catch (err) {
          return res
            .status(500)
            .json(
              MessageFactory.createError("Internal server error", err as Error)
            );
        }
      }
    );

    this.router.get(
      "/:studentUnionId(\\d+)",
      JWTMiddleware,
      PermissionMiddleware(Permissions.ALLOW_VIEW_STUDENT_UNIONS),
      async (req: express.Request, res: express.Response) => {
        try {
          const studentUnion = await this.studentUnionDao.findOne(
            req.params.studentUnionId
          );
          if (studentUnion) {
            return res.status(200).json(studentUnionFilter(studentUnion));
          } else {
            return res
              .status(404)
              .json(MessageFactory.createError("Student union not found"));
          }
        } catch (ex) {
          return res
            .status(500)
            .json(
              MessageFactory.createError("Internal server error", ex as Error)
            );
        }
      }
    );

    this.router.post(
      "",
      RequestParamMiddleware("name", "description"),
      JWTMiddleware,
      PermissionMiddleware(Permissions.ALLOW_ADD_EDIT_REMOVE_STUDENT_UNIONS),
      async (req: express.Request, res: express.Response) => {
        try {
          const { name, description }: IStudentUnion = req.body;
          const studentUnion = await this.studentUnionDao.findByName(name);

          if (studentUnion) {
            return res
              .status(400)
              .json(MessageFactory.createError("Student union already exists"));
          } else {
            if (name.length === 0 || description.length === 0) {
              return res
                .status(400)
                .json(
                  MessageFactory.createError(
                    "Name or description cannot be empty"
                  )
                );
            }

            const savedStudentUnion = await this.studentUnionDao.save({
              name,
              description
            });

            return res.status(201).json({
              ...{ name, description },
              ...{
                unionId: savedStudentUnion[0]
              }
            });
          }
        } catch (err) {
          return res
            .status(500)
            .json(
              MessageFactory.createError("Internal server error", err as Error)
            );
        }
      }
    );

    this.router.delete(
      "/:studentUnionId(\\d+)",
      JWTMiddleware,
      PermissionMiddleware(Permissions.ALLOW_ADD_EDIT_REMOVE_STUDENT_UNIONS),
      async (req: express.Request, res: express.Response) => {
        const studentUnion = await this.studentUnionDao.findOne(
          req.params.studentUnionId
        );
        if (studentUnion) {
          try {
            const result = await this.studentUnionDao.remove(
              req.params.studentUnionId
            );
            if (result) {
              return res
                .status(200)
                .json(MessageFactory.createMessage("Student union removed"));
            } else {
              return res
                .status(400)
                .json(
                  MessageFactory.createError("Failed to remove student union")
                );
            }
          } catch (err) {
            return res
              .status(500)
              .json(
                MessageFactory.createError(
                  "Internal server error: Cannot remove student union",
                  err as Error
                )
              );
          }
        } else {
          return res
            .status(404)
            .json(MessageFactory.createError("Student union not found"));
        }
      }
    );

    return this.router;
  }
}
