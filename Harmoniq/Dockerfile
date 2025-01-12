# Stage 1: Build the Angular app
FROM node:20-alpine as build

# Set the working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the application source code
COPY . .

# Build the Angular app
RUN npm run build -- --configuration production

# Stage 2: Serve the app with Nginx
FROM nginx:1.25-alpine

# Copy built app to Nginx directory
COPY --from=build /app/dist/harmoniq /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
