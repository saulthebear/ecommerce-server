# Multi-stage build for TypeScript backend
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install ALL dependencies (including dev dependencies for build)
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Create dummy Firebase service account key for build
# (Real key will be mounted at runtime)
RUN mkdir -p src/config && echo '{"type":"service_account","project_id":"dummy","private_key_id":"dummy","private_key":"-----BEGIN PRIVATE KEY-----\\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDummy\\n-----END PRIVATE KEY-----\\n","client_email":"dummy@dummy.iam.gserviceaccount.com","client_id":"dummy","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://dummy"}' > src/config/serviceAccountKey.json

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
