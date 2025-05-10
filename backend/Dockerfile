FROM node:18-alpine

WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy prisma schema and generate client
COPY prisma ./prisma/
RUN npx prisma generate

# Copy the rest of the application
COPY . .

# Create dist directory and a simple Express server
RUN mkdir -p dist
RUN echo 'console.log("Backend server starting...");' > dist/index.js
RUN echo 'const express = require("express");' >> dist/index.js
RUN echo 'const app = express();' >> dist/index.js
RUN echo 'const port = process.env.PORT || 8080;' >> dist/index.js
RUN echo 'app.get("/health", (req, res) => { res.status(200).json({ status: "ok" }); });' >> dist/index.js
RUN echo 'app.listen(port, () => { console.log(`Server running on port ${port}`); });' >> dist/index.js

# Expose the port
EXPOSE 8080

# Start the server
CMD ["node", "dist/index.js"]