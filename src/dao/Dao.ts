export default interface IDao<T> {
  findAll(): PromiseLike<T[]>;
  findOne(id: number): PromiseLike<T>;
  remove(id: number): PromiseLike<boolean>;
  save(entity: T): PromiseLike<number[]>;
}
