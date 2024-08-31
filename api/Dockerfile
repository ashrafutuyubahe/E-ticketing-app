# Stage 1: Building the code
FROM node:21-alpine as builder

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./


# Install npm dependencies
RUN npm install

# Copy the rest of your application's source code
COPY . .

# Compile TypeScript to JavaScript
RUN npm run build

# Stage 2: Run the built code with only production dependencies
FROM node:21-alpine

WORKDIR /usr/src/app

# Copy built artifacts from the builder stage
COPY --from=builder /usr/src/app/dist ./dist

# Copy package.json (to run the application) and any other necessary files
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

ENV NODE_ENV=production

# Command to run your app
CMD ["node", "dist/app.js"]