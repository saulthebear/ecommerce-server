# Multi-stage build for TypeScript backend
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript to JavaScript (outputs to dist/)
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy compiled JavaScript from builder
COPY --from=builder /app/dist ./dist

# Copy Firebase service account key (will be provided via volume mount)
# This is a placeholder - actual file will be mounted at runtime
RUN mkdir -p /app/dist/config

# Expose port (internal only)
EXPOSE 1337

CMD ["node", "dist/server.js"]
