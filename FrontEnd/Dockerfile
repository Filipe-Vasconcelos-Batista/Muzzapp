FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy app source
COPY . .

# Expose the port you'll serve on
EXPOSE 5173

# Serve the app from the dist directory
CMD ["npm", "run", "dev"]
