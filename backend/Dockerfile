# syntax=docker/dockerfile:1

# -------- Base image --------
FROM node:20-alpine AS base
WORKDIR /app
ENV NODE_ENV=production

# -------- Dependencies (prod) --------
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# -------- Dependencies (dev+prod) for build --------
FROM base AS dev-deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# -------- Build --------
FROM dev-deps AS build
WORKDIR /app
COPY . .
RUN npm run build

# -------- Runtime --------
FROM base AS runtime
WORKDIR /app
ENV PORT=3000

# Copy only runtime deps and built files
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./package.json

EXPOSE 3000
CMD ["node", "dist/main.js"]
