# --- Build Stage ---
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./
COPY vite.config.ts ./
COPY . .
RUN npm install --production=false
RUN npm run build

# --- Production Stage ---
FROM node:18-alpine
WORKDIR /app
RUN npm install -g server
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]