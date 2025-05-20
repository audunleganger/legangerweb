FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./
COPY vite.config.ts ./
RUN npm install


CMD ["npm", "run", "dev"]
