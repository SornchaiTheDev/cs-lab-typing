# Base image
FROM node:14-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the entire project to the working directory
COPY . .

# Build the Next.js project
RUN npm run build

# Expose the port on which the Next.js application will run
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "start"]