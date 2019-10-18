process.env.NODE_ENV = "test";

import { KeyType } from "@alehuo/clubhouse-shared";
import chai from "chai";
import "mocha";
import moment from "moment";
import keyTypeDao from "../../src/dao/KeyTypeDao";
import knex from "../../src/Database";
import { dtFormat } from "../../src/utils/DtFormat";
const should = chai.should();

const mapToKeyTypes = (dbKeys: any) => {
  const keyTypes: KeyType[] = [
    ...dbKeys.map((obj: any) => {
      return { ...obj };
    })
  ];
  return keyTypes;
};

const dbKeyTypes: KeyType[] = [
  {
    keyTypeId: 1,
    title: "24hr",
    created_at: moment(new Date(2016, 1, 1)).format(dtFormat),
    updated_at: moment(new Date(2016, 1, 1)).format(dtFormat)
  },
  {
    keyTypeId: 2,
    title: "Day",
    created_at: moment(new Date(2016, 1, 1)).format(dtFormat),
    updated_at: moment(new Date(2016, 1, 1)).format(dtFormat)
  },
  {
    keyTypeId: 3,
    title: "Test key",
    created_at: moment(new Date(2016, 1, 1)).format(dtFormat),
    updated_at: moment(new Date(2016, 1, 1)).format(dtFormat)
  }
];

describe("KeyTypeDao", () => {
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
    it("Returns all key types", async () => {
      const res = await keyTypeDao.findAll();
      const keyTypes = mapToKeyTypes(res);
      should.exist(keyTypes.length);
      keyTypes.length.should.equal(3);
      should.exist(keyTypes[0]);
      should.exist(keyTypes[1]);

      should.exist(keyTypes[0].keyTypeId);
      should.exist(keyTypes[1].keyTypeId);
      keyTypes[0].keyTypeId.should.equal(dbKeyTypes[0].keyTypeId);
      keyTypes[1].keyTypeId.should.equal(dbKeyTypes[1].keyTypeId);

      should.exist(keyTypes[0].title);
      should.exist(keyTypes[1].title);
      keyTypes[0].title.should.equal(dbKeyTypes[0].title);
      keyTypes[1].title.should.equal(dbKeyTypes[1].title);

      should.exist(keyTypes[0].created_at);
      should.exist(keyTypes[1].updated_at);
    });
  });

  describe("findOne()", () => {
    it("Returns a single key type", async () => {
      const res = await keyTypeDao.findOne(1);
      const keyType: KeyType = { ...res };
      const dbKey = dbKeyTypes.find((keyType) => keyType.keyTypeId === 1);
      dbKey!.should.not.equal(null);

      should.exist(keyType.created_at);
      should.exist(keyType.updated_at);

      should.exist(keyType.keyTypeId);
      keyType.keyTypeId.should.equal(dbKey!.keyTypeId);

      should.exist(keyType.title);
      keyType.title.should.equal(dbKey!.title);
    });
  });

  describe("save()", () => {
    it("Saves a new key type", async () => {
      const all1 = await keyTypeDao.findAll();
      const keyTypes1 = mapToKeyTypes(all1);
      keyTypes1.length.should.equal(3);

      await keyTypeDao.save({
        created_at: "",
        keyTypeId: 4,
        title: "Test key",
        updated_at: ""
      });

      const all2 = await keyTypeDao.findAll();
      const keyTypes2 = mapToKeyTypes(all2);
      keyTypes2.length.should.equal(4);

      const res = await keyTypeDao.findOne(4);
      const keyType: KeyType = { ...res };

      should.exist(keyType.created_at);
      should.exist(keyType.updated_at);

      should.exist(keyType.keyTypeId);
      keyType.keyTypeId.should.equal(4);

      should.exist(keyType.title);
      keyType.title.should.equal("Test key");

      // keyType.updated_at.should.equal(keyType.created_at);
    });
  });

  describe("update()", () => {
    it("Updates a single key type", async () => {
      const res = await keyTypeDao.findOne(1);
      const key: KeyType = { ...res };
      key.title.should.not.equal("Updated title");
      key.title = "Updated title";

      await keyTypeDao.update(key);

      const res2 = await keyTypeDao.findOne(1);
      const key2: KeyType = { ...res2 };
      key2.title.should.equal("Updated title");
      // key.updated_at.should.not.equal(key2.updated_at);
    });
  });

  describe("remove()", () => {
    it("Removes a single key type", async () => {
      const all1 = await keyTypeDao.findAll();
      const keyTypes1 = mapToKeyTypes(all1);
      keyTypes1.length.should.equal(3);

      await keyTypeDao.remove(3);

      const all2 = await keyTypeDao.findAll();
      const keyTypes2 = mapToKeyTypes(all2);
      keyTypes2.length.should.equal(2);
    });
  });
});
