import connect from "./../Database";
import Dao from "./Dao";
import IImage from "../models/Image";
import * as Promise from "bluebird";

class ImageDao implements Dao<IImage> {
  public findAll(): Promise<IImage[]> {
    return connect()
      .select()
      .table("images");
  }
  public findOne(id: number): Promise<IImage> {
    return connect()
      .select()
      .table("images")
      .where({ imageId: id });
  }
  public remove(id: number): Promise<void> {
    return connect()
      .delete("images")
      .where({ imageId: id });
  }
}

export default ImageDao;
