import Knex from "knex";
import { INewsPost } from "../models/INewsPost";
import IDao from "./Dao";

const TABLE_NAME: string = "newsposts";

export default class NewsPostDao implements IDao<INewsPost> {
  constructor(private readonly knex: Knex) {}

  public findAll(): PromiseLike<INewsPost[]> {
    return Promise.resolve(this.knex(TABLE_NAME).select());
  }
  public findOne(postId: number): PromiseLike<INewsPost> {
    return Promise.resolve(
      this.knex(TABLE_NAME)
        .select()
        .where({ postId })
        .first()
    );
  }
  public findByAuthor(author: number): PromiseLike<INewsPost[]> {
    return Promise.resolve(
      this.knex(TABLE_NAME)
        .select()
        .where({ author })
    );
  }

  public save(newsPost: INewsPost): PromiseLike<number[]> {
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
