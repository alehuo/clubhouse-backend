process.env.NODE_ENV = "test";

import { Key } from "@alehuo/clubhouse-shared";
import chai from "chai";
import "mocha";
import moment from "moment";
import KeyDao from "../../src/dao/KeyDao";
import knex from "../../src/Database";
import { dtFormat } from "../../src/utils/DtFormat";
const should = chai.should();

const mapToKeys = (dbKeys: any) => {
  const keyTypes: Key[] = [
    ...dbKeys.map((obj: any) => {
      return { ...obj };
    })
  ];
  return keyTypes;
};
const dbKeys: Key[] = [
  {
    keyId: 1,
    keyType: 1,
    userId: 1,
    unionId: 1,
    description: "Lorem ipsum",
    dateAssigned: moment(new Date(2016, 1, 1)).format(dtFormat),
    created_at: moment(new Date(2016, 1, 1)).format(dtFormat),
    updated_at: moment(new Date(2016, 1, 1)).format(dtFormat)
  },
  {
    keyId: 2,
    keyType: 1,
    userId: 2,
    unionId: 2,
    description: "Key description",
    dateAssigned: moment(new Date(2016, 1, 1)).format(dtFormat),
    created_at: moment(new Date(2016, 1, 1)).format(dtFormat),
    updated_at: moment(new Date(2016, 1, 1)).format(dtFormat)
  }
];
describe("KeyDao", () => {
  // Roll back
  beforeEach((done) => {
    knex.migrate.rollback().then(() => {
      knex.migrate.latest().then(() => {
        knex.seed.run().then(() => {
          done();
        });
      });
    });
  });

  // After each
  afterEach((done) => {
    knex.migrate.rollback().then(() => {
      done();
    });
  });

  describe("findAll()", () => {
    it("Returns all keys", async () => {
      const res = await KeyDao.findAll();
      const keys = mapToKeys(res);
      should.exist(keys.length);
      keys.length.should.equal(2);
      should.exist(keys[0]);
      should.exist(keys[1]);

      // KeyId
      should.exist(keys[0].keyId);
      should.exist(keys[1].keyId);
      keys[0].keyId.should.equal(dbKeys[0].keyId);
      keys[1].keyId.should.equal(dbKeys[1].keyId);

      // KeyTypeId
      should.exist(keys[0].keyType);
      should.exist(keys[1].keyType);
      keys[0].keyType.should.equal(dbKeys[0].keyType);
      keys[1].keyType.should.equal(dbKeys[1].keyType);

      // Description
      should.exist(keys[0].description);
      should.exist(keys[1].description);
      keys[0].description.should.equal(dbKeys[0].description);
      keys[1].description.should.equal(dbKeys[1].description);

      // UnionId
      should.exist(keys[0].unionId);
      should.exist(keys[1].unionId);
      keys[0].unionId.should.equal(dbKeys[0].unionId);
      keys[1].unionId.should.equal(dbKeys[1].unionId);

      // UserId
      should.exist(keys[0].userId);
      should.exist(keys[1].userId);
      keys[0].userId.should.equal(dbKeys[0].userId);
      keys[1].userId.should.equal(dbKeys[1].userId);

      // Timestamps
      should.exist(keys[0].created_at);
      should.exist(keys[0].updated_at);
      should.exist(keys[0].dateAssigned);

      should.exist(keys[1].created_at);
      should.exist(keys[1].updated_at);
      should.exist(keys[1].dateAssigned);
    });
  });

  describe("findOne()", () => {
    it("Returns a single key type", async () => {
      const res = await KeyDao.findOne(1);
      const key: Key = { ...res };
      const dbKey = dbKeys.find((key) => key.keyId === 1);
      dbKey!.should.not.equal(null);

      should.exist(key.created_at);
      should.exist(key.updated_at);
      should.exist(key.dateAssigned);

      should.exist(key.keyType);
      key.keyType.should.equal(dbKey!.keyType);

      should.exist(key.description);
      key.description.should.equal(dbKey!.description);

      should.exist(key.keyId);
      key.keyId.should.equal(dbKey!.keyId);

      should.exist(key.unionId);
      key.unionId.should.equal(dbKey!.unionId);

      should.exist(key.userId);
      key.userId.should.equal(dbKey!.userId);
    });
  });

  describe("save()", () => {
    it("Saves a new key type", async () => {
      const all1 = await KeyDao.findAll();
      const keyTypes1 = mapToKeys(all1);
      keyTypes1.length.should.equal(2);

      await KeyDao.save({
        keyId: 3,
        keyType: 1,
        userId: 2,
        unionId: 2,
        description: "Test key",
        dateAssigned: moment().format(dtFormat),
        created_at: moment().format(dtFormat),
        updated_at: moment().format(dtFormat)
      });

      const all2 = await KeyDao.findAll();
      const keyTypes2 = mapToKeys(all2);
      keyTypes2.length.should.equal(3);

      const res = await KeyDao.findOne(3);
      const key: Key = { ...res };

      should.exist(key.created_at);
      should.exist(key.updated_at);
      should.exist(key.dateAssigned);

      should.exist(key.keyType);
      key.keyType.should.equal(1);

      should.exist(key.keyId);
      key.keyId.should.equal(3);

      should.exist(key.description);
      key.description.should.equal("Test key");

      // key.updated_at.should.equal(key.created_at);
    });
  });

  describe("update()", () => {
    it("Updates a single key type", async () => {
      const res = await KeyDao.findOne(1);
      const key: Key = { ...res };
      key.description.should.not.equal("Updated title");
      key.description = "Updated title";

      await KeyDao.update(key);

      const res2 = await KeyDao.findOne(1);
      const key2: Key = { ...res2 };
      key2.description.should.equal("Updated title");
      // key.updated_at.should.not.equal(key2.updated_at);
    });
  });

  describe("remove()", () => {
    it("Removes a single key type", async () => {
      const all1 = await KeyDao.findAll();
      const keys1 = mapToKeys(all1);
      keys1.length.should.equal(2);

      await KeyDao.remove(1);

      const all2 = await KeyDao.findAll();
      const keys2 = mapToKeys(all2);
      keys2.length.should.equal(1);
    });
  });
});
