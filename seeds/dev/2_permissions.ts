import Knex from "knex";

import { Permissions } from "@alehuo/clubhouse-shared";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("permissions").del();
  await Promise.all(
    Object.keys(Permissions).map((key: string) =>
      knex("permissions").insert(Permissions[key as keyof typeof Permissions])
    )
  );
}
