import * as Promise from "bluebird";
import * as Knex from "knex";

import { Permissions } from "@alehuo/clubhouse-shared";

exports.seed = function(knex: Knex): Promise<any> {
  // Deletes ALL existing entries
  return knex("permissions")
    .del()
    .then(() => {
      // Inserts seed entries
      return Promise.all(
        Object.keys(Permissions).map((key: string) => {
          return knex("permissions").insert(Permissions[key as keyof typeof Permissions]);
        })
      );
    });
};
