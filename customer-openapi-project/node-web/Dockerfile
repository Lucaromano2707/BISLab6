# syntax=docker/dockerfile:1
FROM node:20.13.1
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . /app
EXPOSE 8083
CMD ["node", "/app/customer-service.js"]