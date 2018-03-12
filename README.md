# picfs-backend

Back-end for Full-stack software development project course

* Staging [URL]
* Production [URL]

## Installation instructions

1.  Clone the repo
2.  Install yarn if not yet installed
3.  Run `yarn` to install dependencies
4.  Create `.env` file and define environment variables. See `.env.example` file.
5.  `knex migrate:latest` to run migrations
6.  `knex seed:run` to seed the database
7.  `yarn start` to start the server

## API documentation

## /api/v1/users

#### GET /api/v1/users

_Returns:_ **A list of users registered in the service.**

_Status code:_ **HTTP 200**

_Response body:_

```
[
  {
    "userId": 1,
    "username": "user1",
    "email": "user1@email.com"
  },
  {
    "userId": 2,
    "username": "user2",
    "email": "user2@email.com"
  },
  {
    "userId": 3,
    "username": "user3",
    "email": "user3@email.com"
  }
]
```

#### GET /api/v1/users/:userId

#### POST /api/v1/users

## /api/v1/images

#### GET /api/v1/images

#### GET /api/v1/images/:imageId

#### POST /api/v1/images
