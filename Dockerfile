# Multi-stage build for TypeScript backend
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install ALL dependencies (including dev dependencies for build)
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Build TypeScript to JavaScript (outputs to dist/)
RUN yarn build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install only production dependencies
RUN yarn install --frozen-lockfile --production

# Copy compiled JavaScript from builder
COPY --from=builder /app/dist ./dist

# Copy Firebase service account key (will be provided via volume mount)
# This is a placeholder - actual file will be mounted at runtime
RUN mkdir -p /app/dist/config

# Expose port (internal only)
EXPOSE 1337

CMD ["node", "dist/server.js"]
