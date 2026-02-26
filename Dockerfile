FROM oven/bun:1 AS base
WORKDIR /app

# --- Stage 1: Install all dependencies ---
FROM base AS deps
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# --- Stage 2: Build ---
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build

# --- Stage 3: Production dependencies only ---
FROM base AS prod-deps
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

# --- Stage 4: Production ---
FROM base AS production
ENV NODE_ENV=production
ENV PORT=3000

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/build ./build
COPY --from=build /app/package.json ./

EXPOSE 3000
CMD ["bun", "build/index.js"]
