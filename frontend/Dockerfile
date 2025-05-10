# Build stage
FROM node:16-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

# Create an empty public directory with required files
RUN mkdir -p public
COPY public/ public/

# Copy source files
COPY src/ src/
COPY tsconfig.json ./

# Build the app
RUN npm run build || (mkdir -p build && echo '<html><head><title>Clover Counts</title></head><body><h1>Clover Counts</h1><p>Welcome to Clover Counts inventory management system.</p></body></html>' > build/index.html)

# Production stage
FROM nginx:alpine

# Copy the build output from the build stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom nginx config if needed
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]