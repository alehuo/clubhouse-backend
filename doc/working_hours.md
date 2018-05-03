<!-- START doctoc generated TOC please keep comment here to allow auto update -->

<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

* [Working hours (Back-end)](#working-hours-back-end)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Working hours (Back-end)

| Date      | Hours | Description                                                                                                                                                                                                 |
| --------- | ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 5.3.2018  | 3h    | Initialize project structure, create basic migrations                                                                                                                                                       |
| 12.3.2018 | 3h    | Created User migration, seed, model and controller + started API documentation                                                                                                                              |
| 21.3.2018 | 4h    | Modify user migration, create migration files for student unions, roles, rolePermissions and calendar events. Modify user controller and API documentation to suit changes made in user registration.       |
| 23.3.2018 | 5h    | Create JWT middleware, basic Auth controller structure. Added nodemon for watching file changes and Winston for logging.                                                                                    |
| 24.3.2018 | 2h    | Create StudentUnion model, dao and controller. A                                                                                                                                                            | dded API documentation for student union route and created some REST files for testing the StudentUnion endpoint. |
| 26.3.2018 | 5h    | Create CalendarEvent model, DAO and controller. Implemented support for downloading single evens as iCal files.                                                                                             |
| 27.3.2018 | 3h    | Improve API documentation. Revamp permissions system to use bitwise operations in user permissions.                                                                                                         |
| 30.3.2018 | 1h    | Created route to get a single user and REST files for it.                                                                                                                                                   |
| 1.4.2018  | 2h    | Created permission middleware and modified permission structure.                                                                                                                                            |
| 2.4.2018  | 2h    | Improved API documentation, recreated PermissionDao & PermissionController. Updated DB seed for permissions and improved PermissionUtils.                                                                   |
| 10.4.2018 | 1h    | Added WatchDao, iWatch and migrations for 'watch' table.                                                                                                                                                    |
| 15.4.2018 | 3h    | Starting and ending a watch works now. Moved JWT to environment variable when using .rest files. User can also now get all past & ongoing watches from the back-end.                                        |
| 16.4.2018 | 1h    | Add documentation for permissions & /api/v1/watch route.                                                                                                                                                    |
| 17.4.2018 | 2h    | Add /api/v1/message route (MessageController, MessageDao and iMessage model). Created NewsPost DAO and Model. Updated documentation.                                                                        |
| 18.4.2018 | 1h    | Add /api/v1/newspost route. Created table of contents for controllers and improved API param validation.                                                                                                    |
| 19.4.2018 | 3h    | Add DELETE /api/v1/user, DELETE /api/v1/message, DELETE /api/v1/location, DELETE /api/v1/studentunion and DELETE /api/v1/newspost routes and documentation for them. Renamed /api/v1/users to /api/v1/user. |
| 20.4.2018 | 1h    |  Added /api/v1/statistics route for getting server and user statistics + documentation for the endpoint.                                                                                                    |
| 28.4.2018 | 2h    |  Removed username from User model. Restructurize project. Created PUT route to edit user info. Created methods for validating user input.                                                                   |
| 2.5.2018  | 3h    |  Modified migration files to use new async table queries. Created Dockerfile and wrote some tests for AuthController.                                                                                       |
| 3.5.2018  | 4h    |  Created tests for UserController, WatchController and StudentUnionController. Code cleanup.                                                                                                                |

Total: 51 h
