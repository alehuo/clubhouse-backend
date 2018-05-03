const bcrypt = require("bcrypt");
var salt = bcrypt.genSaltSync(10);

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("users")
    .del()
    .then(function() {
      if (process.env.NODE_ENV === "test") {
        // Inserts seed entries
        return knex("users").insert([
          {
            userId: 1,
            email: "testuser@email.com",
            firstName: "Test",
            lastName: "User",
            unionId: 1,
            permissions: 67108863,
            password: bcrypt.hashSync("testuser", salt)
          },
          {
            userId: 2,
            email: "testuser2@email.com",
            firstName: "Test2",
            lastName: "User2",
            unionId: 1,
            permissions: 8,
            password: bcrypt.hashSync("testuser2", salt)
          }
        ]);
      } else {
        // Inserts seed entries
        return knex("users").insert([
          {
            userId: 1,
            email: "user1@email.com",
            firstName: "Hello",
            lastName: "World 1",
            unionId: 1,
            permissions: 67108863,
            password: bcrypt.hashSync("user1", salt)
          },
          {
            userId: 2,
            email: "user2@email.com",
            firstName: "Hello",
            lastName: "World 2",
            unionId: 1,
            permissions: 136,
            password: bcrypt.hashSync("user2", salt)
          },
          {
            userId: 3,
            email: "user3@email.com",
            firstName: "Hello",
            lastName: "World 3",
            unionId: 2,
            permissions: 8,
            password: bcrypt.hashSync("user3", salt)
          }
        ]);
      }
    });
};
