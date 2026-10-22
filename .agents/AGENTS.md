## Style & UI Guidelines

1. **Consistent UI Components**: Luôn tuân thủ cách thức thiết kế các khung tab, button switch, dropdown menu giống hệt như chuẩn đã làm ở trang `site setting page` (FacebookPageSettings.tsx). Không tự ý sáng tạo layout UI mới cho các component cơ bản này.
2. **Color Palette**: Tuyệt đối sử dụng màu sắc theo cấu hình (theme/color variables) của layout hiện tại. Tuyệt đối KHÔNG sử dụng màu Hồng và Tím.

## VPS Safety & Deployment Guidelines (Bắt buộc tuân thủ)

1. **Zero-Data Loss**: Tuyệt đối KHÔNG chạy các lệnh xóa volume hoặc reset database (`docker compose down -v`, `prisma db push --force-reset`).
2. **Quyền hạn can thiệp**: Mọi thay đổi mã nguồn hoặc cấu hình trên VPS (`t2.goxo.us`) chỉ được phép thực hiện khi người dùng yêu cầu hoặc đồng ý.
3. **Quản lý Git**:
   - `upstream` (Read-only): `https://github.com/devzota/fb-bm-reel` (tuyệt đối không push).
   - `origin` (Chính): `https://github.com/trungseodn/t2goxo` (tất cả code đẩy vào đây).
4. **Quy trình chi tiết**: Xem đầy đủ tại file [DEPLOYMENT_RULES.md](file:///d:/projects/t2.goxo.us/DEPLOYMENT_RULES.md).