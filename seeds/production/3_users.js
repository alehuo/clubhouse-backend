const bcrypt = require("bcrypt");
var salt = bcrypt.genSaltSync(10);

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("users").then(function() {
    // Inserts seed entries
    return knex("users").insert([
      {
        email: "testuser@email.com",
        firstName: "Test",
        lastName: "User",
        permissions: 67108863,
        password: bcrypt.hashSync("testuser", salt)
      }
    ]);
  });
};
