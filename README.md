# Clover Counts

Streamlined inventory tracking that's open source and built for real-world users.

## Overview

Clover Counts is a web-based inventory management system designed for restaurants and cafeterias. It focuses on organized product lists, room-based counts, and held-value tracking. The system is responsive across devices and cloud-native for easy deployment.

## Features

- **Custom Products:** Define, assign units (by count, weight, case), and set per-unit values.
- **Room-Based Lists:** Map products to physical locations, enabling accurate walk-through counts.
- **Counting Workflow:** Generate, perform, and finalize inventory sessions.
- **User Roles:** Admin, Manager, and User with appropriate permissions.
- **Authentication Options:** Basic Auth with future SSO support.
- **Modern UI:** Clean design following MCL Homemade theming.
- **Simple Deployment:** All-in-one Docker Compose stack.

## Tech Stack

- **Frontend:** React, TypeScript, Material-UI
- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** JWT with role-based access control
- **Deployment:** Docker & Docker Compose

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [Docker](https://www.docker.com/) and Docker Compose
- [Git](https://git-scm.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/clover-counts.git
   cd clover-counts
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file to configure your environment.

3. Start the application using Docker Compose:
   ```bash
   docker-compose up -d
   ```

4. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080
   - Database: PostgreSQL on port 5555

### Development Setup

If you want to run the application in development mode:

1. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Set up the database:
   ```bash
   cd backend
   npx prisma migrate dev
   npx prisma db seed
   ```

4. Start the frontend development server:
   ```bash
   cd frontend
   npm start
   ```

5. Start the backend development server:
   ```bash
   cd backend
   npm run dev
   ```

## Default Users

After seeding the database, the following users are available:

| Username | Password | Role    |
|----------|----------|---------|
| admin    | admin    | Admin   |
| manager  | manager  | Manager |
| user     | user     | User    |

## License

This project is licensed under the MIT License - see the LICENSE file for details.
