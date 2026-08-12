# AI Planner Assistant — Backend

A [NestJS](https://nestjs.com) REST API for a personal AI-assisted planning app. It manages users, life areas, goals and tasks, and integrates with an [n8n](https://n8n.io) workflow for AI-driven task optimization and chat.

## Features

- **Auth** — registration and login with JWT (`src/auth`)
- **Users** — current user profile (`src/users`)
- **Life areas** — top-level categories used to organize goals (`src/life-areas`)
- **Goals** — goals linked to life areas, with status tracking (`src/goals`)
- **Tasks** — tasks linked to goals, with completion toggling and AI-driven optimization via n8n (`src/tasks`)
- **Chat** — chat endpoint proxied to an n8n webhook (`src/chat`)

## Tech stack

- [NestJS](https://nestjs.com) 10 / TypeScript
- [TypeORM](https://typeorm.io) with PostgreSQL
- Passport + JWT for authentication
- n8n webhooks for AI integrations

## Project setup

```bash
$ npm install
```

Create a `.env` file with the following variables:

```
# Database
DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_NAME=
DATABASE_URL=

# Auth
JWT_SECRET=
JWT_EXPIRES_IN=

# Integrations (n8n)
N8N_WEBHOOK_URL=
N8N_AI_OPTIMIZE_WEBHOOK_URL=
```

Start a local PostgreSQL instance with Docker Compose:

```bash
$ docker-compose up -d
```

## Database migrations

```bash
# generate a migration from entity changes
$ npm run migration:generate -- src/migrations/<MigrationName>

# run pending migrations
$ npm run migration:run
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## API overview

| Module      | Base route   | Description                                  |
| ----------- | ------------ | --------------------------------------------- |
| Auth        | `/auth`      | `POST /register`, `POST /login`               |
| Users       | `/users`     | `GET /me`                                     |
| Life areas  | `/life-areas`| CRUD for life areas                           |
| Goals       | `/goals`     | CRUD for goals, `PATCH /:id/status`           |
| Tasks       | `/tasks`     | CRUD for tasks, `PATCH /:id/toggle`, `POST /optimize` |
| Chat        | `/chat`      | `POST /` — proxies to n8n chat webhook        |

All routes except `/auth/register` and `/auth/login` require a JWT bearer token.

## License

UNLICENSED — private project.
