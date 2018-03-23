exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("studentUnions")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("studentUnions").insert([
        { unionId: 1, name: "Union 1", description: "Union 1 description" },
        { unionId: 2, name: "Union 2", description: "Union 2 description" },
        { unionId: 3, name: "Union 3", description: "Union 3 description" }
      ]);
    });
};