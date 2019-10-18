import Knex from "knex";
import * as knexfile from "../knexfile";

export type Environment = "development" | "production" | "test";

if (process.env.NODE_ENV === undefined) {
  throw new Error("NODE_ENV is not defined!");
}
// @ts-ignore
const knexConfig: Knex.Config = knexfile[process.env.NODE_ENV as Environment];
export default Knex(knexConfig);