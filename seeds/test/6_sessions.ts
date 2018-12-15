import Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("sessions").del();
  // Insert data
  await knex("sessions").insert([
    {
      sessionId: 1,
      userId: 1,
      startMessage: "Let's get this party started.",
      endMessage:
        "I have left the building. Moved people under my supervision to another keyholder.",
      startTime: new Date(2017, 6, 1, 0, 0),
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
}
