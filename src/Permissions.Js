const userCrud = {
  ALLOW_ADD_USER: { name: "ALLOW_ADD_USER", value: Math.pow(2, 0) },
  ALLOW_EDIT_USER: { name: "ALLOW_EDIT_USER", value: Math.pow(2, 1) },
  ALLOW_DELETE_USER: { name: "ALLOW_DELETE_USER", value: Math.pow(2, 2) },
  ALLOW_VIEW_USERS: { name: "ALLOW_VIEW_USERS", value: Math.pow(2, 3) }
};

const keyCrud = {
  ALLOW_ADD_KEYS: { name: "ALLOW_ADD_KEYS", value: Math.pow(2, 4) },
  ALLOW_REMOVE_KEYS: { name: "ALLOW_REMOVE_KEYS", value: Math.pow(2, 5) },
  ALLOW_EDIT_KEYS: {
    name: "ALLOW_EDIT_KEYS",
    value: Math.pow(2, 6)
  },
  ALLOW_VIEW_KEYS: { name: "ALLOW_VIEW_KEYS", value: Math.pow(2, 7) }
};

const studentUnionCrud = {
  ALLOW_ADD_STUDENT_UNION: {
    name: "ALLOW_ADD_STUDENT_UNION",
    value: Math.pow(2, 8)
  },
  ALLOW_REMOVE_STUDENT_UNION: {
    name: "ALLOW_REMOVE_STUDENT_UNION",
    value: Math.pow(2, 9)
  },
  ALLOW_EDIT_STUDENT_UNION: {
    name: "ALLOW_EDIT_STUDENT_UNION",
    value: Math.pow(2, 10)
  },
  ALLOW_VIEW_STUDENT_UNIONS: {
    name: "ALLOW_VIEW_STUDENT_UNIONS",
    value: Math.pow(2, 11)
  }
};

const calendarCrud = {
  ALLOW_ADD_EVENT: { name: "ALLOW_ADD_EVENT", value: Math.pow(2, 12) },
  ALLOW_EDIT_EVENT: { name: "ALLOW_EDIT_EVENT", value: Math.pow(2, 13) },
  ALLOW_REMOVE_EVENT: { name: "ALLOW_REMOVE_EVENT", value: Math.pow(2, 14) },
  ALLOW_VIEW_EVENTS: { name: "ALLOW_VIEW_EVENTS", value: Math.pow(2, 15) }
};

const ruleCrud = {
  ALLOW_ADD_RULES: { name: "ALLOW_ADD_RULES", value: Math.pow(2, 16) },
  ALLOW_EDIT_RULES: { name: "ALLOW_EDIT_RULES", value: Math.pow(2, 17) },
  ALLOW_VIEW_RULES: { name: "ALLOW_VIEW_RULES", value: Math.pow(2, 18) },
  ALLOW_REMOVE_RULES: { name: "ALLOW_VIEW_RULES", value: Math.pow(2, 19) }
};

const newspostCrud = {
  ALLOW_ADD_POSTS: { name: "ALLOW_ADD_POSTS", value: Math.pow(2, 20) },
  ALLOW_REMOVE_POSTS: { name: "ALLOW_REMOVE_POSTS", value: Math.pow(2, 21) },
  ALLOW_VIEW_POSTS: { name: "ALLOW_VIEW_POSTS", value: Math.pow(2, 22) },
  ALLOW_EDIT_POSTS: { name: "ALLOW_EDIT_POSTS", value: Math.pow(2, 23) }
};

const locationCrud = {
  ALLOW_ADD_LOCATION: { name: "ALLOW_ADD_LOCATION", value: Math.pow(2, 24) },
  ALLOW_EDIT_LOCATION: { name: "ALLOW_EDIT_LOCATION", value: Math.pow(2, 25) },
  ALLOW_DELETE_LOCATION: {
    name: "ALLOW_DELETE_LOCATION",
    value: Math.pow(2, 26)
  },
  ALLOW_VIEW_LOCATIONS: {
    name: "ALLOW_VIEW_LOCATIONS",
    value: Math.pow(2, 27)
  }
};

const userPermissions = {};

Object.keys(userCrud).map(key => {
  userPermissions[key] = userCrud[key];
});

Object.keys(keyCrud).map(key => {
  userPermissions[key] = keyCrud[key];
});

Object.keys(studentUnionCrud).map(key => {
  userPermissions[key] = studentUnionCrud[key];
});

Object.keys(calendarCrud).map(key => {
  userPermissions[key] = calendarCrud[key];
});

Object.keys(ruleCrud).map(key => {
  userPermissions[key] = ruleCrud[key];
});

Object.keys(newspostCrud).map(key => {
  userPermissions[key] = newspostCrud[key];
});

Object.keys(locationCrud).map(key => {
  userPermissions[key] = locationCrud[key];
});

module.exports = userPermissions;
