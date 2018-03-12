import * as Promise from "bluebird";

export default interface Dao<T> {
    findAll() : Promise<T[]>;
    findOne(id: number): Promise<T>;
    remove(id: number): Promise<void>;
}