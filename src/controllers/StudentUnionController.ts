import * as express from "express";

import Controller from "./Controller";
import IStudentUnion, { studentUnionFilter } from "../models/IStudentUnion";
import StudentUnionDao from "../dao/StudentUnionDao";
import JwtMiddleware from "./../Middleware/JWTMiddleware";
import MessageFactory from "../Utils/MessageFactory";

import { PermissionMiddleware } from "../middleware/PermissionMiddleware";
import permissions = require("./../Permissions");

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
      PermissionMiddleware([permissions.ALLOW_VIEW_STUDENT_UNIONS]),
      async (req: express.Request, res: express.Response) => {
        try {
          const result: IStudentUnion[] = await this.studentUnionDao.findAll();

          return res.json(result.map(studentUnionFilter));
        } catch (err) {
          return res
            .status(500)
            .json(MessageFactory.createError("Internal server error"));
        }
      }
    );

    this.router.get(
      "/:studentUnionId(\\d+)",
      JwtMiddleware,
      PermissionMiddleware([permissions.ALLOW_VIEW_STUDENT_UNIONS]),
      async (req: express.Request, res: express.Response) => {
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
      }
    );

    this.router.post(
      "",
      JwtMiddleware,
      PermissionMiddleware([permissions.ALLOW_ADD_STUDENT_UNION]),
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
          console.error(err);
          return res
            .status(500)
            .json(MessageFactory.createError("Internal server error"));
        }
      }
    );

    this.router.delete(
      "/:studentUnionId(\\d+)",
      JwtMiddleware,
      PermissionMiddleware([permissions.ALLOW_REMOVE_STUDENT_UNION]),
      async (req: express.Request, res: express.Response) => {
        const studentUnion: IStudentUnion = await this.studentUnionDao.findOne(
          req.params.studentUnionId
        );
        if (studentUnion) {
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
