FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./
COPY vite.config.ts ./
COPY tsconfig.node.json ./
COPY tsconfig.app.json ./
RUN npm install
EXPOSE 3100

CMD ["npm", "run", "dev"]
