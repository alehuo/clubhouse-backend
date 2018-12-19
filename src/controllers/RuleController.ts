import { Rule } from "@alehuo/clubhouse-shared";
import express from "express";
import RuleDao from "../dao/RuleDao";
import { MessageFactory } from "../utils/MessageFactory";
import Controller from "./Controller";

export default class RuleController extends Controller {
  constructor(private ruleDao: RuleDao) {
    super();
  }

  public routes(): express.Router {
    this.router.get("", async (req, res) => {
      try {
        const rules = await this.ruleDao.findAll();
        return res
          .status(200)
          .json(MessageFactory.createResponse<Rule[]>(true, "", rules));
      } catch (err) {
        return res
          .status(500)
          .json(MessageFactory.createError("Server error: cannot fetch rules"));
      }
    });
    return this.router;
  }
}
