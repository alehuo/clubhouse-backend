exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("newsposts")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("sessions")
        .del()
        .then(function() {
          return knex("calendarEvents")
            .del()
            .then(function() {
              return knex("locations")
                .del()
                .then(function() {
                  return knex("users")
                    .del()
                    .then(function() {
                      return knex("permissions")
                        .del()
                        .then(function() {
                          return knex("studentUnions").del();
                        });
                    });
                });
            });
        });
    });
};
