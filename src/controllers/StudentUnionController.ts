import express from "express";

import StudentUnionDao from "../dao/StudentUnionDao";
import { JWTMiddleware } from "../middleware/JWTMiddleware";
import { MessageFactory } from "../utils/MessageFactory";
import Controller from "./Controller";

import {
  isStudentUnion,
  Permission,
  StudentUnion,
  studentUnionFilter
} from "@alehuo/clubhouse-shared";
import moment from "moment";
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
      PermissionMiddleware(Permission.ALLOW_VIEW_STUDENT_UNIONS),
      async (req, res) => {
        try {
          const result = await this.studentUnionDao.findAll();
          return res.json(
            MessageFactory.createResponse<StudentUnion[]>(
              true,
              "Succesfully fetched student unions",
              result.map(studentUnionFilter)
            )
          );
        } catch (err) {
          return res
            .status(500)
            .json(MessageFactory.createError("Server error", err as Error));
        }
      }
    );

    this.router.get(
      "/:studentUnionId(\\d+)",
      JWTMiddleware,
      PermissionMiddleware(Permission.ALLOW_VIEW_STUDENT_UNIONS),
      async (req, res) => {
        try {
          const studentUnion = await this.studentUnionDao.findOne(
            req.params.studentUnionId
          );
          if (studentUnion) {
            return res
              .status(200)
              .json(
                MessageFactory.createResponse<StudentUnion>(
                  true,
                  "",
                  studentUnionFilter(studentUnion)
                )
              );
          } else {
            return res
              .status(404)
              .json(MessageFactory.createError("Student union not found"));
          }
        } catch (ex) {
          return res
            .status(500)
            .json(MessageFactory.createError("Server error", ex as Error));
        }
      }
    );

    this.router.post(
      "",
      RequestParamMiddleware("name", "description"),
      JWTMiddleware,
      PermissionMiddleware(Permission.ALLOW_ADD_EDIT_REMOVE_STUDENT_UNIONS),
      async (req, res) => {
        try {
          const { name, description }: StudentUnion = req.body;
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

            const newStdu: StudentUnion = {
              name,
              description,
              created_at: "",
              unionId: -1,
              updated_at: ""
            };

            if (!isStudentUnion(newStdu)) {
              return res
                .status(400)
                .json(
                  MessageFactory.createError(
                    "The request did not contain a valid student union object."
                  )
                );
            }

            const savedStudentUnion = await this.studentUnionDao.save(newStdu);

            return res.status(201).json(
              MessageFactory.createResponse<StudentUnion>(true, "", {
                ...{ name, description },
                ...{
                  unionId: savedStudentUnion[0],
                  created_at: moment().toISOString(),
                  updated_at: moment().toISOString()
                }
              })
            );
          }
        } catch (err) {
          return res
            .status(500)
            .json(MessageFactory.createError("Server error", err as Error));
        }
      }
    );

    this.router.delete(
      "/:studentUnionId(\\d+)",
      JWTMiddleware,
      PermissionMiddleware(Permission.ALLOW_ADD_EDIT_REMOVE_STUDENT_UNIONS),
      async (req, res) => {
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
                  "Server error: Cannot remove student union",
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
