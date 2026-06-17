# Stage 1: Build React Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Build Node/Express Backend
FROM node:20-alpine AS backend-builder
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci
COPY backend/ ./
RUN npm run build

# Stage 3: Final Production Runner Image
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy backend built files and modules
COPY --from=backend-builder /app/backend/package*.json ./backend/
COPY --from=backend-builder /app/backend/dist ./backend/dist
COPY --from=backend-builder /app/backend/node_modules ./backend/node_modules

# Copy compiled frontend build assets
COPY --from=frontend-builder /app/dist ./dist

EXPOSE 5000
WORKDIR /app/backend
CMD ["npm", "start"]
