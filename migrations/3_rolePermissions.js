exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists("rolePermissions", function(table) {
    // Primary key
    table.increments("rolePermissionId");
    // Role id
    table.integer("roleId");
    // User management
    table.boolean("banUser").defaultTo(false);
    table.boolean("editUserRole").defaultTo(false);
    table.boolean("makeUserAdmin").defaultTo(false);
    table.boolean("allowUserLogin").defaultTo(true);
    // User key  management
    table.boolean("addKeyToUser").defaultTo(false);
    table.boolean("removeKeyFromUser").defaultTo(false);
    table.boolean("changeKeyTypeOfUser").defaultTo(false);
    table.boolean("allowViewKeys").defaultTo(true);
    // Student union
    table.boolean("addUserToUnion").defaultTo(false);
    table.boolean("removeUserFromUnion").defaultTo(false);
    table.boolean("addStudentUnion").defaultTo(false);
    table.boolean("removeStudentUnion").defaultTo(false);
    table.boolean("editStudentUnion").defaultTo(false);
    table.boolean("allowViewStudentUnions").defaultTo(true);
    // Event
    table.boolean("addEvent").defaultTo(false);
    table.boolean("editEvent").defaultTo(false);
    table.boolean("removeEvent").defaultTo(false);
    table.boolean("allowViewEvents").defaultTo(true);
    // Rules
    table.boolean("editRules").defaultTo(false);
    table.boolean("allowViewRules").defaultTo(true);
    // News
    table.boolean("addOwnPost").defaultTo(false);
    table.boolean("editOwnPost").defaultTo(false);
    table.boolean("removeOwnPost").defaultTo(false);
    table.boolean("allowViewNews").defaultTo(true);
    // News (from other users)
    table.boolean("editOthersPosts").defaultTo(false);
    table.boolean("removeOthersPosts").defaultTo(false);
    // Mailing
    table.boolean("sendMails").defaultTo(false);
  });
};

exports.down = function(knex, Promise) {
  if (process.env.NODE_ENV == "production") {
    throw new Error("Do not drop tables in a production environment.");
  }
  return knex.schema.dropTableIfExists("rolePermissions");
};
