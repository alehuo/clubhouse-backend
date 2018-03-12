import connect from "./../Database";
import Dao from "./Dao";
import IImageData from "../models/ImageData";
import * as Promise from "bluebird";

class ImageDataDao implements Dao<IImageData> {
  public findAll(): Promise<IImageData[]> {
    return connect()
      .select()
      .table("imageData");
  }
  public findOne(id: number): Promise<IImageData> {
    return connect()
      .select()
      .table("imageData")
      .where({ imageDataId: id });
  }
  public remove(id: number): Promise<void> {
    return connect()
      .delete("imageData")
      .where({ imageDataId: id });
  }
}

export default ImageDataDao;
