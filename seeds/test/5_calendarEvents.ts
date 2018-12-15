import Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("calendarEvents").del();
  // Insert data
  await knex("calendarEvents").insert([
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
}
