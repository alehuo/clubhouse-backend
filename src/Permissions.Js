const userPermissions = {
  ALLOW_BAN_USER: { name: "ALLOW_BAN_USER", value: Math.pow(2, 0) },
  ALLOW_EDIT_USER_ROLE: { name: "ALLOW_EDIT_USER_ROLE", value: Math.pow(2, 1) },
  ALLOW_MAKE_USER_ADMIN: {
    name: "ALLOW_MAKE_USER_ADMIN",
    value: Math.pow(2, 2)
  },
  ALLOW_USER_LOGIN: { name: "ALLOW_USER_LOGIN", value: Math.pow(2, 3) },
  ALLOW_ADD_KEYS: { name: "ALLOW_ADD_KEYS", value: Math.pow(2, 4) },
  ALLOW_REMOVE_KEYS: { name: "ALLOW_REMOVE_KEYS", value: Math.pow(2, 5) },
  ALLOW_EDIT_KEYS: {
    name: "ALLOW_EDIT_KEYS",
    value: Math.pow(2, 6)
  },
  ALLOW_VIEW_KEYS: { name: "ALLOW_VIEW_KEYS", value: Math.pow(2, 7) },
  ALLOW_ADD_USER_TO_UNION: {
    name: "ALLOW_ADD_USER_TO_UNION",
    value: Math.pow(2, 8)
  },
  ALLOW_REMOVE_USER_FROM_UNION: {
    name: "ALLOW_REMOVE_USER_FROM_UNION",
    value: Math.pow(2, 9)
  },
  ALLOW_ADD_STUDENT_UNION: {
    name: "ALLOW_ADD_STUDENT_UNION",
    value: Math.pow(2, 10)
  },
  ALLOW_REMOVE_STUDENT_UNION: {
    name: "ALLOW_REMOVE_STUDENT_UNION",
    value: Math.pow(2, 11)
  },
  ALLOW_EDIT_STUDENT_UNION: {
    name: "ALLOW_EDIT_STUDENT_UNION",
    value: Math.pow(2, 12)
  },
  ALLOW_VIEW_STUDENT_UNIONS: {
    name: "ALLOW_VIEW_STUDENT_UNIONS",
    value: Math.pow(2, 13)
  },
  ALLOW_ADD_EVENT: { name: "ALLOW_ADD_EVENT", value: Math.pow(2, 14) },
  ALLOW_EDIT_EVENT: { name: "ALLOW_EDIT_EVENT", value: Math.pow(2, 15) },
  ALLOW_REMOVE_EVENT: { name: "ALLOW_REMOVE_EVENT", value: Math.pow(2, 16) },
  ALLOW_VIEW_EVENTS: { name: "ALLOW_VIEW_EVENTS", value: Math.pow(2, 17) },
  ALLOW_EDIT_RULES: { name: "ALLOW_EDIT_RULES", value: Math.pow(2, 18) },
  ALLOW_VIEW_RULES: { name: "ALLOW_VIEW_RULES", value: Math.pow(2, 19) },
  ALLOW_ADD_POSTS: { name: "ALLOW_ADD_POSTS", value: Math.pow(2, 20) },
  ALLOW_REMOVE_POSTS: { name: "ALLOW_REMOVE_POSTS", value: Math.pow(2, 22) },
  ALLOW_VIEW_POSTS: { name: "ALLOW_VIEW_POSTS", value: Math.pow(2, 23) },
  ALLOW_EDIT_POSTS: { name: "ALLOW_EDIT_POSTS", value: Math.pow(2, 24) },
  ALLOW_SEND_MAILS: { name: "ALLOW_SEND_MAILS", value: Math.pow(2, 25) },
  ALLOW_ADD_LOCATION: { name: "ALLOW_ADD_LOCATION", value: Math.pow(2, 26) },
  ALLOW_EDIT_LOCATION: { name: "ALLOW_EDIT_LOCATION", value: Math.pow(2, 27) },
  ALLOW_DELETE_LOCATION: {
    name: "ALLOW_DELETE_LOCATION",
    value: Math.pow(2, 28)
  },
  ALLOW_VIEW_LOCATIONS: {
    name: "ALLOW_VIEW_LOCATIONS",
    value: Math.pow(2, 29)
  },
  ALLOW_START_WATCH: { name: "ALLOW_START_WATCH", value: Math.pow(2, 30) }
};

module.exports = userPermissions;
