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
import { isString } from "util";
import { dtFormat, logger } from "../index";
import { PermissionMiddleware } from "../middleware/PermissionMiddleware";
import { RequestParamMiddleware } from "../middleware/RequestParamMiddleware";
import { StatusCode } from "../utils/StatusCodes";

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
          if (!result.every(isStudentUnion)) {
            return res
              .status(StatusCode.INTERNAL_SERVER_ERROR)
              .json(MessageFactory.createModelValidationError("StudentUnion"));
          }
          return res
            .status(StatusCode.OK)
            .json(
              MessageFactory.createResponse<StudentUnion[]>(
                true,
                "Succesfully fetched student unions",
                result.map(studentUnionFilter)
              )
            );
        } catch (err) {
          logger.error(err);
          return res
            .status(StatusCode.INTERNAL_SERVER_ERROR)
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
            if (!isStudentUnion(studentUnion)) {
              return res
                .status(StatusCode.INTERNAL_SERVER_ERROR)
                .json(
                  MessageFactory.createModelValidationError("StudentUnion")
                );
            }
            return res
              .status(StatusCode.OK)
              .json(
                MessageFactory.createResponse<StudentUnion>(
                  true,
                  "",
                  studentUnionFilter(studentUnion)
                )
              );
          } else {
            return res
              .status(StatusCode.NOT_FOUND)
              .json(MessageFactory.createError("Student union not found"));
          }
        } catch (ex) {
          logger.error(ex);
          return res
            .status(StatusCode.INTERNAL_SERVER_ERROR)
            .json(MessageFactory.createError("Server error", ex as Error));
        }
      }
    );

    this.router.post(
      "",
      RequestParamMiddleware<StudentUnion>("name", "description"),
      JWTMiddleware,
      PermissionMiddleware(Permission.ALLOW_ADD_EDIT_REMOVE_STUDENT_UNIONS),
      async (req, res) => {
        try {
          const { name, description }: Partial<StudentUnion> = req.body;

          if (!isString(name) || !isString(description)) {
            return res
              .status(StatusCode.BAD_REQUEST)
              .json(MessageFactory.createError("Invalid request params"));
          }

          const studentUnion = await this.studentUnionDao.findByName(name);

          if (studentUnion) {
            return res
              .status(StatusCode.BAD_REQUEST)
              .json(MessageFactory.createError("Student union already exists"));
          } else {
            if (name.length === 0 || description.length === 0) {
              return res
                .status(StatusCode.BAD_REQUEST)
                .json(
                  MessageFactory.createError(
                    "Name or description cannot be empty"
                  )
                );
            }

            const newStdu: Partial<StudentUnion> = {
              name,
              description,
              created_at: "",
              unionId: -1,
              updated_at: ""
            };

            if (!isStudentUnion(newStdu)) {
              return res
                .status(StatusCode.BAD_REQUEST)
                .json(
                  MessageFactory.createError(
                    "The request did not contain a valid student union object."
                  )
                );
            }

            const savedStudentUnion = await this.studentUnionDao.save(newStdu);

            return res.status(StatusCode.CREATED).json(
              MessageFactory.createResponse<StudentUnion>(true, "", {
                ...{ name, description },
                ...{
                  unionId: savedStudentUnion[0],
                  created_at: moment().format(dtFormat),
                  updated_at: moment().format(dtFormat)
                }
              })
            );
          }
        } catch (err) {
          logger.error(err);
          return res
            .status(StatusCode.INTERNAL_SERVER_ERROR)
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
                .status(StatusCode.OK)
                .json(MessageFactory.createMessage("Student union removed"));
            } else {
              return res
                .status(StatusCode.BAD_REQUEST)
                .json(
                  MessageFactory.createError("Failed to remove student union")
                );
            }
          } catch (err) {
            logger.error(err);
            return res
              .status(StatusCode.INTERNAL_SERVER_ERROR)
              .json(
                MessageFactory.createError(
                  "Server error: Cannot remove student union",
                  err as Error
                )
              );
          }
        } else {
          return res
            .status(StatusCode.NOT_FOUND)
            .json(MessageFactory.createError("Student union not found"));
        }
      }
    );

    return this.router;
  }
}
