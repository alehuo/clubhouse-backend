const userPerms = require("../../src/Permissions.js");

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("permissions")
    .del()
    .then(function() {
      // Inserts seed entries
      return Promise.all(
        Object.keys(userPerms).map(key => {
          // console.log("%s : %s", key, userPerms[key].value);
          return knex("permissions").insert(userPerms[key]);
        })
      );
    });
};
