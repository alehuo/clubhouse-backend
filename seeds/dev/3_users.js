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
    });
};
