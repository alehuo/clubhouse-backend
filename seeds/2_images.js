exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("images")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("images").insert([
        { imageName: "Image 1", userId: 1 },
        { imageName: "Image 2", userId: 1 },
        { imageName: "Image 3", userId: 1 },
        { imageName: "Image 4", userId: 2 },
        { imageName: "Image 5", userId: 2 }
      ]);
    });
};
