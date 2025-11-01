## ChatApp — Fullstack (Frontend + Backend)


### Giới thiệu dự án

ChatApp là một ứng dụng trò chuyện thời gian thực được thiết kế để hỗ trợ giao tiếp 1:1 và nhóm, kèm theo các tính năng xã hội cơ bản. Mục tiêu của dự án là cung cấp một nền tảng chat nhẹ, bảo mật và dễ mở rộng để:

- Cho phép người dùng đăng nhập (email/password hoặc OAuth), quản lý danh bạ bạn bè và tạo nhóm chat.
- Hỗ trợ nhắn tin thời gian thực bằng Socket.IO (tin nhắn, trạng thái đã đọc, trạng thái online/offline).
- Cho phép upload media (ảnh, file) tới Cloudinary và hiển thị trong conversation.
- Thông báo (in-app) cho tin nhắn mới, yêu cầu kết bạn và tương tác trên bài đăng.

Đối tượng sử dụng: người dùng cuối (chat), và các nhà phát triển/QA muốn tích hợp hoặc mở rộng tính năng.

Kiến trúc tổng quan (high-level):

- Frontend: Next.js (React + TypeScript) — giao diện, auth với `next-auth`, kết nối realtime bằng `socket.io-client`.
- Backend: Express + TypeScript — REST API, auth bằng JWT, lưu dữ liệu bằng MongoDB (Mongoose), Socket.IO cho realtime.
- Media & dịch vụ phụ trợ: Cloudinary (file upload), SMTP (mail/OTP), và có thể chạy trên Docker hoặc triển khai trên dịch vụ cloud bất kỳ.

Đoạn sau đây mô tả cách chạy và cấu hình chi tiết cho cả hai phần (frontend & backend).

## Tính năng chính

Dưới đây là các tính năng chính mà ChatApp hỗ trợ hoặc được thiết kế để hỗ trợ trong mã nguồn hiện tại:

- Xác thực & phân quyền
  - Đăng nhập/đăng ký bằng email & mật khẩu
  - OAuth (Google) tích hợp qua `next-auth`
  - Phiên làm việc bằng JWT với access/refresh token và cơ chế refresh

- Hồ sơ người dùng & quản lý bạn bè
  - Hồ sơ người dùng (avatar, tên, thông tin cơ bản)
  - Gửi/nhận lời mời kết bạn, danh sách bạn bè và đề xuất bạn bè

- Trò chuyện thời gian thực
  - Tin nhắn 1:1 và nhóm bằng Socket.IO
  - Rooms/Namespace để phân tách conversation
  - Trạng thái online/offline và thời gian hoạt động
  - Typing indicators và read receipts (trạng thái đã đọc)

- Tin nhắn & tương tác
  - Hỗ trợ gửi text, emoji/reactions, file/ảnh (upload qua Cloudinary)
  - Chỉnh sửa/xóa tin nhắn, quote/reply
  - Reactions (like, emoji), mentions (@user)
  - Phân trang lịch sử tin nhắn (infinite scroll)

- Nhóm & quản lý nhóm
  - Tạo nhóm, mời thành viên, xử lý yêu cầu tham gia
  - Vai trò trong nhóm, chuyển quyền sở hữu (transfer ownership)
  - Cài đặt nhóm (tên, avatar, mô tả)

- Media, upload & chia sẻ
  - Upload ảnh/file sử dụng Cloudinary (hoặc cấu hình tương tự)
  - Xử lý hiển thị medias trong conversation và preview

- Thông báo
  - In-app notifications cho tin nhắn mới, lời mời kết bạn, tương tác bài viết
  - Cơ chế push/integration có thể thêm trong tương lai

- Bài viết & social feed (nếu có)
  - Tạo bài viết, bình luận, like và chia sẻ (các components liên quan nằm trong `src/components/posts`)

- Gọi thoại / video
  - Hỗ trợ call (thư mục `src/components/call` gợi ý tính năng gọi/khung gọi). Thực thi có thể phụ thuộc vào triển khai WebRTC/third-party.

- Bảo mật & vận hành
  - Helmet, CORS và các middleware cơ bản trên backend
  - Lưu trữ token JWT & refresh logic, cơ chế OTP cho một số flow

- Quản trị & moderation
  - Khả năng xử lý báo cáo, chặn user (có thể mở rộng tuỳ theo routes/models)

Phần lớn tính năng trên đã được phản ánh trong cấu trúc mã nguồn (thư mục `src/components`, `src/routes`, `src/lib`, ...). Một vài tính năng (ví dụ: push notifications, full video-call production-ready) có thể cần cấu hình thêm hoặc dịch vụ bên ngoài.

### Tổng quan

- Frontend: Next.js (React) nằm trong `chatapp-client/chatapp-client-main`.
- Backend: Express + TypeScript nằm trong `chatapp-server/chatapp-server-main`.

Hai phần được phát triển độc lập; frontend gọi API của backend (cấu hình URL qua biến môi trường).

## Công nghệ chính

- Frontend: Next.js, React, TypeScript, TailwindCSS, next-auth, socket.io-client
- Backend: Node + Express, TypeScript, Mongoose (MongoDB), Socket.IO

## Yêu cầu trước khi cài

- Node.js (LTS) >= 18 (Node 20 được sử dụng trong dev deps). Sử dụng nvm hoặc installer phù hợp.
- npm (đi kèm Node) hoặc yarn
- MongoDB instance (local hoặc remote)
- Các credential cho các dịch vụ ngoài nếu cần (Cloudinary, SMTP, OAuth)

## Cấu trúc thư mục (quan trọng)

- `chatapp-client/chatapp-client-main` — mã nguồn frontend (Next.js)
- `chatapp-server/chatapp-server-main` — mã nguồn backend (Express + TS)

## Biến môi trường cần thiết

Backend (đường dẫn: `chatapp-server/chatapp-server-main/src/config/env.ts`)

- PORT — cổng server (mặc định 4000)
- NODE_ENV — `development|test|production`
- DB_USERNAME — username database
- DB_PASSWORD — password database
- MAIL_AUTH_USER — SMTP username
- MAIL_AUTH_PASS — SMTP password
- PASSWORD_SALT — salt cho hashing mật khẩu
- OTP_EXPIRES_AT — thời gian sống của mã OTP (s)
- JWT_ACCESS_TOKEN_PRIVATE_KEY — private key cho access token
- JWT_REFRESH_TOKEN_PRIVATE_KEY — private key cho refresh token
- JWT_ACCESS_TOKEN_EXPIRES_IN — access token expires (ví dụ: `15m`)
- JWT_REFRESH_TOKEN_EXPIRES_IN — refresh token expires (ví dụ: `7d`)
- WEBSITE_URL — URL ứng dụng (dùng cho CORS, redirect)
- CLOUDINARY_URL, CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET — nếu dùng Cloudinary

Client (đường dẫn: `chatapp-client/chatapp-client-main/src/config/next-env.ts`)

- NEXT_PUBLIC_SERVER_URL — URL public của backend API (ví dụ: `http://localhost:4000`)
- NEXTAUTH_SECRET — bí mật cho next-auth
- GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET — nếu bật OAuth Google
- NEXT_PUBLIC_HASH_SECRET — secret dùng client-side (nếu áp dụng)
- NEXTAUTH_URL, NEXTAUTH_URL_INTERNAL, NEXT_PUBLIC_URL_INTERNAL — URL cho next-auth/SSO

Gợi ý: Tạo file `.env` (hoặc `.env.local`) trong mỗi folder (client/server) theo nhu cầu và không commit file chứa secret.

## Cài đặt & Chạy (Windows PowerShell)

1) Backend

```powershell
cd chatapp-server\chatapp-server-main
npm install
# Thiết lập file .env với các biến bên trên
npm run dev
```

`npm run dev` dùng `nodemon` (sẽ reload khi thay đổi TS). Production build:

```powershell
npm run build
npm start
```

2) Frontend

```powershell
cd chatapp-client\chatapp-client-main
npm install
# Thiết lập .env.local chứa biến NEXT_PUBLIC_SERVER_URL, NEXTAUTH_SECRET, GOOGLE_CLIENT_ID/SECRET, ...
npm run dev
```

Frontend mặc định dùng Next.js dev server (thường trên `http://localhost:3000`). Nếu frontend và backend chạy trên máy riêng, đảm bảo `NEXT_PUBLIC_SERVER_URL` trỏ đúng đến backend.

## Kiểm tra nhanh

- Backend: sau khi chạy dev, mở `http://localhost:<PORT>/ping` sẽ trả về `Hello world`.
- Frontend: truy cập `http://localhost:3000` (hoặc cổng hiển thị khi Next dev chạy).

## Scripts quan trọng (tham chiếu từ package.json)

- Frontend (`chatapp-client/.../package.json`):
  - `dev` — chạy Next dev
  - `build` — build production
  - `start` — start production
  - `lint`, `prettier` — lint/format

- Backend (`chatapp-server/.../package.json`):
  - `dev` — chạy nodemon (dev)
  - `build` — tsc compile + tsc-alias
  - `start` — chạy file build (production)

## Gợi ý phát triển & Debug

- Để debug socket: backend khởi tạo Socket.IO trong `src/lib/socket` (xem `src/index.ts` để biết server listen và initSocket).
- Nếu gặp lỗi CORS: kiểm tra `WEBSITE_URL` và cấu hình `cors` trên backend.
- Kiểm tra kỹ các biến JWT và key — nếu thiếu sẽ làm lỗi auth.
