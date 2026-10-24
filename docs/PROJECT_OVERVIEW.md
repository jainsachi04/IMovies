# IMovies Project Overview

## Problem statement
Cinema customers need a convenient way to discover movies, compare showtimes and reserve seats without calling a cinema or visiting the ticket counter.

## Proposed solution
IMovies is a web application with a React client and Express REST API backed by MongoDB. Users can register/login, browse a movie catalogue, select a show and reserve seats. Administrators maintain movies and schedules.

## Main modules
1. Authentication and user profile
2. Movie catalogue and search
3. Show scheduling
4. Seat selection and availability
5. Booking history and cancellation
6. Administrator catalogue/schedule management

## Core data entities
- **User:** name, email, password hash, role
- **Movie:** title, description, genre, duration, language, rating, poster URL
- **Show:** movie, cinema, city, date, time, ticket price, seat states
- **Booking:** user, show, movie, seat numbers, total amount, status, booking code

## Architecture
Browser (React) → HTTP/JSON API (Express) → Mongoose models → MongoDB. JWT bearer tokens protect account-specific and admin operations. Seat reservation uses a conditional single-document update so that a seat already booked cannot be reserved again by a concurrent request.

## Future improvements
Integrate a payment gateway, email/SMS tickets, OTP/email verification, password reset, cinema/branch management, reviews, analytics, rate limiting, audit logs, and automated tests.
