import IDao from "./Dao";
import IImage from "../models/IImage";
import * as Promise from "bluebird";
import * as Knex from "knex";

export default class ImageDao implements IDao<IImage> {
  constructor(private readonly knex: Knex) {}

  public findAll(): Promise<IImage[]> {
    return this.knex("images").select();
  }
  public findOne(id: number): Promise<IImage[]> {
    return this.knex("images")
      .select()
      .where({ imageId: id });
  }
  public remove(id: number): Promise<void> {
    return this.knex("images")
      .delete()
      .where({ imageId: id });
  }
}
