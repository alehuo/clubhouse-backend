import { Rule } from "@alehuo/clubhouse-shared";
import Knex from "knex";
import moment from "moment";
import { dtFormat } from "../../src/utils/DtFormat";

const rules: Rule[] = [
  {
    ruleId: 1,
    order: 1,
    text: "Rule 1",
    created_at: moment().format(dtFormat),
    updated_at: moment().format(dtFormat)
  },
  {
    ruleId: 2,
    order: 2,
    text: "Rule 2",
    created_at: moment().format(dtFormat),
    updated_at: moment().format(dtFormat)
  }
];

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("rules").del();
  // Insert data
  await knex("rules").insert(rules);
}
