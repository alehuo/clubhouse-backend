import { Newspost } from "@alehuo/clubhouse-shared";
import Knex from "knex";
import moment from "moment";
import { dtFormat } from "../index";
import Dao from "./Dao";

const TABLE_NAME = "newsposts";

export default class NewsPostDao implements Dao<Newspost> {
  constructor(private readonly knex: Knex) {}

  public findAll(): PromiseLike<Newspost[]> {
    return Promise.resolve(this.knex(TABLE_NAME).select());
  }
  public findOne(postId: number): PromiseLike<Newspost> {
    return Promise.resolve(
      this.knex(TABLE_NAME)
        .select()
        .where({ postId })
        .first()
    );
  }
  public findByAuthor(author: number): PromiseLike<Newspost[]> {
    return Promise.resolve(
      this.knex(TABLE_NAME)
        .select()
        .where({ author })
    );
  }

  public save(newsPost: Newspost): PromiseLike<number[]> {
    if (newsPost.postId) {
      delete newsPost.postId;
    }
    newsPost.created_at = moment().format(dtFormat);
    newsPost.updated_at = moment().format(dtFormat);
    return Promise.resolve(this.knex(TABLE_NAME).insert(newsPost));
  }

  public remove(postId: number): PromiseLike<boolean> {
    return Promise.resolve(
      this.knex(TABLE_NAME)
        .delete()
        .where({ postId })
    );
  }
}
