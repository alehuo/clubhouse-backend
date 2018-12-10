exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("sessions")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("sessions").insert([
        {
          sessionId: 1,
          userId: 1,
          startMessage: "Let's get this party started.",
          endMessage:
            "I have left the building. Moved people under my supervision to another keyholder.",
          startTime: new Date(2017, 6, 1, 0, 00),
          endTime: new Date(2017, 6, 1, 0, 10),
          started: 1,
          ended: 1
        },
        {
          sessionId: 2,
          userId: 1,
          startMessage:
            "Good evening, I'm taking responsibility of a few exchange students.",
          startTime: new Date(2018, 6, 1, 23, 58),
          started: 1
        }
      ]);
    });
};
