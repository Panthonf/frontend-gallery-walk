FROM node:18-alpine

# Create the working directory
WORKDIR /app

# Copy package.json and install dependencies first
COPY package*.json ./
RUN npm install

# Copy the rest of the project files
COPY . .

# Expose port for your application
EXPOSE 3000

# Start your application with the desired command
CMD [ "npm", "run", "dev" ]
