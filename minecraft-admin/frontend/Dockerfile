FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY tsconfig.json ./
COPY tsconfig.app.json ./
COPY tsconfig.node.json ./
COPY vite.config.ts ./


CMD ["npm", "run", "dev"]
