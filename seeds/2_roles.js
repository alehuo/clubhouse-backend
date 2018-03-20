exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("roles")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("roles").insert([
        {
          roleId: 1,
          name: "Administrator",
          description: "Admin."
        },
        {
          roleId: 2,
          name: "Normal user",
          description: "Normal user."
        }
      ]);
    });
};
