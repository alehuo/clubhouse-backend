import Knex from "knex";

import { Permissions } from "@alehuo/clubhouse-shared";

exports.seed = function(knex: Knex): PromiseLike<any> {
  // Deletes ALL existing entries
  return knex("permissions")
    .del()
    .then(() => {
      // Inserts seed entries
      return Promise.all(
        Object.keys(Permissions).map((key: string) => {
          // @ts-ignore
          return knex("permissions").insert(Permissions[key]);
        })
      );
    });
};
