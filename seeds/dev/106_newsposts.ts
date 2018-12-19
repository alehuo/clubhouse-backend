import { Newspost } from "@alehuo/clubhouse-shared";
import Knex from "knex";
import moment from "moment";

const newsposts: Newspost[] = [
  {
    postId: 1,
    author: 1,
    title: "Welcome to our site",
    message: "Welcome to the new clubhouse management website.",
    created_at: moment().toISOString(),
    updated_at: moment().toISOString()
  }
];

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("newsposts").del();
  // Insert data
  await knex("newsposts").insert(newsposts);
}
