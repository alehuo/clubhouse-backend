# clubhouse-backend <!-- DOCTOC SKIP -->

![Maintainer](https://img.shields.io/badge/maintainer-alehuo-yellow.svg) ![license](https://img.shields.io/github/license/alehuo/clubhouse-backend.svg)

Staging (develop) [![Build Status](https://travis-ci.org/alehuo/clubhouse-backend.svg?branch=develop)](https://travis-ci.org/alehuo/clubhouse-backend)
[![Code coverage (develop)](https://codecov.io/gh/alehuo/clubhouse-backend/branch/develop/graph/badge.svg)](https://codecov.io/gh/alehuo/clubhouse-backend/branch/develop)

Production (master) [![Build Status](https://travis-ci.org/alehuo/clubhouse-backend.svg?branch=master)](https://travis-ci.org/alehuo/clubhouse-backend)
[![Code coverage (develop)](https://codecov.io/gh/alehuo/clubhouse-backend/branch/master/graph/badge.svg)](https://codecov.io/gh/alehuo/clubhouse-backend/branch/master)

[![devDependencies](https://david-dm.org/alehuo/clubhouse-backend/dev-status.svg)](https://david-dm.org/alehuo/clubhouse-backend)
[![dependencies](https://david-dm.org/alehuo/clubhouse-backend/status.svg)](https://david-dm.org/alehuo/clubhouse-backend)

[![Open Source Love](https://badges.frapsoft.com/os/v2/open-source.svg?v=103)](https://github.com/ellerbrock/open-source-badges/)
[![TypeScript](https://badges.frapsoft.com/typescript/code/typescript.svg?v=101)](https://github.com/ellerbrock/typescript-badges/)
![GitHub top language](https://img.shields.io/github/languages/top/alehuo/clubhouse-backend.svg)

[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/alehuo/clubhouse-backend/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/alehuo/clubhouse-backend.svg)](https://github.com/alehuo/clubhouse-backend/pulls)
[![GitHub issues](https://img.shields.io/github/issues/alehuo/clubhouse-backend.svg)](https://github.com/alehuo/clubhouse-backend/issues)

Back-end for Full-stack software development project course.

The back-end has been coded with TypeScript. A Dockerfile is also provided if you wish to deploy the app easily. Knex is used to handle DB migrations and seeding.

- [Production application at Heroku](https://clubhouse-backend.herokuapp.com)
- [Front-end repository](https://github.com/alehuo/clubhouse-frontend)

## Table of contents <!-- DOCTOC SKIP -->

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Introduction](#introduction)
  - [Creating databases manually](#creating-databases-manually)
- [Installation instructions](#installation-instructions)
  - [Without docker](#without-docker)
  - [With Docker](#with-docker)
- [Running tests & calculating code coverage](#running-tests--calculating-code-coverage)
- [API routes](#api-routes)
  - [/api/v1/authenticate](#apiv1authenticate)
    - [POST /api/v1/authenticate](#post-apiv1authenticate)
  - [/api/v1/user](#apiv1user)
    - [GET /api/v1/user](#get-apiv1user)
    - [GET /api/v1/user/:userId](#get-apiv1useruserid)
    - [POST /api/v1/user](#post-apiv1user)
    - [DELETE /api/v1/user/:userId](#delete-apiv1useruserid)
    - [PUT /api/v1/user/:userId](#put-apiv1useruserid)
  - [/api/v1/studentunion](#apiv1studentunion)
    - [GET /api/v1/studentunion](#get-apiv1studentunion)
    - [GET /api/v1/studentunion/:unionId](#get-apiv1studentunionunionid)
    - [POST /api/v1/studentunion](#post-apiv1studentunion)
    - [DELETE /api/v1/studentunion/:unionId](#delete-apiv1studentunionunionid)
    - [PUT /api/v1/studentunion/:unionId](#put-apiv1studentunionunionid)
  - [/api/v1/calendar](#apiv1calendar)
    - [GET /api/v1/calendar](#get-apiv1calendar)
    - [GET /api/v1/calendar/:eventId](#get-apiv1calendareventid)
    - [POST /api/v1/calendar](#post-apiv1calendar)
    - [GET /api/v1/calendar/:eventId/ical](#get-apiv1calendareventidical)
    - [DELETE /api/v1/calendar/:eventId](#delete-apiv1calendareventid)
    - [PUT /api/v1/calendar/:eventId](#put-apiv1calendareventid)
  - [/api/v1/location](#apiv1location)
    - [GET /api/v1/location](#get-apiv1location)
    - [GET /api/v1/location/:locationId](#get-apiv1locationlocationid)
    - [POST /api/v1/location](#post-apiv1location)
    - [DELETE /api/v1/location/:locationId](#delete-apiv1locationlocationid)
    - [PUT /api/v1/location/:locationId](#put-apiv1locationlocationid)
  - [/api/v1/permission](#apiv1permission)
    - [GET /api/v1/permission](#get-apiv1permission)
  - [/api/v1/session](#apiv1session)
    - [GET /api/v1/session/ongoing](#get-apiv1sessionongoing)
    - [GET /api/v1/session/user/:userId](#get-apiv1sessionuseruserid)
    - [GET /api/v1/session/ongoing/user/:userId](#get-apiv1sessionongoinguseruserid)
    - [POST /api/v1/session/start](#post-apiv1sessionstart)
    - [POST /api/v1/session/end](#post-apiv1sessionend)
  - [/api/v1/message](#apiv1message)
    - [GET /api/v1/message](#get-apiv1message)
    - [GET /api/v1/message/:messageId](#get-apiv1messagemessageid)
    - [POST /api/v1/message](#post-apiv1message)
    - [DELETE /api/v1/message/:messageId](#delete-apiv1messagemessageid)
    - [PUT /api/v1/message/:messageId](#put-apiv1messagemessageid)
  - [/api/v1/newspost](#apiv1newspost)
    - [GET /api/v1/newspost](#get-apiv1newspost)
    - [GET /api/v1/newspost/:postId](#get-apiv1newspostpostid)
    - [GET /api/v1/newspost/user/:userId](#get-apiv1newspostuseruserid)
    - [POST /api/v1/newspost](#post-apiv1newspost)
    - [DELETE /api/v1/newspost/:postId](#delete-apiv1newspostpostid)
    - [PUT /api/v1/newspost/:postId](#put-apiv1newspostpostid)
  - [/api/v1/statistics](#apiv1statistics)
    - [GET /api/v1/statistics](#get-apiv1statistics)
    - [GET /api/v1/statistics/:userId](#get-apiv1statisticsuserid)
- [Permissions](#permissions)
  - [List of permissions](#list-of-permissions)
  - [Combining permissions](#combining-permissions)
  - [Checking permissions](#checking-permissions)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Introduction

Many student unions across Finland use so called "clubhouses" where they can organize events and have fun with other students.

It is not always clear what events are kept there, who has the permission to use such places and how to keep a good track of who is in response of other people, and when has such a person been there.

This project is meant to solve this problem by providing:

- List of student unions
- List of users
- List of students that have access to clubhouses (night / day keys etc..)
- An event calendar to look for events (Available also as iCal feed)
- Rules of the clubhouse easily available
- Cleaning schedules of the clubhouse\*
- A "newsboard" system for posting announcements
- Management interface for easy responsibility taking of other people
- Comprehensive admin interface for administrators to be constantly up to date of whats happening.
- Very flexible permissions system. You can add roles and customize their permissions as you wish.
- Spotify API support

\* not yet implemented

### Creating databases manually

You need to create databases `DB_NAME_test`, `DB_NAME_dev` and `DB_NAME`, where `DB_NAME` is the database you want to use with your setup. This can be done manually, or by executing `yarn create-databases` when `.env` file is configured.

## Installation instructions

### Without docker

1.  Clone the repo
2.  Install yarn if not yet installed
3.  Run `yarn` to install dependencies
4.  Create `.env` file and define environment variables. See `.env.example` file.
5.  `yarn create-databases` to create necessary databases (optionally, you can create the databases manually.)
6.  `yarn migrate` to run migrations
7.  `yarn seed` to seed the database
8.  `yarn start` to start the server or `yarn watch` to watch for code changes

### With Docker

1. Clone the repo
2. Run `docker-compose up -d --build`
3. Run `yarn migrate-docker`
4. Run `yarn seed-docker` to seed your database with example users

## Running tests & calculating code coverage

To run tests, run `yarn test`. To run tests in a container environment, run `yarn test-docker`.

## API routes

### /api/v1/authenticate

#### POST /api/v1/authenticate

_Returns:_ **JWT if the authentication succeeds**

_Request content-type:_ **application/json**

_Request body:_

Required: `email` and `password`

```json
{
  "email": "user1@email.com",
  "password": "password1"
}
```

_Response status code:_ **HTTP 200** (success on authentication), **HTTP 4xx** (validation error or user already exists), **HTTP 500** (server error)

_Response content-type:_ **application/json**

_Response body:_ JWT

```json
{
  "success": true,
  "message": "Authentication successful",
  "payload": {
    "token": "TOKEN"
  }
}
```

### /api/v1/user

#### GET /api/v1/user

_Returns:_ **A list of users registered in the service.**

_Response status code:_ **HTTP 200** (success), **HTTP 500** (server error)

_Response content-type:_ **application/json**

_Response body:_

```json
{
  "success": true,
  "message": "Succesfully fetched users",
  "payload": [{
    "userId": 1,
    "email": "testuser@email.com",
    "firstName": "Test",
    "lastName": "User",
    "permissions": 524287,
    "created_at": "2018-12-29 09:14:08",
    "updated_at": "2018-12-29 09:14:08"
  }, {
    "userId": 2,
    "email": "testuser2@email.com",
    "firstName": "Test2",
    "lastName": "User2",
    "permissions": 8,
    "created_at": "2018-12-29 09:14:08",
    "updated_at": "2018-12-29 09:14:08"
  }]
}
```

#### GET /api/v1/user/:userId

_Returns:_ **Registered user if the request completes successfully**

_Request parameters:_ `userId` (URL parameter, integer)

_Response status code:_ **HTTP 200** (success), **HTTP 404** (not found), **HTTP 500** (server error)

_Response content-type:_ **application/json**

_Response body:_ **GET /api/v1/user/1**

```json
{
  "success": true,
  "message": "",
  "payload": {
    "userId": 1,
    "email": "testuser@email.com",
    "firstName": "Test",
    "lastName": "User",
    "permissions": 524287,
    "created_at": "2018-12-29 09:14:08",
    "updated_at": "2018-12-29 09:14:08"
  }
}
```

#### POST /api/v1/user

_Returns:_ **Created user if the request succeeds**

_Request content-type:_ **application/json**

_Request body:_

Required: `email`, `password`, `firstName` and `lastName`

```json
{
  "email": "user1@email.com",
  "password": "password1",
  "firstName": "firstname",
  "lastName": "lastname"
}
```

_Response status code:_ **HTTP 201** (success on user creation), **HTTP 4xx** (validation error or user already exists), **HTTP 500** (server error)

_Response content-type:_ **application/json**

_Response body:_ Created user

```json
{
  "success": true,
  "message": "",
  "payload": {
    "userId": 5,
    "email": "user1@email.com",
    "firstName": "firstname",
    "lastName": "lastname",
    "permissions": 8,
    "created_at": "2018-12-29 09:17:52",
    "updated_at": "2018-12-29 09:17:52"
  }
}
```

#### DELETE /api/v1/user/:userId

_Response body:_

```json
{
  "success": true,
  "message": "User deleted from the server (including his/her created calendar events, messages, sessions and newsposts.)"
}
```

#### PUT /api/v1/user/:userId

Todo

### /api/v1/studentunion

#### GET /api/v1/studentunion

_Returns:_ **A list of student unions in the service.**

_Response status code:_ **HTTP 200** (success), **HTTP 500** (server error)

_Response content-type:_ **application/json**

_Response body:_

```json
{
  "success": true,
  "message": "Succesfully fetched student unions",
  "payload": [{
    "unionId": 1,
    "name": "Union 1",
    "description": "Union 1 description",
    "created_at": "2018-12-29 09:14:08",
    "updated_at": "2018-12-29 09:14:08"
  }, {
    "unionId": 2,
    "name": "Union 2",
    "description": "Union 2 description",
    "created_at": "2018-12-29 09:14:08",
    "updated_at": "2018-12-29 09:14:08"
  }, {
    "unionId": 3,
    "name": "Union 3",
    "description": "Union 3 description",
    "created_at": "2018-12-29 09:14:08",
    "updated_at": "2018-12-29 09:14:08"
  }]
}
```

#### GET /api/v1/studentunion/:unionId

_Returns:_ **A single student unions in the service by its id.**

_Request parameters:_ `unionId` (URL parameter, integer)

_Response status code:_ **HTTP 200** (success), **HTTP 404** (not found), **HTTP 500** (server error)

_Response content-type:_ **application/json**

_Response body:_ **GET /api/v1/studentunion/1**

```json
{
  "success": true,
  "message": "",
  "payload": {
    "unionId": 1,
    "name": "Union 1",
    "description": "Union 1 description",
    "created_at": "2018-12-29 09:14:08",
    "updated_at": "2018-12-29 09:14:08"
  }
}
```

#### POST /api/v1/studentunion

_Returns:_ **Created student union if the request succeeds**

_Request content-type:_ **application/json**

_Request body:_

Required: `name` and `description`

```json
{
  "name": "HelloWorld",
  "description": "Description for student union"
}
```

_Response status code:_ **HTTP 201** (success on student union creation), **HTTP 4xx** (validation error or user already exists), **HTTP 500** (server error)

_Response content-type:_ **application/json**

_Response body:_ Created student union

```json
{
  "success": true,
  "message": "",
  "payload": {
    "name": "HelloWorld",
    "description": "Description for student union",
    "unionId": 4,
    "created_at": "2018-12-29T09:22:28.833Z",
    "updated_at": "2018-12-29T09:22:28.833Z"
  }
}
```

#### DELETE /api/v1/studentunion/:unionId

Todo

#### PUT /api/v1/studentunion/:unionId

Todo

### /api/v1/calendar

#### GET /api/v1/calendar

_Returns:_ **All calendar events in the service, past and present.**

_Response status code:_ **HTTP 200** (success), **HTTP 500** (server error)

_Response content-type:_ **application/json**

_Response body:_

```json
{
  "success": true,
  "message": "Succesfully fetched calendar events",
  "payload": [{
    "eventId": 1,
    "name": "Friday hangouts",
    "description": "Friday hangouts at our clubhouse",
    "restricted": 0,
    "startTime": "2018-12-29 09:14:08",
    "endTime": "2018-12-29 12:14:08",
    "addedBy": 1,
    "unionId": 1,
    "locationId": 2,
    "created_at": "2018-12-29 09:14:08",
    "updated_at": "2018-12-29 09:14:08"
  }, {
    "eventId": 2,
    "name": "Board meeting",
    "description": "Board meeting",
    "restricted": 0,
    "startTime": "2018-12-29 09:14:08",
    "endTime": "2018-12-29 12:14:08",
    "addedBy": 1,
    "unionId": 1,
    "locationId": 1,
    "created_at": "2018-12-29 09:14:08",
    "updated_at": "2018-12-29 09:14:08"
  }]
}
```

#### GET /api/v1/calendar/:eventId

_Returns:_ **A single calendar event in the service by its id.**

_Request parameters:_ `eventId` (URL parameter, integer)

_Response status code:_ **HTTP 200** (success), **HTTP 404** (not found), **HTTP 500** (server error)

_Response content-type:_ **application/json**

_Response body:_ **GET /api/v1/calendar/1**

```json
{
  "success": true,
  "message": "Succesfully fetched single calendar event",
  "payload": {
    "eventId": 1,
    "name": "Friday hangouts",
    "description": "Friday hangouts at our clubhouse",
    "restricted": 0,
    "startTime": "2018-12-29 09:14:08",
    "endTime": "2018-12-29 12:14:08",
    "addedBy": 1,
    "unionId": 1,
    "locationId": 2,
    "created_at": "2018-12-29 09:14:08",
    "updated_at": "2018-12-29 09:14:08"
  }
}
```

#### POST /api/v1/calendar

_Returns:_ **Created calendar event if the request succeeds**

_Request content-type:_ **application/json**

_Required permissions:_ **ADD_EVENT**

_Request headers:_ **Authorization: Bearer `[TOKEN]`**

_Request body:_

Required: `name`, `description`, `restricted`, `startTime`, `endTime`, `unionId` and `locationId`

```json
{
  "name": "Test event",
  "description": "Test event",
  "restricted": 0,
  "startTime": "2018-08-12 12:00",
  "endTime": "2018-08-12 14:00",
  "unionId": 1,
  "locationId": 2
}
```

_Response status code:_ **HTTP 201** (success on calendar event creation), **HTTP 4xx** (validation error), **HTTP 500** (server error)

_Response content-type:_ **application/json**

_Response body:_ Created calendar event

```json
{
  "success": true,
  "message": "Succesfully saved calendar event",
  "payload": {
    "eventId": 3,
    "name": "Test event",
    "description": "Test event",
    "restricted": 0,
    "startTime": "2018-08-12 12:00:00",
    "endTime": "2018-08-12 14:00:00",
    "addedBy": 1,
    "unionId": 1,
    "locationId": 2,
    "created_at": "2018-12-29 09:24:46",
    "updated_at": "2018-12-29 09:24:46"
  }
}
```

#### GET /api/v1/calendar/:eventId/ical

_Returns:_ **An iCal file of the event in the service by its id. Triggers a file download in the browser.**

_Request parameters:_ `eventId` (URL parameter, integer)

_Response status code:_ **HTTP 200** (success), **HTTP 404** (not found), **HTTP 500** (server error)

_Response content-type:_ **text/calendar**

_Response body:_ **GET /api/v1/calendar/1/ical**

```text
BEGIN:VCALENDAR
VERSION:2.0
PRODID:clubhouse
METHOD:PUBLISH
BEGIN:VEVENT
CATEGORIES:MEETING
STATUS:TENTATIVE
DTSTAMP:20181229T092543
DTSTART:20181229T091408
UID:20181229T092543@clubhouse.com_1
DTSTART:20181229T091408
DTEND:20181229T121408
SUMMARY: Friday hangouts
DESCRIPTION: Friday hangouts at our clubhouse
LOCATION: Street Addr 1
CLASS:PRIVATE
END:VEVENT
END:VCALENDAR
```

#### DELETE /api/v1/calendar/:eventId

Todo

#### PUT /api/v1/calendar/:eventId

Todo

### /api/v1/location

#### GET /api/v1/location

_Returns:_ **All locations in the service.**

_Response status code:_ **HTTP 200** (success), **HTTP 500** (server error)

_Response content-type:_ **application/json**

_Response body:_

```json
[{
  "locationId": 1,
  "name": "Meeting room",
  "address": "Street Addr 1",
  "created_at": "2018-12-29 09:14:08",
  "updated_at": "2018-12-29 09:14:08"
}, {
  "locationId": 2,
  "name": "Club",
  "address": "Street Addr 1",
  "created_at": "2018-12-29 09:14:08",
  "updated_at": "2018-12-29 09:14:08"
}]
```

#### GET /api/v1/location/:locationId

_Returns:_ **A single location in the service by its id.**

_Request parameters:_ `locationId` (URL parameter, integer)

_Response status code:_ **HTTP 200** (success), **HTTP 404** (not found), **HTTP 500** (server error)

_Response content-type:_ **application/json**

_Response body:_ **GET /api/v1/location/1**

```json
{
  "success": true,
  "message": "",
  "payload": {
    "locationId": 1,
    "name": "Meeting room",
    "address": "Street Addr 1",
    "created_at": "2018-12-29 09:14:08",
    "updated_at": "2018-12-29 09:14:08"
  }
}
```

#### POST /api/v1/location

_Returns:_ **Created location if the request succeeds**

_Request content-type:_ **application/json**

_Required permissions:_ **ADD_LOCATION**

_Request headers:_ **Authorization: Bearer `[TOKEN]`**

_Request body:_

Required: `name` and `address`

```json
{
  "name": "Meeting room",
  "address": "Street Addr 1"
}
```

_Response status code:_ **HTTP 201** (success on location creation), **HTTP 4xx** (validation error), **HTTP 500** (server error)

_Response content-type:_ **application/json**

_Response body:_ Created location

```json
{
  "success": true,
  "message": "",
  "payload": {
    "locationId": 1,
    "name": "Meeting room",
    "address": "Street Addr 1",
    "created_at": "2018-12-29 09:14:08",
    "updated_at": "2018-12-29 09:14:08"
  }
}
```

#### DELETE /api/v1/location/:locationId

Todo

#### PUT /api/v1/location/:locationId

Todo

### /api/v1/permission

#### GET /api/v1/permission

_Returns:_ **All permissions in the service.**

_Response status code:_ **HTTP 200** (success), **HTTP 500** (server error)

_Response content-type:_ **application/json**

_Response body:_

```json
{
  "success": true,
  "message": "",
  "payload": {
    "ALLOW_REMOVE_USER": 1,
    "ALLOW_VIEW_USERS": 2,
    "ALLOW_ADD_REMOVE_KEYS": 4,
    "ALLOW_VIEW_KEYS": 8,
    "ALLOW_ADD_EDIT_REMOVE_STUDENT_UNIONS": 16,
    "ALLOW_VIEW_STUDENT_UNIONS": 32,
    "ALLOW_ADD_EDIT_REMOVE_EVENTS": 64,
    "ALLOW_VIEW_EVENTS": 128,
    "ALLOW_ADD_EDIT_REMOVE_RULES": 256,
    "ALLOW_VIEW_RULES": 512,
    "ALLOW_ADD_EDIT_REMOVE_POSTS": 1024,
    "ALLOW_VIEW_POSTS": 2048,
    "ALLOW_ADD_EDIT_REMOVE_LOCATIONS": 4096,
    "ALLOW_VIEW_LOCATIONS": 8192,
    "ALLOW_ADD_EDIT_REMOVE_MESSAGES": 16384,
    "ALLOW_VIEW_MESSAGES": 32768,
    "ALLOW_ADD_EDIT_REMOVE_PERMISSIONS": 65536,
    "ALLOW_VIEW_PERMISSIONS": 131072,
    "ACCESS_SPOTIFY_API": 262144
  }
}
```

### /api/v1/session

#### GET /api/v1/session/ongoing

_Returns:_ **All ongoing sessions in the service.**

_Request headers:_ **Authorization: Bearer `[TOKEN]`**

_Response status code:_ **HTTP 200** (success), **HTTP 500** (server error)

_Response content-type:_ **application/json**

_Response body:_

```json
{
  "success": true,
  "message": "",
  "payload": [{
    "sessionId": 2,
    "userId": 1,
    "startMessage": "Good evening, I'm taking responsibility of a few exchange students.",
    "endMessage": "",
    "startTime": "2018-07-01 23:58:00",
    "created_at": "2018-12-29 09:14:08",
    "updated_at": "2018-12-29 09:14:08"
  }]
}
```

#### GET /api/v1/session/user/:userId

_Returns:_ **All sessions (old and ongoing) by a single user, by its id.**

_Request headers:_ **Authorization: Bearer `[TOKEN]`**

_Request parameters:_ `userId` (URL parameter, integer)

_Response status code:_ **HTTP 200** (success), **HTTP 404** (not found), **HTTP 500** (server error)

_Response content-type:_ **application/json**

_Response body:_ **GET /api/v1/session/user/1**

```json
{
  "success": true,
  "message": "",
  "payload": [{
    "sessionId": 1,
    "userId": 1,
    "startMessage": "Let's get this party started.",
    "endMessage": "I have left the building. Moved people under my supervision to another keyholder.",
    "startTime": "2017-07-01 00:00:00",
    "endTime": "2017-07-01 00:10:00",
    "created_at": "2018-12-29 09:14:08",
    "updated_at": "2018-12-29 09:14:08"
  }, {
    "sessionId": 2,
    "userId": 1,
    "startMessage": "Good evening, I'm taking responsibility of a few exchange students.",
    "endMessage": "",
    "startTime": "2018-07-01 23:58:00",
    "created_at": "2018-12-29 09:14:08",
    "updated_at": "2018-12-29 09:14:08"
  }]
}
```

#### GET /api/v1/session/ongoing/user/:userId

_Returns:_ **All ongoing watches by a single user, by its id.**

_Request headers:_ **Authorization: Bearer `[TOKEN]`**

_Request parameters:_ `userId` (URL parameter, integer)

_Response status code:_ **HTTP 200** (success), **HTTP 404** (not found), **HTTP 500** (server error)

_Response content-type:_ **application/json**

_Response body:_ **GET /api/v1/session/ongoing/user/1**

```json
{
  "success": true,
  "message": "",
  "payload": [{
    "sessionId": 2,
    "userId": 1,
    "startMessage": "Good evening, I'm taking responsibility of a few exchange students.",
    "endMessage": "",
    "startTime": "2018-07-01 23:58:00",
    "created_at": "2018-12-29 09:14:08",
    "updated_at": "2018-12-29 09:14:08"
  }]
}
```

#### POST /api/v1/session/start

_Returns:_ **Starts a new session.**

_Request content-type:_ **application/json**

_Request headers:_ **Authorization: Bearer `[TOKEN]`**

_Request body:_

Required: `startMessage`

```json
{
  "startMessage": "Start message of the session."
}
```

_Response status code:_ **HTTP 201** (success on starting a new session), **HTTP 500** (server error)

_Response content-type:_ **application/json**

_Response body:_ Status message

```json
{
  "success": true,
  "message": "Session started"
}
```

#### POST /api/v1/session/end

_Returns:_ **Ends an ongoing session.**

_Request content-type:_ **application/json**

_Request headers:_ **Authorization: Bearer `[TOKEN]`**

_Request body:_

Required: `endMessage`

```json
{
  "endMessage": "End message of the session."
}
```

_Response status code:_ **HTTP 200** (success on ending a session), **HTTP 500** (server error)

_Response content-type:_ **application/json**

_Response body:_ Status message

```json
{
  "success": true,
  "message": "Session ended with message 'End message of the session.'"
}
```

### /api/v1/message

#### GET /api/v1/message

_Returns:_ **All messages in the service.**

_Response status code:_ **HTTP 200** (success), **HTTP 500** (server error)

_Response content-type:_ **application/json**

_Response body:_

```json
{
  "success": true,
  "message": "",
  "payload": [{
    "messageId": 1,
    "created_at": "2018-12-29 09:30:43",
    "updated_at": "2018-12-29 09:30:43",
    "userId": 1,
    "title": "(No title)",
    "message": "Hello world!"
  }]
}
```

#### GET /api/v1/message/:messageId

_Returns:_ **A single message in the service by its id.**

_Request parameters:_ `messageId` (URL parameter, integer)

_Response status code:_ **HTTP 200** (success), **HTTP 500** (server error)

_Response content-type:_ **application/json**

_Response body:_ **GET /api/v1/message/1**

```json
{
  "success": true,
  "message": "",
  "payload": {
    "messageId": 1,
    "created_at": "2018-12-29 09:30:43",
    "updated_at": "2018-12-29 09:30:43",
    "userId": 1,
    "title": "(No title)",
    "message": "Hello world!"
  }
}
```

#### POST /api/v1/message

_Returns:_ **Inserted message in the service**

_Request content-type:_ **application/json**

_Request headers:_ **Authorization: Bearer `[TOKEN]`**

_Request body:_

Required: `message`

```json
{
  "message": "Hello world!"
}
```

_Response status code:_ **HTTP 201** (success on message creation), **HTTP 400** (valiadtion error), **HTTP 500** (server error)

_Response content-type:_ **application/json**

_Response body:_

```json
{
  "success": true,
  "message": "",
  "payload": {
    "created_at": "2018-12-29T09:30:42.572Z",
    "updated_at": "2018-12-29T09:30:42.572Z",
    "message": "Hello world!",
    "title": "(No title)",
    "userId": 1,
    "messageId": 1
  }
}
```

#### DELETE /api/v1/message/:messageId

Todo

#### PUT /api/v1/message/:messageId

Todo

### /api/v1/newspost

#### GET /api/v1/newspost

_Returns:_ **All newsposts in the service.**

_Response status code:_ **HTTP 200** (success), **HTTP 500** (server error)

_Response content-type:_ **application/json**

_Response body:_

```json
{
  "success": true,
  "message": "",
  "payload": [{
    "postId": 1,
    "created_at": "2018-12-29 09:14:08",
    "updated_at": "2018-12-29 09:14:08",
    "author": 1,
    "title": "Welcome to our site",
    "message": "Welcome to the new clubhouse management website."
  }]
}
```

#### GET /api/v1/newspost/:postId

_Returns:_ **A single newspost in the service by its id.**

_Request parameters:_ `postId` (URL parameter, integer)

_Response status code:_ **HTTP 200** (success), **HTTP 500** (server error)

_Response content-type:_ **application/json**

_Response body:_ **GET /api/v1/newspost/1**

```json
{
  "success": true,
  "message": "",
  "payload": {
    "postId": 1,
    "created_at": "2018-12-29 09:14:08",
    "updated_at": "2018-12-29 09:14:08",
    "author": 1,
    "title": "Welcome to our site",
    "message": "Welcome to the new clubhouse management website."
  }
}
```

#### GET /api/v1/newspost/user/:userId

_Returns:_ **All newsposts by a single user in the service.**

_Request parameters:_ `userId` (URL parameter, integer)

_Response status code:_ **HTTP 200** (success), **HTTP 500** (server error)

_Response content-type:_ **application/json**

_Response body:_ **GET /api/v1/newspost/user/1**

```json
{
  "success": true,
  "message": "",
  "payload": [{
    "postId": 1,
    "created_at": "2018-12-29 09:14:08",
    "updated_at": "2018-12-29 09:14:08",
    "author": 1,
    "title": "Welcome to our site",
    "message": "Welcome to the new clubhouse management website."
  }]
}
```

#### POST /api/v1/newspost

_Returns:_ **Inserted newspost in the service**

_Request content-type:_ **application/json**

_Request headers:_ **Authorization: Bearer `[TOKEN]`**

_Request body:_

Required: `title` and `message`

```json
{
  "title": "Hello world",
  "message": "First post"
}
```

_Response status code:_ **HTTP 201** (success on message creation), **HTTP 400** (valiadtion error), **HTTP 500** (server error)

_Response content-type:_ **application/json**

_Response body:_

```json
{
  "success": true,
  "message": "",
  "payload": {
    "created_at": "2018-12-29T09:33:38.474Z",
    "updated_at": "2018-12-29T09:33:38.474Z",
    "message": "First post",
    "title": "Hello world",
    "author": 1,
    "postId": 2
  }
}
```

#### DELETE /api/v1/newspost/:postId

_Returns:_ **Status if the deletion succeeded or not.**

_Request parameters:_ `postId` (URL parameter, integer)

_Response status code:_ **HTTP 200** (success), **HTTP 400** (deletion error), **HTTP 500** (server error)

_Response content-type:_ **application/json**

_Response body:_ **DELETE /api/v1/newspost/1**

```json
{
  "success": true,
  "message": "Newspost deleted"
}
```

#### PUT /api/v1/newspost/:postId

Todo

### /api/v1/statistics

#### GET /api/v1/statistics

_Returns:_ **Statistics of the clubhouse management system.**

_Response status code:_ **HTTP 200** (success), **HTTP 500** (server error)

_Response content-type:_ **application/json**

_Response body:_

```json
{
  "userCount": 3,
  "eventCount": 2,
  "newspostCount": 1,
  "hoursOnWatch": 0.16666666666666666,
  "messageCount": 2
}
```

#### GET /api/v1/statistics/:userId

_Returns:_ **Statistics of a single user in the clubhouse management system.**

_Request parameters:_ `userId` (URL parameter, integer)

_Response status code:_ **HTTP 200** (success), **HTTP 500** (server error)

_Response content-type:_ **application/json**

_Response body:_ **GET /api/v1/statistics/1**

```json
{
  "eventCount": 2,
  "newspostCount": 1,
  "hoursOnWatch": 0.16666666666666666,
  "watchCount": 2,
  "messageCount": 2
}
```

## Permissions

The back end has an advanced permission system, that allows for a fine tuned management of user permissions. Below is a table that has listed all permission bits that are in use.

### List of permissions

| Name                      | Description                                     | Value      |
| ------------------------- | ----------------------------------------------- | ---------- |
| BAN_USER                  | Ban a user                                      | 0x00000001 |
| EDIT_USER_ROLE            | Edit user roles                                 | 0x00000002 |
| MAKE_USER_ADMIN           | Make user an admin                              | 0x00000004 |
| ALLOW_USER_LOGIN          | Allow user to login (default permission)        | 0x00000008 |
| ADD_KEY_TO_USER           | Add a key to user                               | 0x00000010 |
| REMOVE_KEY_FROM_USER      | Remove key from user                            | 0x00000020 |
| CHANGE_KEY_TYPE_OF_USER   | Change the key type of an user                  | 0x00000040 |
| ALLOW_VIEW_KEYS           | Allow user to view keys                         | 0x00000080 |
| ADD_USER_TO_UNION         | Add user to a student union.                    | 0x00000100 |
| REMOVE_USER_FROM_UNION    | Remove user from a student union                | 0x00000200 |
| ADD_STUDENT_UNION         | Add a student union                             | 0x00000400 |
| REMOVE_STUDENT_UNION      | Remove a student union                          | 0x00000800 |
| EDIT_STUDENT_UNION        | Edit a student union                            | 0x00001000 |
| ALLOW_VIEW_STUDENT_UNIONS | Allow user to view student unions               | 0x00002000 |
| ADD_EVENT                 | Add an event                                    | 0x00004000 |
| EDIT_EVENT                | Edit an event                                   | 0x00008000 |
| REMOVE_EVENT              | Remove an event                                 | 0x00010000 |
| ALLOW_VIEW_EVENTS         | Allow user to view events                       | 0x00020000 |
| EDIT_RULES                | Allow user to edit rules                        | 0x00040000 |
| ALLOW_VIEW_RULES          | Allow user to view rules                        | 0x00080000 |
| ADD_POSTS                 | Allow user to add posts                         | 0x00100000 |
| EDIT_AND_REMOVE_OWN_POSTS | Allow user to edit and remove his/her own posts | 0x00200000 |
| REMOVE_POSTS              | Allow user to remove posts                      | 0x00400000 |
| ALLOW_VIEW_POSTS          | Allow user to view posts                        | 0x00800000 |
| EDIT_OTHERS_POSTS         | Allow user to edit others' posts                | 0x01000000 |
| SEND_MAILS                | Allow user to send mails                        | 0x02000000 |
| ADD_LOCATION              | Allow user to add a location                    | 0x04000000 |
| EDIT_LOCATION             | Allow user to edit a location                   | 0x08000000 |

### Combining permissions

Permissions can be combined with bitwise operations. For example, if I want a user to be able to login and view rules, a bitwise operation is made: `0x00000008 | 0x00080000` what is equal to `0x00080008`.

### Checking permissions

If you want to check if a user has a certain permission, do it like this:
`0x00080008 & 0x00000008` = `0x00000008`

If the result is equal to the permission that has been checked, the user is allowed to do the operation.

## License

This project is licensed with MIT license.
