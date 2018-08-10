import * as express from "express";

import StudentUnionDao from "../dao/StudentUnionDao";
import IStudentUnion, { studentUnionFilter } from "../models/IStudentUnion";
import MessageFactory from "../Utils/MessageFactory";
import JwtMiddleware from "./../Middleware/JWTMiddleware";
import Controller from "./Controller";

import { Permissions } from "@alehuo/clubhouse-shared";
import { PermissionMiddleware } from "../middleware/PermissionMiddleware";

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
      JwtMiddleware,
      PermissionMiddleware(Permissions.ALLOW_VIEW_STUDENT_UNIONS),
      async (req: express.Request, res: express.Response) => {
        try {
          const result: IStudentUnion[] = await this.studentUnionDao.findAll();

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
      JwtMiddleware,
      PermissionMiddleware(Permissions.ALLOW_VIEW_STUDENT_UNIONS),
      async (req: express.Request, res: express.Response) => {
        try {
          const studentUnion: IStudentUnion = await this.studentUnionDao.findOne(
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
      JwtMiddleware,
      PermissionMiddleware(Permissions.ALLOW_ADD_STUDENT_UNION),
      async (req: express.Request, res: express.Response) => {
        try {
          const studentUnionData: IStudentUnion = req.body;
          if (!(studentUnionData.name && studentUnionData.description)) {
            return res
              .status(500)
              .json(
                MessageFactory.createError("Missing request body parameters")
              );
          } else {
            const studentUnion: IStudentUnion = await this.studentUnionDao.findByName(
              studentUnionData.name
            );

            if (studentUnion) {
              return res
                .status(400)
                .json(
                  MessageFactory.createError("Student union already exists")
                );
            } else {
              if (
                studentUnionData.name.length === 0 ||
                studentUnionData.description.length === 0
              ) {
                return res
                  .status(400)
                  .json(
                    MessageFactory.createError(
                      "Name or description cannot be empty"
                    )
                  );
              }

              const savedStudentUnion: number[] = await this.studentUnionDao.save(
                {
                  name: studentUnionData.name,
                  description: studentUnionData.description
                }
              );

              return res.status(201).json(
                Object.assign({}, studentUnionData, {
                  unionId: savedStudentUnion[0]
                })
              );
            }
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
      JwtMiddleware,
      PermissionMiddleware(Permissions.ALLOW_REMOVE_STUDENT_UNION),
      async (req: express.Request, res: express.Response) => {
        const studentUnion: IStudentUnion = await this.studentUnionDao.findOne(
          req.params.studentUnionId
        );
        if (studentUnion) {
          try {
            const result: boolean = await this.studentUnionDao.remove(
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
