import IUser from "./IUser";

export default interface IPermission {
  // User management
  banUser: boolean;
  editUserRole: boolean;
  makeUserAdmin: boolean;
  allowUserLogin: true;
  // User key  management
  addKeyToUser: boolean;
  removeKeyFromUser: boolean;
  changeKeyTypeOfUser: boolean;
  allowViewKeys: true;
  // Student union
  addUserToUnion: boolean;
  removeUserFromUnion: boolean;
  addStudentUnion: boolean;
  removeStudentUnion: boolean;
  editStudentUnion: boolean;
  allowViewStudentUnions: true;
  // Event
  addEvent: boolean;
  editEvent: boolean;
  removeEvent: boolean;
  allowViewEvents: true;
  // Rules
  editRules: boolean;
  allowViewRules: true;
  // News
  addOwnPost: boolean;
  editOwnPost: boolean;
  removeOwnPost: boolean;
  allowViewNews: true;
  // News (from other users)
  editOthersPosts: boolean;
  removeOthersPosts: boolean;
  // Mailing
  sendMails: boolean;
};

export const userPermissionFilter = (p: IUser & IPermission) => {
  return {
    // User Id
    userId: p.userId,
    permissions: {
      // User management
      banUser: p.banUser,
      editUserRole: p.editUserRole,
      makeUserAdmin: p.makeUserAdmin,
      allowUserLogin: p.allowUserLogin,
      // User key  management
      addKeyToUser: p.addKeyToUser,
      removeKeyFromUser: p.removeKeyFromUser,
      changeKeyTypeOfUser: p.changeKeyTypeOfUser,
      allowViewKeys: p.allowViewKeys,
      // Student union
      addUserToUnion: p.addUserToUnion,
      removeUserFromUnion: p.removeUserFromUnion,
      addStudentUnion: p.addStudentUnion,
      removeStudentUnion: p.removeStudentUnion,
      editStudentUnion: p.editStudentUnion,
      allowViewStudentUnions: p.allowViewStudentUnions,
      // Event
      addEvent: p.addEvent,
      editEvent: p.editEvent,
      removeEvent: p.removeEvent,
      allowViewEvents: p.allowViewEvents,
      // Rules
      editRules: p.editRules,
      allowViewRules: p.allowViewRules,
      // News
      addOwnPost: p.addOwnPost,
      editOwnPost: p.editOwnPost,
      removeOwnPost: p.removeOwnPost,
      allowViewNews: p.allowViewNews,
      // News (from other users)
      editOthersPosts: p.editOthersPosts,
      removeOthersPosts: p.removeOthersPosts,
      // Mailing
      sendMails: p.sendMails
    }
  };
};
