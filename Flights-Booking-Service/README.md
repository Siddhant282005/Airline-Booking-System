# Booking Service - Smart Sky

<p align="center">
  <strong>Booking orchestration, payment handling, and booking lifecycle management.</strong>
</p>

<p align="center">
  <img alt="Node.js" src="https://img.shields.io/badge/Node.js-18%2B-339933?logo=nodedotjs&logoColor=white">
  <img alt="Express" src="https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white">
  <img alt="RabbitMQ" src="https://img.shields.io/badge/RabbitMQ-Queue-FF6600?logo=rabbitmq&logoColor=white">
  <img alt="MySQL" src="https://img.shields.io/badge/MySQL-8-4479A1?logo=mysql&logoColor=white">
  <img alt="Port" src="https://img.shields.io/badge/Port-3002-orange">
</p>

## What This Service Does

- Creates and manages user flight bookings
- Processes booking payments
- Supports booking cancellation
- Publishes notification events to RabbitMQ for email delivery

## Port and Base URL

- Default port: `3002`
- Local base URL: `http://localhost:3002`

## Environment Variables

Create `Flights-Booking-Service/.env`:

```env
PORT=3002
FLIGHT_SERVICE=http://localhost:3001
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=smart_sky
```

## API Endpoints

Service base path: `/api/v1/bookings`

- `POST /api/v1/bookings` - create booking
- `GET /api/v1/bookings/user/:userId` - list user bookings
- `POST /api/v1/bookings/payment` - make payment
- `POST /api/v1/bookings/payments` - payment alias
- `PATCH /api/v1/bookings/:id/cancel` - cancel booking

## Queue Integration

- Connects to RabbitMQ at `amqp://localhost:5672`
- Publishes notification messages to queue: `noti-queue`
- Notification Service consumes these messages and sends emails

## Local Development

```bash
npm install
npx sequelize-cli db:migrate
npm run dev
```

## Notes

- Uses cron jobs for booking-state housekeeping logic.
- Supports idempotency-related request headers at gateway/service layer.
This is a base node js project template, which anyone can use as it has been prepared, by keeping some of the most important code principles and project management recommendations. Feel free to change anything. 


`src` -> Inside the src folder all the actual source code regarding the project will reside, this will not include any kind of tests. (You might want to make separate tests folder)

Lets take a look inside the `src` folder

 - `config` -> In this folder anything and everything regarding any configurations or setup of a library or module will be done. For example: setting up `dotenv` so that we can use the environment variables anywhere in a cleaner fashion, this is done in the `server-config.js`. One more example can be to setup you logging library that can help you to prepare meaningful logs, so configuration for this library should also be done here. 

 - `routes` -> In the routes folder, we register a route and the corresponding middleware and controllers to it. 

 - `middlewares` -> they are just going to intercept the incoming requests where we can write our validators, authenticators etc. 

 - `controllers` -> they are kind of the last middlewares as post them you call you business layer to execute the budiness logic. In controllers we just receive the incoming requests and data and then pass it to the business layer, and once business layer returns an output, we structure the API response in controllers and send the output. 

 - `repositories` -> this folder contains all the logic using which we interact the DB by writing queries, all the raw queries or ORM queries will go here.

 - `services` -> contains the buiness logic and interacts with repositories for data from the database

 - `utils` -> contains helper methods, error classes etc.

### Setup the project

 - Download this template from github and open it in your favourite text editor. 
 - Go inside the folder path and execute the following command:
  ```
  npm install
  ```
 - In the root directory create a `.env` file and add the following env variables
    ```
        PORT=<port number of your choice>
    ```
    ex: 
    ```
        PORT=3000
    ```
 - go inside the `src` folder and execute the following command:
    ```
      npx sequelize init
    ```
 - By executing the above command you will get migrations and seeders folder along with a config.json inside the config folder. 
 - If you're setting up your development environment, then write the username of your db, password of your db and in dialect mention whatever db you are using for ex: mysql, mariadb etc
 - If you're setting up test or prod environment, make sure you also replace the host with the hosted db url.

 - To run the server execute
 ```
 npm run dev
 ```