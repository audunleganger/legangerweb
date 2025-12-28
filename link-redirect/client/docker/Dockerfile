FROM node:latest
WORKDIR /app
COPY package*.json ./
RUN npm install
ENV CHOKIDAR_USEPOLLING=true
CMD ["npm", "run", "dev"]