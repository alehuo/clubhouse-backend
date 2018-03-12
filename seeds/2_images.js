exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("images")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("images").insert([
        { folderId: 1, imageName: "Image 1" },
        { folderId: 1, imageName: "Image 2" },
        { folderId: 1, imageName: "Image 3" },
        { folderId: 1, imageName: "Image 4" },
        { folderId: 1, imageName: "Image 5" }
      ]);
    });
};
