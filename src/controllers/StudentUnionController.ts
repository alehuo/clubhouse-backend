import * as express from "express";

import Controller from "./Controller";
import IStudentUnion, { studentUnionFilter } from "../models/IStudentUnion";
import StudentUnionDao from "../dao/StudentUnionDao";
import { JwtMiddleware } from "../JwtUtils";
import { PermissionMiddleware } from "../PermissionMiddleware";
import { getPermission, permissionNames } from "../PermissionUtils";

/**
 * Student union controller.
 */
export default class StudentUnionController extends Controller {
  constructor(private studentUnionDao: StudentUnionDao) {
    super();
  }

  public routes(): express.Router {
    this.router.get("", async (req: express.Request, res: express.Response) => {
      try {
        const result: IStudentUnion[] = await this.studentUnionDao.findAll();

        return res.json(result.map(studentUnionFilter));
      } catch (err) {
        return res.status(500).json({ error: "Internal server error" });
      }
    });

    this.router.get(
      "/:studentUnionId",
      async (req: express.Request, res: express.Response) => {
        const studentUnions: IStudentUnion[] = await this.studentUnionDao.findOne(
          req.params.studentUnionId
        );
        if (studentUnions && studentUnions.length === 1) {
          return res.status(200).json(studentUnionFilter(studentUnions[0]));
        } else {
          return res.status(404).json({ error: "Student union not found" });
        }
      }
    );

    this.router.post(
      "",
      JwtMiddleware,
      PermissionMiddleware([getPermission(permissionNames.ADD_STUDENT_UNION)]),
      async (req: express.Request, res: express.Response) => {
        try {
          const studentUnionData: IStudentUnion = req.body;
          if (!(studentUnionData.name && studentUnionData.description)) {
            return res
              .status(500)
              .json({ error: "Missing request body parameters" });
          } else {
            const studentUnion: IStudentUnion[] = await this.studentUnionDao.findByName(
              studentUnionData.name
            );

            if (studentUnion && studentUnion.length > 0) {
              return res
                .status(400)
                .json({ error: "Student union already exists" });
            } else {
              if (
                studentUnionData.name.length === 0 ||
                studentUnionData.description.length === 0
              ) {
                return res
                  .status(400)
                  .json({ error: "Name or description cannot be empty" });
              }

              const savedStudentUnion: number[] = await this.studentUnionDao.save(
                {
                  name: studentUnionData.name,
                  description: studentUnionData.description
                }
              );

              return res.status(201).json(
                Object.assign({}, studentUnionData, {
                  studentUnionId: savedStudentUnion[0]
                })
              );
            }
          }
        } catch (err) {
          console.error(err);
          return res.status(500).json({ error: "Internal server error" });
        }
      }
    );

    return this.router;
  }
}
