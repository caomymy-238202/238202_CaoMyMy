HỆ THỐNG QUẢN LÝ NHÂN SỰ

1. Thông tin sinh viên
- Họ và tên: 
- Mã số sinh viên (MSSV): 
- Lớp: 

2. Mô tả dự án
Xây dựng hệ thống quản lý nhân sự trên nền tảng đám mây, cho phép người dùng xem danh sách nhân viên, thêm mới, tìm kiếm, xem chi tiết, cập nhật và xóa hồ sơ nhân viên.
Dữ liệu nhân viên được lưu trữ trên MongoDB Atlas. Giao diện người dùng được xây dựng bằng React và giao tiếp với Backend thông qua REST API.

3. Công nghệ sử dụng
- Frontend: React
- Backend: Node.js, Express
- Cơ sở dữ liệu: MongoDB Atlas
- Quản lý mã nguồn: Git, GitHub
- Đóng gói ứng dụng: Docker
- Lưu trữ Docker image: Docker Hub
- Triển khai ứng dụng: Render

4. Các chức năng chính
- Hiển thị danh sách nhân viên.
- Thêm hồ sơ nhân viên mới.
- Tìm kiếm nhân viên theo mã nhân viên hoặc họ tên.
- Xem và cập nhật thông tin nhân viên.
- Xóa hồ sơ nhân viên sau khi xác nhận.
- Hiển thị thông báo khi thao tác thành công hoặc thất bại.

5. Các đường dẫn
- GitHub: 
- Docker Hub Backend: 
- Docker Hub Frontend: 
- Ứng dụng Frontend trên Render: 
- Backend API trên Render: 
- MongoDB Atlas: 

6. Hướng dẫn chạy ứng dụng trên máy cá nhân
- Backend
1. Mở terminal tại thư mục backend.
2. Cài đặt các thư viện: npm install
3. Tạo file .env dựa trên .env.example và điền thông tin kết nối MongoDB Atlas.
4. Khởi chạy Backend:
   npm start

- Frontend
1. Mở terminal tại thư mục frontend.
2. Cài đặt các thư viện: npm install
3. Khởi chạy Frontend: npm run dev

7. Cấu trúc thư mục
- backend/: Mã nguồn xử lý API và kết nối cơ sở dữ liệu.
- frontend/: Mã nguồn giao diện người dùng.
- README.md: Tài liệu giới thiệu và hướng dẫn sử dụng dự án.
- .gitignore: Danh sách các tệp và thư mục Git cần bỏ qua.
