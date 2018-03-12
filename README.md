# picfs-backend

Back-end for Full-stack software development project course

* Staging [URL]
* Production [URL]

## Installation instructions

1. Clone the repo
2. Install yarn if not yet installed
3. Run ```yarn``` to install dependencies
4. Create ```.env``` file and define environment variables. See ```.env.example``` file.
4. ```knex migrate:latest``` to run migrations
5. ```knex seed:run``` to seed the database
6. ```yarn start``` to start the server

## API documentation

## /api/v1/users

#### GET /api/v1/users
#### GET /api/v1/users/:userId
#### POST /api/v1/users

## /api/v1/images

#### GET /api/v1/images
#### GET /api/v1/images/:imageId
#### POST /api/v1/images