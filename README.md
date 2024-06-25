# E-Commerce-app

This is an e-commerce RESTful server focusing on the Orders Management bounded context. It implements CQRS and Event Sourcing using MongoDB. The application allows creating, paying, cancelling, confirming, delivering and retrieving orders. It also includes user authentication and authorization. Unit tests are provided for the event manager and order handler. You can find mock data to test the application yourself in the file MockData.txt.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup and Installation](#setup-and-installation)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [API Endpoints](#api-endpoints)

## Features

- User authentication and authorization
- Retrieve orders
- Create orders
- Update orders
- Cancel orders
- Confirm orders
- Mark orders as delivered
- Unit tests for event manager and order handler
- Event Sourcing
- CQRS

## Technologies Used

- Node.js
- Express
- MongoDB
- Mongoose
- Jest
- JSON Web Tokens (JWT)
- bcrypt

## Setup and Installation

1. Clone or download the repository.

2. Install dependencies:

    ```bash
    npm install
    ```

4. Download and set up MongoDB if you haven't

## Running the Application

1. Start the application:

    ```bash
    npm start
    ```

    The application will be running on `http://localhost:3030`.

## Testing

1. Run unit tests:

    ```bash
    npm test
    ```

## API Endpoints

### Authentication

- `POST /users/register`: Register a new user
- `POST /users/login`: Login a user

### Orders

- `GET /orders/find-by-user-id`: Find all orders by userId
- `GET /orders/:id`: Find an order by orderId
- `POST /orders/`: Create a new order
- `POST /orders/pay-order/:id`: Pay an order
- `POST /orders/confirm-order/:id`: Confirm an order
- `POST /orders/deliver-order/:id`: Mark an order as delivered
- `POST /orders/cancel-order/:id`: Cancel an order if the order status is 'Pending' or 'Waiting for confirmation'

### Example Requests

**Register User**

```bash
POST http://localhost:3030/users/register
-header "Content-Type: application/json"
-body '{
  "email": "anemail@something.com",
  "username": "user1",
  "password": "password123"
}'
```

**Login User**

```bash
POST http://localhost:3030/users/login
-header "Content-Type: application/json"
-body '{
  "email": "anemail@something.com",
  "username": "user1",
  "password": "password123"
}'
```

**Create an order** 

```bash
POST http://localhost:3030/orders/
-header "Content-Type: application/json"
-header "X-Authorization: JWT token from login/register"
-body '{
    "userId": "the user id from login/register",
    "items": [
        {
            "id": "3",
            "name": "Monitor",
            "price": 500,
            "quantity": 3
        }
    ]
}'
```