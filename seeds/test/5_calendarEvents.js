exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("calendarEvents")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("calendarEvents").insert([
        {
          name: "Friday hangouts",
          description: "Friday hangouts at our clubhouse",
          restricted: false,
          startTime: new Date(2018, 3, 23, 18, 0, 0),
          endTime: new Date(2018, 3, 24, 2, 0, 0),
          addedBy: 1,
          unionId: 1,
          locationId: 2
        },
        {
          name: "Board meeting",
          description: "Board meeting 5/2018",
          restricted: true,
          startTime: new Date(2018, 3, 23, 18, 0, 0),
          endTime: new Date(2018, 3, 24, 2, 0, 0),
          addedBy: 1,
          unionId: 1,
          locationId: 1
        }
      ]);
    });
};
