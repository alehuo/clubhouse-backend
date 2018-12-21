import { isRule, Rule } from "@alehuo/clubhouse-shared";
import express from "express";
import RuleDao from "../dao/RuleDao";
import { MessageFactory } from "../utils/MessageFactory";
import { StatusCode } from "../utils/StatusCodes";
import Controller from "./Controller";

export default class RuleController extends Controller {
  constructor(private ruleDao: RuleDao) {
    super();
  }

  public routes(): express.Router {
    this.router.get("", async (req, res) => {
      try {
        const rules = await this.ruleDao.findAll();
        if (!rules.every(isRule)) {
          return res
            .status(StatusCode.INTERNAL_SERVER_ERROR)
            .json(MessageFactory.createModelValidationError("Rule"));
        }
        return res
          .status(StatusCode.OK)
          .json(MessageFactory.createResponse<Rule[]>(true, "", rules));
      } catch (err) {
        return res
          .status(StatusCode.INTERNAL_SERVER_ERROR)
          .json(MessageFactory.createError("Server error: cannot fetch rules"));
      }
    });

    this.router.post(
      "/swap/:ruleId1(\\d+)/:ruleId2(\\d+)",
      async (req, res) => {
        try {
          const ruleId1 = Number(req.params.ruleId1);
          const ruleId2 = Number(req.params.ruleId2);
          const rule1 = await this.ruleDao.findOne(ruleId1);
          const rule2 = await this.ruleDao.findOne(ruleId2);

          if (!rule1 || !rule2) {
            return res
              .status(StatusCode.NOT_FOUND)
              .json(MessageFactory.createError("Rule not found"));
          }

          if (!isRule(rule1) || !isRule(rule2)) {
            return res
              .status(StatusCode.INTERNAL_SERVER_ERROR)
              .json(MessageFactory.createModelValidationError("Rule"));
          }

          const ruleOrder1 = rule1.order;
          const ruleOrder2 = rule2.order;

          rule1.order = ruleOrder2;
          rule2.order = ruleOrder1;

          const saved1 = await this.ruleDao.save(rule1);
          const saved2 = await this.ruleDao.save(rule2);

          if (saved1 && saved2) {
            return res
              .status(StatusCode.OK)
              .json(
                MessageFactory.createMessage(
                  "Rules with ID #" + ruleId1 + " and #" + ruleId2 + " swapped."
                )
              );
          } else {
            return res
              .status(StatusCode.BAD_REQUEST)
              .json(MessageFactory.createError("Error swapping rules"));
          }
        } catch (err) {
          return res
            .status(StatusCode.INTERNAL_SERVER_ERROR)
            .json(
              MessageFactory.createError("Error swapping rules", err as Error)
            );
        }
      }
    );

    this.router.get("/:ruleId(\\d+)", async (req, res) => {
      const ruleId = Number(req.params.ruleId);
      try {
        const rule = await this.ruleDao.findOne(ruleId);
        if (!isRule(rule)) {
          return res
            .status(StatusCode.INTERNAL_SERVER_ERROR)
            .json(MessageFactory.createModelValidationError("Rule"));
        }
        if (!rule) {
          return res
            .status(StatusCode.NOT_FOUND)
            .json(MessageFactory.createError("Rule not found"));
        }
        return res
          .status(StatusCode.OK)
          .json(MessageFactory.createResponse<Rule>(true, "", rule));
      } catch (err) {
        return res
          .status(StatusCode.INTERNAL_SERVER_ERROR)
          .json(MessageFactory.createError("Server error: cannot fetch rule"));
      }
    });

    return this.router;
  }
}
