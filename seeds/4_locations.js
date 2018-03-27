exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("locations")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("locations").insert([
        { locationId: 1, name: "Meeting room", address: "Street Addr 1" },
        { locationId: 2, name: "Club", address: "Street Addr 1" }
      ]);
    });
};
