# 1) Dépendances de production et client Prisma
FROM node:22-bookworm-slim AS deps
RUN apt-get update && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY prisma ./prisma
RUN npx prisma generate

# 2) Image finale
FROM node:22-bookworm-slim AS run
RUN apt-get update && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma
COPY package*.json ./
COPY src ./src
USER node
EXPOSE 4000
CMD ["sh", "-c", "npx prisma migrate deploy && node src/server.js"]
