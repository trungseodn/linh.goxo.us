# BẢN QUY TẮC BẢO TOÀN DỮ LIỆU & QUY TRÌNH TRIỂN KHAI HỆ THỐNG VPS
**Dự án**: T2 Goxo Reels & Image Automation (`t2.goxo.us`)  
**Ngày thiết lập**: 22/10/2026  
**Trạng thái**: Có hiệu lực bắt buộc cho toàn bộ chu trình phát triển & bảo trì  

---

## 1. TÔN CHỈ BẤT BIẾN (CORE SAFETY PRINCIPLES)

1. **BẢO TOÀN DỮ LIỆU SỐNG (ZERO DATA LOSS)**:
   * Toàn bộ dữ liệu đang vận hành trên VPS (tài khoản Facebook, cấu hình 31 Fanpage, bài viết, template, lịch sử crawl, video/image render) là tài sản tối quan trọng.
   * **Tuyệt đối không thực hiện bất kỳ thao tác nào gây xóa, reset, hoặc ghi đè mất mát dữ liệu trên VPS nếu chưa có sự ĐỒNG Ý RÕ RÀNG từ người dùng.**

2. **QUẢN LÝ MÃ NGUỒN PHÂN TÁCH HOÀN TOÀN**:
   * **Upstream (Gốc)**: `https://github.com/devzota/fb-bm-reel` $\rightarrow$ **CHỈ ĐỌC (READ-ONLY)**. Tuyệt đối không bao giờ push code lên repository này.
   * **Origin (Phát triển chính)**: `https://github.com/trungseodn/t2goxo` $\rightarrow$ Toàn bộ code phát triển, tính năng mới và deploy đều đi qua repo này.

3. **CƠ CHẾ PHÊ DUYỆT (EXPLICIT APPROVAL)**:
   * Mọi can thiệp vào VPS (pull code mới, đổi remote git, chạy migration, rebuild container, sửa cấu hình) đều phải được trình bày trước rõ ràng và CHỈ thực hiện sau khi người dùng gửi yêu cầu hoặc đồng ý.

---

## 2. HIỆN TRẠNG HỆ THỐNG VPS (SNAPSHOT ĐÃ XÁC MINH 22/10/2026)

* **Địa chỉ VPS**: `169.58.210.160` (Domain: `t2.goxo.us`)
* **Lệnh SSH chuẩn xác**:
  ```powershell
  C:\Windows\System32\OpenSSH\ssh.exe -i "C:\Users\OS\.ssh\vps2_t2_t3_may2_key" -o StrictHostKeyChecking=no root@169.58.210.160
  ```
* **Đường dẫn thư mục dự án trên VPS**: `/root/ztreel-app`
* **Docker Compose file áp dụng**: `docker-compose.t2.yml`
* **Các container đang hoạt động**:
  * `ztreel_api_prod` (API NestJS - Port nội bộ 3000)
  * `ztreel_web_prod` (Frontend React - Port nội bộ 8080)
  * `ztreel_postgres_prod` (PostgreSQL 15 - Port 5432)
  * `ztreel_redis_prod` (Redis 7 - Port 6379)
* **Docker Volumes chứa dữ liệu thật (BẮT BUỘC BẢO VỆ)**:
  * `ztreel-app_ztreel_postgres_data`: Chứa Database `ztreel` (1,798 record crawl, 1,712 ảnh bài đăng, 31 Pages, 4 FB accounts,...)
  * `ztreel-app_ztreel_storage`: Chứa file tài nguyên render, nhạc nền, audio
  * `ztreel-app_ztreel_uploads`: Chứa file upload của người dùng
  * `ztreel-app_ztreel_redis_data`: Chứa hàng đợi xử lý BullMQ

---

## 3. CÁC ĐIỀU CẤM TUYỆT ĐỐI (STRICT PROHIBITIONS)

❌ **NGHIÊM CẤM** dùng lệnh `docker compose down -v` hoặc `docker-compose down -v` (Cờ `-v` sẽ xóa sạch các Docker Volume dữ liệu!).  
❌ **NGHIÊM CẤM** dùng lệnh `npx prisma db push --force-reset` hoặc `npx prisma migrate reset` (Lệnh này sẽ xóa sạch trắng các bảng và dữ liệu trong Database!).  
❌ **NGHIÊM CẤM** tự ý xóa file `.env` hoặc `apps/api/.env` trên VPS.  
❌ **NGHIÊM CẤM** chỉnh sửa trực tiếp mã nguồn trên VPS bằng tay (tránh sai lệch code giữa Git và Server). Mọi thay đổi phải đi từ Local $\rightarrow$ Commit Git $\rightarrow$ Pull về VPS.  
❌ **NGHIÊM CẤM** push code lên repo `devzota/fb-bm-reel`.

---

## 4. QUY TRÌNH CHUẨN KHI THỰC HIỆN YÊU CẦU MỚI (SOP)

Khi người dùng gửi yêu cầu phát triển tính năng hoặc sửa lỗi, AI Assistant sẽ tuân thủ nghiêm ngặt 5 bước sau:

### Bước 1: Tiếp nhận & Phân tích tại Local
* Đọc kỹ yêu cầu của người dùng.
* Lập kế hoạch thay đổi, chỉnh sửa mã nguồn tại `d:\projects\t2.goxo.us`.
* Kiểm tra build hoặc lint tại local để đảm bảo không phát sinh lỗi cú pháp.

### Bước 2: Báo cáo giải pháp & Chờ duyệt
* Trình bày danh sách các file thay đổi, tính năng mới được bổ sung.
* Nếu có thay đổi cấu trúc bảng Database (Prisma): Nêu rõ các cột/bảng thêm mới và cam kết không ảnh hưởng đến dữ liệu cũ.
* Chờ người dùng đồng ý mới tiến hành bước tiếp theo.

### Bước 3: Tự động Sao lưu (Auto-Backup) trước khi Deploy
* Mỗi lần chuẩn bị deploy lên VPS, tự động chạy lệnh backup DB lưu vào `/root`:
  ```bash
  docker exec ztreel_postgres_prod pg_dump -U root -d ztreel > /root/backup_ztreel_$(date +%Y%m%d_%H%M%S).sql
  ```

### Bước 4: Triển khai qua SSH (Zero-Downtime Safe Deploy)
1. Đẩy code từ local lên `origin/main` (`https://github.com/trungseodn/t2goxo`).
2. SSH vào VPS `/root/ztreel-app`:
   * Kéo code mới: `git pull origin main`
   * Nếu có migration DB: `docker exec ztreel_api_prod npx prisma migrate deploy`
   * Rebuild và tái khởi động API & Web (chỉ build lại container ứng dụng, **giữ nguyên container postgres & redis**):
     ```bash
     docker compose -f docker-compose.t2.yml up -d --build api web
     ```

### Bước 5: Kiểm tra nghiệm thu (Post-Deploy Verification)
* Kiểm tra trạng thái container: `docker ps`
* Đọc log xem có lỗi khởi động: `docker logs ztreel_api_prod --tail 50`
* Kiểm tra domain: `curl -I https://t2.goxo.us`
* Báo cáo kết quả chi tiết cho người dùng.

---

## 5. KỊCH BẢN KHÔI PHỤC SỰ CỐ (ROLLBACK PLAN)

Nếu sau khi deploy phát sinh lỗi ngoài ý muốn:
1. **Rollback mã nguồn**: Chạy `git checkout <commit_id_cũ>` trên VPS và rebuild lại container trong vòng 30 giây.
2. **Khôi phục dữ liệu**: Sử dụng file dump vừa tạo ở Bước 3 để phục hồi nguyên trạng:
   ```bash
   cat /root/backup_ztreel_<timestamp>.sql | docker exec -i ztreel_postgres_prod psql -U root -d ztreel
   ```
