# LendSqr Bank Account API

Backend REST API on Node.js + Express.js + Typescript + KnexJS.

# Account API
This API allow users to create account, fund their account, transfer funds and withdraw from their account. The User can also create multiple account and access transaction history

# Features
- Basic Authentication (Register & Login)
- Create Account
- Fund Account
- Transfer Fund
- Withdraw Fund
- View Transaction history

# API Documentation
https://documenter.getpostman.com/view/13581274/Uz5Dpx62

## Quick Start to run locally

## Clone Repo

## Run npm install

## Create .env file

    Create .env file in project folder
    Enter these lines:

        NODE_ENV = 'production'
        JWT_SECRET =
        JWT_ACCESS_EXPIRATION_MINUTES=
        JWT_REFRESH_EXPIRATION_DAYS=
        DB_HOST=
        DB_DATABASE=
        DB_DATABASE_TEST=
        DB_USERNAME=
        DB_PASSWORD=

## Running and resetting migrations
1. To run migrations
```
npm run migrate
```
2. To reset migrations
```
npm run migrate:reset
```

## Start App
    npm start for production
    npm run dev - development
    npm run test - test

## Project Structure

```
src\
 |--config\         # Environment variables and configuration related things
 |--controllers\    # Route controllers (controller layer)
 |--test\           # Test
 |--middlewares\    # Custom express middlewares
 |--models\         # Knex models (data layer)
 |--routes\         # Routes
 |--services\       # Business logic (service layer)
 |--helpers\          # Utility classes and functions
 |--validations\    # Request data validation schemas
 |--app.js          # Express app
```

## Validation

Request data is validated using [Joi](https://joi.dev/).
The validation schemas are defined in the `/validations` directory and are used in the routes by providing them as parameters to the `validate` middleware.

## Running Tests

```
npm run test
```
Test is powered by Jest testing library.

**Note:** Make sure you set up the test variables in the `.env` file

