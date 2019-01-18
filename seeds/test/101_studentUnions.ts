import { StudentUnion } from "@alehuo/clubhouse-shared";
import * as Knex from "knex";
import moment from "moment";
import { dtFormat } from "../../src/utils/DtFormat";

const stdus: StudentUnion[] = [
  {
    unionId: 1,
    name: "Union 1",
    description: "Union 1 description",
    created_at: moment().format(dtFormat),
    updated_at: moment().format(dtFormat)
  },
  {
    unionId: 2,
    name: "Union 2",
    description: "Union 2 description",
    created_at: moment().format(dtFormat),
    updated_at: moment().format(dtFormat)
  },
  {
    unionId: 3,
    name: "Union 3",
    description: "Union 3 description",
    created_at: moment().format(dtFormat),
    updated_at: moment().format(dtFormat)
  },
  {
    unionId: 4,
    name: "Union 4",
    description: "Union 4 description",
    created_at: moment().format(dtFormat),
    updated_at: moment().format(dtFormat)
  },
  {
    unionId: 5,
    name: "Union 5",
    description: "Union 5 description",
    created_at: moment().format(dtFormat),
    updated_at: moment().format(dtFormat)
  }
];

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("studentUnions").del();
  await knex("studentUnions").insert(stdus);
}
