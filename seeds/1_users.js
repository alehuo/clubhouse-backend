const bcrypt = require("bcrypt");
var salt = bcrypt.genSaltSync(10);

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("users")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("users").insert([
        {
          userId: 1,
          username: "user1",
          email: "user1@email.com",
          password: bcrypt.hashSync("user1", salt)
        },
        {
          userId: 2,
          username: "user2",
          email: "user2@email.com",
          password: bcrypt.hashSync("user2", salt)
        },
        {
          userId: 3,
          username: "user3",
          email: "user3@email.com",
          password: bcrypt.hashSync("user3", salt)
        }
      ]);
    });
};
