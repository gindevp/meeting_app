# Hướng dẫn build file cài đặt app iOS từ dự án meeting_app

Dự án **meeting_app** dùng **Expo** (React Native). Để tạo file cài đặt cho iOS (.ipa), dùng **EAS Build** (Expo Application Services).

---

## 1. Yêu cầu

- **Node.js** (phiên bản LTS khuyến nghị)
- **Tài khoản Expo**: đăng ký tại [expo.dev](https://expo.dev)
- **Tài khoản Apple Developer** (trả phí, ~99 USD/năm) nếu muốn:
  - Cài lên thiết bị thật (không phải simulator)
  - Đưa lên TestFlight / App Store
- **macOS** không bắt buộc: EAS Build chạy trên cloud.

---

## 2. Cài đặt EAS CLI

Mở terminal trong thư mục dự án và chạy:

```bash
npm install -g eas-cli
```

Đăng nhập Expo:

```bash
eas login
```

Nhập email và mật khẩu tài khoản Expo.

---

## 3. Cấu hình dự án (đã có sẵn)

Trong repo đã có:

- **`app.json`**: đã cấu hình `ios.bundleIdentifier` (ví dụ: `com.meetingapp.meetviet`). Có thể đổi thành bundle ID của bạn.
- **`eas.json`**: đã có các profile build:
  - **development**: bản development client, cài nội bộ.
  - **preview**: bản internal (TestFlight / cài trực tiếp), phù hợp để test.
  - **production**: bản đưa lên App Store.

Nếu chưa chạy `eas build:configure` bao giờ, có thể chạy một lần để EAS tạo/kiểm tra cấu hình:

```bash
eas build:configure
```

Chọn **All** (iOS + Android) hoặc **iOS**, rồi chọn profile (development / preview / production). Có thể giữ nguyên `eas.json` hiện tại.

---

## 4. Build bản iOS

### 4.1. Build bản preview (internal – cài lên máy thật / TestFlight)

Dùng khi muốn file .ipa để cài trực tiếp hoặc upload TestFlight:

```bash
eas build --platform ios --profile preview
```

EAS sẽ hỏi:

- **Apple Developer Account**: đăng nhập Apple ID (tài khoản Developer).
- **Generate new credentials**: chọn **Yes** để EAS tạo Certificate + Provisioning Profile (khuyến nghị lần đầu).

Sau khi build xong, EAS đưa link tải **.ipa** trên dashboard.

### 4.2. Build bản production (App Store)

```bash
eas build --platform ios --profile production
```

File .ipa tạo ra dùng để submit lên App Store (qua EAS Submit hoặc Transporter/App Store Connect).

### 4.3. Build bản development (development client)

```bash
eas build --platform ios --profile development
```

Dùng cho dev với Expo Dev Client (debug, hot reload trên máy thật).

---

## 5. Lấy file .ipa (file cài đặt)

1. Vào [expo.dev](https://expo.dev) → đăng nhập → chọn project **meeting_app**.
2. Vào **Builds** → chọn build iOS vừa chạy.
3. Trạng thái **Finished** → có nút **Download** để tải file **.ipa**.

---

## 6. Cài lên iPhone (bản preview/internal)

- **Cách 1 – TestFlight (khuyến nghị)**  
  - Submit bản preview/production lên App Store Connect rồi cài qua app **TestFlight** trên iPhone.
- **Cách 2 – Cài trực tiếp .ipa**  
  - Dùng **Apple Configurator 2** (macOS) hoặc **AltStore** (Windows/macOS) để cài file .ipa (cần đăng ký thiết bị UDID với Apple Developer).

---

## 7. Đưa lên App Store (production)

Sau khi có bản production:

```bash
eas submit --platform ios --profile production
```

Hoặc vào **expo.dev** → project → **Submit** → chọn build iOS production và điền **Apple ID**, **App-specific password**, **Apple Team ID**, **App Store Connect App ID** (ASC App ID) khi EAS hỏi.

Có thể điền sẵn trong `eas.json` (phần `submit.production.ios`) để không phải nhập lại.

---

## 8. Lưu ý

| Mục | Ghi chú |
|-----|--------|
| **Bundle ID** | Đã đặt trong `app.json` → `expo.ios.bundleIdentifier`. Muốn đổi thì sửa tại đây và build lại. |
| **Phiên bản** | Sửa `expo.version` và (khi submit) `expo.ios.buildNumber` trong `app.json` trước khi build. |
| **Credentials** | EAS lưu credentials trên cloud. Có thể xem/quản lý: `eas credentials` trong thư mục dự án. |
| **Build trên máy Windows** | EAS Build chạy trên server của Expo, nên bạn vẫn build được iOS từ Windows. |

---

## 9. Tóm tắt lệnh thường dùng

```bash
# Cài EAS CLI (một lần)
npm install -g eas-cli
eas login

# Build iOS – bản internal / TestFlight
eas build --platform ios --profile preview

# Build iOS – bản App Store
eas build --platform ios --profile production

# Submit bản production lên App Store
eas submit --platform ios --profile production
```

Sau khi build xong, file cài đặt iOS (.ipa) nằm trên Expo dashboard, mục **Builds** của project **meeting_app**.
