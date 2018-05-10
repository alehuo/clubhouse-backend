exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("newsposts")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("newsposts").insert([
        {
          postId: 1,
          author: 1,
          title: "Welcome to our site",
          message: "Welcome to the new clubhouse management website."
        }
      ]);
    });
};
