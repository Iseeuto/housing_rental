# House Rental API

A basic API for managing house rentals.

## Installation

1. Clone the repository:
   git clone <your-repo-url>
   cd house-rental-api

2. Install dependencies:
   npm install

## Configuration

Create a `.env` file at the root of the project.

Add the following variable inside:

DATABASE_URL="your_mongodb_connection_string"

Replace the value with the MongoDB database URL you want to use.

## Database Setup (Prisma)

After setting up the `.env` file, run:

npx prisma db push
npx prisma generate

These commands will:

- Sync your database with the Prisma schema
- Generate the Prisma client

## Running the Server

Start the server with:
node .

The server will run by default on:
http://localhost:3000

## Documentation

The API documentation is available at:
http://localhost:3000/api-docs
