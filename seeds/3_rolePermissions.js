exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("rolePermissions")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("rolePermissions").insert([
        {
          rolePermissionId: 1,
          roleId: 2,
          // User management
          banUser: false,
          editUserRole: false,
          makeUserAdmin: false,
          allowUserLogin: true,
          // User key  management
          addKeyToUser: false,
          removeKeyFromUser: false,
          changeKeyTypeOfUser: false,
          allowViewKeys: true,
          // Student union
          addUserToUnion: false,
          removeUserFromUnion: false,
          addStudentUnion: false,
          removeStudentUnion: false,
          editStudentUnion: false,
          allowViewStudentUnions: true,
          // Event
          addEvent: false,
          editEvent: false,
          removeEvent: false,
          allowViewEvents: true,
          // Rules
          editRules: false,
          allowViewRules: true,
          // News
          addOwnPost: false,
          editOwnPost: false,
          removeOwnPost: false,
          allowViewNews: true,
          // News (from other users)
          editOthersPosts: false,
          removeOthersPosts: false,
          // Mailing
          sendMails: false
        },
        {
          rolePermissionId: 2,
          roleId: 1,
          // User management
          banUser: true,
          editUserRole: true,
          makeUserAdmin: true,
          allowUserLogin: true,
          // User key  management
          addKeyToUser: true,
          removeKeyFromUser: true,
          changeKeyTypeOfUser: true,
          allowViewKeys: true,
          // Student union
          addUserToUnion: true,
          removeUserFromUnion: true,
          addStudentUnion: true,
          removeStudentUnion: true,
          editStudentUnion: true,
          allowViewStudentUnions: true,
          // Event
          addEvent: true,
          editEvent: true,
          removeEvent: true,
          allowViewEvents: true,
          // Rules
          editRules: true,
          allowViewRules: true,
          // News
          addOwnPost: true,
          editOwnPost: true,
          removeOwnPost: true,
          allowViewNews: true,
          // News (from other users)
          editOthersPosts: true,
          removeOthersPosts: true,
          // Mailing
          sendMails: true
        }
      ]);
    });
};
