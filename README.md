# Block37a

Project Plan: Review Site API

Phase 1: Project Initialization

Ticket1: Create github repo

Ticket2: Initialize project directory and install dependencies

Tasks:  Create base project file structure:
        db/index.js
        /routes/comments.js, /routes/reviews.js, /routes/items.js, /routes/users.js
        app.js
        server.js
        /tests directory
        Install express, pg, jsonwebtoken, jest, and supertest

Phase 2: Database Setup

Ticket 3: Create and configure PostgreSQL database

Tasks:  Create review_site database in Postico
        Use Postico to create tables: users, items, reviews, comments

Ticket 4:  Seed the database with test data

Tasks:  Manual SQL to insert:  create users table with id, username, password
                               create items (restaurant) table with id, restaurant name, description, rating
                               create reviews table with id, user_id, item_id, rating
                               create comments table with id, user_id, review_id, review text
                               seed users table with data for 5 users
                               seed items table with data for 8 restaurants
                               seed reviews table with data for 15 reviews
                               seed comments table with data for 20 comments

Phase 3:  Core Express Setup

Ticket 5: Create and configure app.js
Ticket 6: Create server.js to start Express server

Tasks: connect to DB and start server on port 3000

Phase 4: Route Implementation

Ticket 7: Auth routes 

Tasks:
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me 🔒

Ticket 8: Items routes

Tasks:
GET /api/items
GET /api/items/:itemId
GET /api/items/:itemId/reviews

Ticket 9: Reviews routes

Tasks:
GET /api/items/:itemId/reviews/:reviewId
POST /api/items/:itemId/reviews 
GET /api/reviews/me 
PUT /api/users/:userId/reviews/:reviewId 
DELETE /api/users/:userId/reviews/:reviewId 

Ticket 10: Comments routes 

Tasks:
POST /api/items/:itemId/reviews/:reviewId/comments 
GET /api/comments/me 
PUT /api/users/:userId/comments/:commentId 
DELETE /api/users/:userId/comments/:commentId 


Phase 5: Testing
Ticket 11: Set up Jest and Supertest configuration

Ticket 12: Write tests for Auth routes

Tests:
POST /auth/register
POST /auth/login
GET /auth/me 🔒

Ticket 13: Write tests for Items routes

Tests:
GET /items
GET /items/:itemId
GET /items/:itemId/reviews

Ticket 14: Write tests for Reviews routes

Tests:
All 5 review endpoints

Ticket 15: Write tests for Comments routes

Tests:
All 4 comment endpoints


