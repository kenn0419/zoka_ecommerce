# --- Stage 1: Builder ---
FROM node:20-alpine AS builder

WORKDIR /app

# Cài đặt công cụ build cần thiết
RUN apk add --no-cache python3 make g++

# Copy cấu hình package và prisma
COPY package*.json ./
COPY prisma ./prisma/

# Chặn tải Chromium và tối ưu Prisma binary lúc build
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Cài toàn bộ dependencies để build
RUN npm config set fetch-retry-maxtimeout 600000 && \
    npm config set fetch-retries 5 && \
    npm ci

# Copy toàn bộ code và build
COPY . .
RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" npx prisma generate && \
    npm run build

# --- Stage 2: Runner (Production) ---
FROM node:20-alpine AS runner

WORKDIR /app

# Cài thư viện chạy runtime và netcat để check DB
RUN apk add --no-cache libstdc++ netcat-openbsd

# Copy cấu hình từ builder
COPY package*.json ./
COPY prisma ./prisma/

# Thiết lập môi trường Production
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    NODE_ENV=production

# Cài đặt sạch sẽ: Chỉ Production deps, thêm Prisma CLI, sinh client và xóa cache
RUN npm ci --only=production && \
    npm install -g prisma && \
    npx prisma generate && \
    npm cache clean --force

# Chỉ copy thư mục đã build (dist) từ builder
COPY --from=builder /app/dist ./dist

# Copy và cấu hình entrypoint
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["/entrypoint.sh"]
CMD ["node", "dist/src/main.js"]
