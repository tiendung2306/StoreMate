#!/bin/sh

# Đợi MySQL sẵn sàng
/app/backend/wait-for-it.sh mysql:3306 --timeout=60 --strict -- echo "MySQL is up!"

# Chạy migration và generate client
npx prisma migrate dev
npx prisma generate

# Khởi động ứng dụng
exec npm run start:dev