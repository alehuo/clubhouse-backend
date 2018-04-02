exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("permissions")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("permissions").insert([
        {
          name: "BAN_USER",
          value: 0x00000001
        },
        {
          name: "EDIT_USER_ROLE",
          value: 0x00000002
        },
        {
          name: "MAKE_USER_ADMIN",
          value: 0x00000004
        },
        {
          name: "ALLOW_USER_LOGIN",
          value: 0x00000008
        },
        {
          name: "ADD_KEY_TO_USER",
          value: 0x00000010
        },
        {
          name: "REMOVE_KEY_FROM_USER",
          value: 0x00000020
        },
        {
          name: "CHANGE_KEY_TYPE_OF_USER",
          value: 0x00000040
        },
        {
          name: "ALLOW_VIEW_KEYS",
          value: 0x00000080
        },
        {
          name: "ADD_USER_TO_UNION",
          value: 0x00000100
        },
        {
          name: "REMOVE_USER_FROM_UNION",
          value: 0x00000200
        },
        {
          name: "ADD_STUDENT_UNION",
          value: 0x00000400
        },
        {
          name: "REMOVE_STUDENT_UNION",
          value: 0x00000800
        },
        {
          name: "EDIT_STUDENT_UNION",
          value: 0x00001000
        },
        {
          name: "ALLOW_VIEW_STUDENT_UNIONS",
          value: 0x00002000
        },
        {
          name: "ADD_EVENT",
          value: 0x00004000
        },
        {
          name: "EDIT_EVENT",
          value: 0x00008000
        },
        {
          name: "REMOVE_EVENT",
          value: 0x00010000
        },
        {
          name: "ALLOW_VIEW_EVENTS",
          value: 0x00020000
        },
        {
          name: "EDIT_RULES",
          value: 0x00040000
        },
        {
          name: "ALLOW_VIEW_RULES",
          value: 0x00080000
        },
        {
          name: "ADD_POSTS",
          value: 0x00100000
        },
        {
          name: "EDIT_AND_REMOVE_OWN_POSTS",
          value: 0x00200000
        },
        {
          name: "REMOVE_POSTS",
          value: 0x00400000
        },
        {
          name: "ALLOW_VIEW_POSTS",
          value: 0x00800000
        },
        {
          name: "EDIT_OTHERS_POSTS",
          value: 0x01000000
        },
        {
          name: "SEND_MAILS",
          value: 0x02000000
        },
        {
          name: "ADD_LOCATION",
          value: 0x04000000
        },
        {
          name: "EDIT_LOCATION",
          value: 0x08000000
        }
      ]);
    });
};
