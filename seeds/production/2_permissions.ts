import { Permissions } from "@alehuo/clubhouse-shared";
import Knex from "knex";
export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("permissions").del();
  // Insert data
  await Promise.all(
    Object.keys(Permissions).map((key: string) =>
      knex("permissions").insert(Permissions[key as keyof typeof Permissions])
    )
  );
}
