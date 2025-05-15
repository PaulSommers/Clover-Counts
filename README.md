# Clover Counts

Clover Counts is a PWA for restaurant/cafeteria inventory management focused on organized product lists, room-based counts, and held-value tracking. The system is built to be web-based, responsive across devices, and cloud-native for easy deployment.

## Core Features

- **Custom Products:** Define, assign units (by count, weight, case), and set per-unit values.
- **Room-Based Lists:** Map products to physical locations, enabling accurate walk-through counts.
- **Counting Workflow:** Generate, perform, and finalize inventory sessions—support mobile/tablet entry, aggregate totals across rooms.
- **User Roles:**
  - **Admin:** Full configuration and access.
  - **Manager:** Products, layouts, session management.
  - **User:** Counting only.
- **Authentication Options:**
  - OAuth2/OpenID (SSO via CMS) — preferred, configurable.
  - Basic Auth (username/password) — fallback, with hashed storage.
- **Modern UI, Reporting, PWA:** Clean, fast, and installable app for all devices.
- **Simple deployment:** All-in-one Docker Compose stack.
- **MCL-Inspired Design:** Following the theming and color conventions of MCL Homemade.

## Getting Started

### Prerequisites

- Node.js (v16+)
- Docker and Docker Compose
- PostgreSQL (if running locally without Docker)

### Installation

1. Clone the repository
   ```
   git clone https://github.com/your-username/clover-counts.git
   cd clover-counts
   ```

2. Install dependencies
   ```
   # Install frontend dependencies
   cd frontend
   npm install

   # Install backend dependencies
   cd ../backend
   npm install
   ```

3. Set up environment variables
   ```
   cp .env.example .env
   # Edit .env file with your configuration
   ```

4. Run the application with Docker Compose
   ```
   docker-compose up
   ```

5. Access the application at http://localhost:3000

## Development

### Running locally

1. Start the backend
   ```
   cd backend
   npm run dev
   ```

2. Start the frontend
   ```
   cd frontend
   npm start
   ```

## License

This project is licensed under the MIT License - see the LICENSE file for details.