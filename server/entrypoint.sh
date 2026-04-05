#!/bin/sh

# Ngừng script nếu có lỗi
set -e

echo "⏳ Đang đợi Database sẵn sàng..."

# Đợi cho đến khi Postgres có thể kết nối được
# Biến môi trường này được lấy từ docker-compose.yml
until nc -z postgres 5432; do
  echo "Postgres chưa sẵn sàng - đang đợi..."
  sleep 2
done

echo "✅ Database đã sẵn sàng!"

# Cập nhật DB schema (hoặc chạy migrate)
echo "🚀 Đang cập nhật DB Schema..."
npx prisma db push

# Chạy Seeding dữ liệu bằng file .js đã build trong dist
echo "🌱 Đang đổ dữ liệu (Seeding) từ bản build (.js)..."
npm run prisma:seed:prod || echo "⚠️ Seeding có thể đã tồn tại, hoặc lỗi nhẹ, bỏ qua..."

echo "🚀 Khởi chạy ứng dụng..."
exec "$@"
