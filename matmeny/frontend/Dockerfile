FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./
COPY vite.config.ts ./
COPY . .
RUN npm install --production=false
RUN npm run build

# -- Production image --
FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist ./dist

EXPOSE 3100

CMD ["serve", "-s", "dist", "-l", "3100"]

