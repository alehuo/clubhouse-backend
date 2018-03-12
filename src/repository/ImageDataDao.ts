
import IDao from "./Dao";
import IImageData from "../models/IImageData";
import * as Promise from "bluebird";
import * as Knex from "knex";

export default class ImageDataDao implements IDao<IImageData> {
  constructor(private readonly knex: Knex) {}
  public findAll(): Promise<IImageData[]> {
    return this.knex("imageData").select();
  }
  public findOne(id: number): Promise<IImageData> {
    return this.knex("imageData")
      .select()
      .where({ imageDataId: id });
  }
  public remove(id: number): Promise<void> {
    return this.knex("imageData")
      .delete()
      .where({ imageDataId: id });
  }
}
