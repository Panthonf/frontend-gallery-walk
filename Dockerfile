FROM node:18-alpine

# Ensure clean environment and prevent cache issues
RUN rm -rf node_modules package-lock.json

# Create the working directory
WORKDIR /app

# Copy package.json and other necessary files
COPY package*.json ./
COPY . .

# Install dependencies
RUN npm install

# Expose port for your application
EXPOSE 3000

# Start your application with the desired command
CMD [ "npm", "run", "dev" ]
