FROM node:18-alpine

# Create the working directory
WORKDIR /app

# Copy package.json and install dependencies first
COPY package*.json ./

# Install npm dependencies, fixing the version conflict
RUN npm install --legacy-peer-deps

# Copy the rest of the project files
COPY . .

# Expose port for your application
EXPOSE 3000

# Start your application with the desired command
CMD [ "npm", "run", "dev" ]
