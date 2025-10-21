# HealthyColors Backend API

Backend API cho hệ thống quản lý sức khỏe HealthyColors, được xây dựng với Node.js, Express và SQL Server.

## 🚀 Cài đặt

### 1. Cài đặt dependencies

```bash
cd backend
npm install
```

### 2. Cấu hình môi trường

Sao chép file `.env.example` thành `.env` và cập nhật thông tin:

```bash
cp .env.example .env
```

Chỉnh sửa file `.env`:

```env
# Server Configuration
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# SQL Server Configuration
DB_SERVER=localhost
DB_DATABASE=CNPM
DB_USER=sa
DB_PASSWORD=your_password_here
DB_PORT=1433
DB_ENCRYPT=true
DB_TRUST_SERVER_CERTIFICATE=true

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
```

### 3. Khởi tạo database

Đảm bảo SQL Server đã được cài đặt và chạy. Chạy script SQL từ file `/SQL_QUICK_START.sql` để tạo database và tables.

### 4. Chạy server

**Development mode (với nodemon):**

```bash
npm run dev
```

**Production mode:**

```bash
npm start
```

Server sẽ chạy tại `http://localhost:3000`

## 📡 API Endpoints

### Authentication (`/api/auth`)

- `POST /api/auth/register` - Đăng ký tài khoản mới
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/profile` - Lấy thông tin profile (requires auth)
- `PUT /api/auth/profile` - Cập nhật profile (requires auth)
- `POST /api/auth/change-password` - Đổi mật khẩu (requires auth)

### Meals (`/api/meals`)

- `GET /api/meals/admin` - Lấy danh sách meals của admin
- `GET /api/meals/user` - Lấy danh sách meals cá nhân
- `POST /api/meals/copy/:mealId` - Copy meal từ admin về user
- `POST /api/meals` - Tạo meal mới
- `PUT /api/meals/:userMealId` - Cập nhật meal
- `DELETE /api/meals/:userMealId` - Xóa meal

### Exercises (`/api/exercises`)

- `GET /api/exercises/admin` - Lấy danh sách exercises của admin
- `GET /api/exercises/user` - Lấy danh sách exercises cá nhân
- `POST /api/exercises/copy/:exerciseId` - Copy exercise từ admin về user
- `POST /api/exercises` - Tạo exercise mới
- `PUT /api/exercises/:userExerciseId` - Cập nhật exercise
- `DELETE /api/exercises/:userExerciseId` - Xóa exercise

### User Data (`/api/user`)

- `GET /api/user/statistics` - Lấy thống kê của user
- `GET /api/user/sleep` - Lấy sleep records
- `POST /api/user/sleep` - Tạo sleep record
- `PUT /api/user/sleep/:sleepRecordId` - Cập nhật sleep record
- `DELETE /api/user/sleep/:sleepRecordId` - Xóa sleep record
- `GET /api/user/water` - Lấy water logs
- `POST /api/user/water` - Tạo water log
- `DELETE /api/user/water/:waterLogId` - Xóa water log
- `GET /api/user/activity` - Lấy activity logs
- `POST /api/user/activity` - Tạo/cập nhật activity log

### Admin (`/api/admin`)

- `GET /api/admin/statistics` - Lấy thống kê dashboard
- `GET /api/admin/users` - Lấy danh sách users
- `GET /api/admin/users/:userId` - Lấy thông tin user
- `POST /api/admin/meals` - Tạo admin meal
- `PUT /api/admin/meals/:mealId` - Cập nhật admin meal
- `DELETE /api/admin/meals/:mealId` - Xóa admin meal
- `POST /api/admin/exercises` - Tạo admin exercise
- `PUT /api/admin/exercises/:exerciseId` - Cập nhật admin exercise
- `DELETE /api/admin/exercises/:exerciseId` - Xóa admin exercise

### Feedback (`/api/feedback`)

- `POST /api/feedback` - Gửi feedback (user)
- `GET /api/feedback/my-feedback` - Lấy feedback của user
- `GET /api/feedback/all` - Lấy tất cả feedback (admin)
- `PUT /api/feedback/:feedbackId` - Cập nhật feedback (admin)
- `DELETE /api/feedback/:feedbackId` - Xóa feedback (admin)

## 🔐 Authentication

API sử dụng JWT (JSON Web Tokens) cho authentication.

### Cách sử dụng:

1. Đăng nhập qua `/api/auth/login` để nhận token
2. Thêm token vào header của các request tiếp theo:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

## 📁 Cấu trúc thư mục

```
backend/
├── config/
│   └── database.js          # Cấu hình kết nối SQL Server
├── controllers/
│   ├── authController.js    # Xử lý authentication
│   ├── mealsController.js   # Xử lý meals
│   ├── exercisesController.js
│   ├── userController.js    # Xử lý user data
│   ├── adminController.js   # Xử lý admin operations
│   └── feedbackController.js
├── middleware/
│   ├── auth.middleware.js   # JWT verification
│   └── admin.middleware.js  # Admin role check
├── routes/
│   ├── auth.routes.js
│   ├── meals.routes.js
│   ├── exercises.routes.js
│   ├── user.routes.js
│   ├── admin.routes.js
│   └── feedback.routes.js
├── .env.example
├── package.json
├── README.md
└── server.js                # Entry point
```

## 🧪 Testing

Sử dụng Postman hoặc curl để test API:

### Đăng ký user mới:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "fullName": "Test User"
  }'
```

### Đăng nhập:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

## 🛠️ Troubleshooting

### Database connection error

- Kiểm tra SQL Server đang chạy
- Verify thông tin đăng nhập trong `.env`
- Kiểm tra firewall settings
- Đảm bảo TCP/IP protocol được enable trong SQL Server Configuration Manager

### CORS error

- Kiểm tra `FRONTEND_URL` trong `.env` khớp với URL frontend
- Default: `http://localhost:5173`

### JWT errors

- Đảm bảo `JWT_SECRET` được set trong `.env`
- Check token expiration time

## 📝 Notes

- Database schema phải được tạo trước khi chạy API (sử dụng `/SQL_QUICK_START.sql`)
- Đảm bảo có ít nhất 1 user với role 'admin' trong database để test admin endpoints
- Default admin credentials có thể được thêm bằng SQL:

```sql
-- Tạo admin user (password: admin123)
INSERT INTO Users (Username, Email, PasswordHash, Role, CreatedAt)
VALUES ('admin', 'admin@healthycolors.com', 
        '$2b$10$...(hash of admin123)', 'admin', GETDATE());
```

## 🚀 Next Steps

1. Kết nối frontend với backend API
2. Implement email service cho password reset
3. Add rate limiting
4. Add request validation middleware
5. Setup logging system
6. Deploy to production server

## 📞 Support

Nếu gặp vấn đề, check:
- Server logs
- SQL Server error logs
- Network connectivity
- Environment variables

---

Made with ❤️ by HealthyColors Team
