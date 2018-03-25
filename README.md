# clubhouse-backend

[![TypeScript](https://badges.frapsoft.com/typescript/code/typescript.svg?v=101)](https://github.com/ellerbrock/typescript-badges/) [Code coverage] [Travis CI build status] [MIt license]

Back-end for Full-stack software development project course.

The back-end has been coded with TypeScript. A Dockerfile is also provided if you wish to deploy the app easily. Knex is used to handle DB migrations and seeding.

* Staging [URL]
* Production [URL]

## Introduction

Many student unions across Finland use so called "clubhouses" where they can organize events and have fun with other students. 

It is not always clear what events are kept there, who has the permission to use such places and how to keep a good track of who is in response of other people, and when has such a person been there.

This project is meant to solve this problem by providing:

- List of student unions
- List of students that have access to clubhouses (night / day keys etc..)
- An Event calendar to look for events (Available also as iCal / RSS)
- Rules of the clubhouse easily available
- Cleaning schedules of the clubhouse
- A "newsboard" system for posting announcements
- Management interface for easy responsibility taking of other people
- Comprehensive admin interface for administrators to be constantly up to date of whats happening.
- Very flexible permissions system. You can add roles and customize their permissions as you wish.

## Installation instructions

1. Clone the repo
2. Install yarn if not yet installed
3. Run `yarn` to install dependencies
4. Create `.env` file and define environment variables. See `.env.example` file.
5. `knex migrate:latest` to run migrations
6. `knex seed:run` to seed the database
7. `yarn start` to start the server or `yarn watch` to watch for code changes

## API documentation

## /api/v1/users

### GET /api/v1/users

_Returns:_ **A list of users registered in the service.**

_Response status code:_ **HTTP 200** (success), **HTTP 500** (server error)

_Response content-type:_ **application/json**

_Response body:_

```json
[
  {
    "userId": 1,
    "username": "user1",
    "email": "user1@email.com",
    "firstName": "firstname",
    "lastName": "lastname",
    "unionId": 1
  },
  {
    "userId": 2,
    "username": "user2",
    "email": "user2@email.com",
    "firstName": "firstname",
    "lastName": "lastname",
    "unionId": 1
  },
  {
    "userId": 3,
    "username": "user3",
    "email": "user3@email.com",
    "firstName": "firstname",
    "lastName": "lastname",
    "unionId": 1
  }
]
```

### GET /api/v1/users/:userId

_Returns:_ **Registered user if the request completes successfully**

_Request parameters:_ ```userId``` (URL parameter, integer)

_Response status code:_ **HTTP 200** (success), **HTTP 500** (server error)

_Response content-type:_ **application/json**

_Response body:_ **GET /api/v1/users/1**

```json
{
  "userId": 1,
  "username": "user1",
  "email": "user1@email.com",
  "firstName": "firstname",
  "lastName": "lastname",
  "unionId": 1
}
```

### POST /api/v1/users

_Returns:_ **Created user if the request succeeds**

_Request content-type:_ **application/json**

_Request body:_ 

Required: ```username```, ```email``` and ```password```

```json
{
  "username": "user1",
  "email": "user1@email.com",
  "password": "password1",
  "firstName": "firstname",
  "lastName": "lastname",
  "unionId": 1
}
```

_Response status code:_ **HTTP 201** (success on user creation), **HTTP 4xx** (validation error or user already exists), **HTTP 500** (server error)

_Response content-type:_ **application/json**

_Response body:_ Created user

```json
{
  "userId": 1,
  "username": "user1",
  "email": "user1@email.com",
  "firstName": "firstname",
  "lastName": "lastname",
  "unionId": 1
}
```

### GET /api/v1/users/:userId/permissions

_Returns:_ **Permissions of the user if the request completes successfully**

_Request parameters:_ ```userId``` (URL parameter, integer)

_Request headers:_ ```Authorization: Bearer {TOKEN}``` (Requires user to be authenticated)

_Response status code:_ **HTTP 200** (success), **HTTP 500** (server error)

_Response content-type:_ **application/json**

_Response body:_ **GET /api/v1/users/1/permissions**

```json
{
  "userId": 1,
  "permissions": {
    "banUser": 0,
    "editUserRole": 0,
    "makeUserAdmin": 0,
    "allowUserLogin": 1,
    "addKeyToUser": 0,
    "removeKeyFromUser": 0,
    "changeKeyTypeOfUser": 0,
    "allowViewKeys": 1,
    "addUserToUnion": 0,
    "removeUserFromUnion": 0,
    "addStudentUnion": 0,
    "removeStudentUnion": 0,
    "editStudentUnion": 0,
    "allowViewStudentUnions": 1,
    "addEvent": 0,
    "editEvent": 0,
    "removeEvent": 0,
    "allowViewEvents": 1,
    "editRules": 0,
    "allowViewRules": 1,
    "addOwnPost": 0,
    "editOwnPost": 0,
    "removeOwnPost": 0,
    "allowViewNews": 1,
    "editOthersPosts": 0,
    "removeOthersPosts": 0,
    "sendMails": 0
  }
}
```

## /api/v1/studentunion

### GET /api/v1/studentunion

_Returns:_ **A list of student unions in the service.**

_Response status code:_ **HTTP 200** (success), **HTTP 500** (server error)

_Response content-type:_ **application/json**

_Response body:_

```json
[
  {
    "unionId": 1,
    "name": "Union 1",
    "description": "Union 1 description"
  },
  {
    "unionId": 2,
    "name": "Union 2",
    "description": "Union 2 description"
  },
  {
    "unionId": 3,
    "name": "Union 3",
    "description": "Union 3 description"
  }
]
```

### GET /api/v1/studentunion/:unionId

_Returns:_ **A single student unions in the service by its id.**

_Request parameters:_ ```unionId``` (URL parameter, integer)

_Response status code:_ **HTTP 200** (success), **HTTP 500** (server error)

_Response content-type:_ **application/json**

_Response body:_ **GET /api/v1/studentunion/1**

```json
{
  "unionId": 1,
  "name": "Union 1",
  "description": "Union 1 description"
}
```