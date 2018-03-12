const path = require("path");

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("imagedata")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("imagedata").insert([
        {
          imageId: 1,
          contentType: "image/png",
          imagePath: "image1_thumb.png",
          dataType: "thumbnail"
        },
        {
          imageId: 1,
          contentType: "image/png",
          imagePath: "image1_full.png",
          dataType: "full"
        }
      ]);
    });
};
