import Promise from "bluebird";
export default interface IDao<T> {
  findAll(): Promise<T[]>;
  findOne(id: number): Promise<T[]>;
  remove(id: number): Promise<void>;
  save(entity: T): Promise<number[]>;
}
