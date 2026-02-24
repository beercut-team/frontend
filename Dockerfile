FROM oven/bun:1 AS base

# --- Stage 1: Install dependencies ---
FROM base AS deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production=false

# --- Stage 2: Build ---
FROM base AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build
RUN bun install --frozen-lockfile --production

# --- Stage 3: Production ---
FROM base AS production
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

COPY --from=build /app/build ./build
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./

EXPOSE 3000

CMD ["bun", "build/index.js"]
