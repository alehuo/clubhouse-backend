import { Rule } from "@alehuo/clubhouse-shared";
import Knex from "knex";
import moment from "moment";

const rules: Rule[] = [
  {
    ruleId: 1,
    order: 1,
    text: "Rule 1",
    created_at: moment().toISOString(),
    updated_at: moment().toISOString()
  },
  {
    ruleId: 2,
    order: 2,
    text: "Rule 2",
    created_at: moment().toISOString(),
    updated_at: moment().toISOString()
  }
];

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("rules").del();
  // Insert data
  await knex("rules").insert(rules);
}
