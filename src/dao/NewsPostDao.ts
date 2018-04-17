import IDao from "./Dao";
import Promise from "bluebird";
import * as Knex from "knex";
import INewsPost from "../models/INewsPost";

const TABLE_NAME = "newsposts";

export default class NewsPostUnionDao implements IDao<INewsPost> {
  constructor(private readonly knex: Knex) {}

  public findAll(): Promise<INewsPost[]> {
    return this.knex(TABLE_NAME).select();
  }
  public findOne(postId: number): Promise<INewsPost[]> {
    return this.knex(TABLE_NAME)
      .select()
      .where({ postId });
  }
  public findByAuthor(author: number): Promise<INewsPost[]> {
    return this.knex(TABLE_NAME)
      .select()
      .where({ author });
  }

  public save(newsPost: INewsPost): Promise<number[]> {
    return this.knex(TABLE_NAME).insert(newsPost);
  }

  public remove(postId: number): Promise<void> {
    return this.knex(TABLE_NAME)
      .delete()
      .where({ postId });
  }
}
