import IDao from "./Dao";
import * as Promise from "bluebird";
import * as Knex from "knex";
import INewsPost from "../models/INewsPost";

const TABLE_NAME = "newsposts";

export default class NewsPostDao implements IDao<INewsPost> {
  constructor(private readonly knex: Knex) {}

  public findAll(): Promise<INewsPost[]> {
    return this.knex(TABLE_NAME).select();
  }
  public findOne(postId: number): Promise<INewsPost> {
    return this.knex(TABLE_NAME)
      .select()
      .where({ postId })
      .first();
  }
  public findByAuthor(author: number): Promise<INewsPost[]> {
    return this.knex(TABLE_NAME)
      .select()
      .where({ author });
  }

  public save(newsPost: INewsPost): Promise<number[]> {
    return this.knex(TABLE_NAME).insert(newsPost);
  }

  public remove(postId: number): Promise<boolean> {
    return this.knex(TABLE_NAME)
      .delete()
      .where({ postId });
  }
}
