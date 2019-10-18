import { Newspost } from "@alehuo/clubhouse-shared";
import moment from "moment";
import knex from "../Database";
import { dtFormat } from "../utils/DtFormat";
import Dao from "./Dao";

const TABLE_NAME = "newsposts";

class NewsPostDao implements Dao<Newspost> {
  public findAll(): PromiseLike<Newspost[]> {
    return Promise.resolve(knex(TABLE_NAME).select());
  }
  public findOne(postId: number): PromiseLike<Newspost> {
    return Promise.resolve(
      knex(TABLE_NAME)
        .select()
        .where({ postId })
        .first()
    );
  }
  public findByAuthor(author: number): PromiseLike<Newspost[]> {
    return Promise.resolve(
      knex(TABLE_NAME)
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
    return Promise.resolve(knex(TABLE_NAME).insert(newsPost));
  }

  public remove(postId: number): PromiseLike<number> {
    return Promise.resolve(
      knex(TABLE_NAME)
        .delete()
        .where({ postId })
    );
  }
}

export default new NewsPostDao();
