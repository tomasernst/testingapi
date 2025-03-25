FROM node:18-alpine
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the source code
COPY . .

# Expose the port used by your API
EXPOSE 3000

# Run the development server using nodemon and ts-node
CMD ["npm", "run", "dev"]
