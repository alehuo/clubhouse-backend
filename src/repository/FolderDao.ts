import connect from "./../Database";
import Dao from "./Dao";
import IFolder from "../models/Folder";
import * as Promise from "bluebird";

class FolderDao implements Dao<IFolder> {
  public findAll(): Promise<IFolder[]> {
    return connect()
      .select()
      .table("folders");
  }
  public findOne(id: number): Promise<IFolder> {
    return connect()
      .select()
      .table("folders")
      .where({ folderId: id });
  }
  public remove(id: number): Promise<void> {
    return connect()
      .delete("folders")
      .where({ folderId: id });
  }
}

export default FolderDao;
