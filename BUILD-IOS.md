# Build và nạp app lên iPhone

Từ code hiện tại bạn có thể tạo file cài đặt (IPA) để nạp lên iPhone theo một trong hai cách dưới đây.

---

## Lần đầu: Cấu hình credentials iOS (bắt buộc một lần)

Build iOS **internal** cần certificate và provisioning profile của Apple. EAS sẽ hướng dẫn tạo khi bạn chạy build **trong terminal** (chế độ interactive):

```bash
cd meeting_app
npm run build:ios
```

- Nếu hỏi **"iOS app only uses standard/exempt encryption?"** → gõ **Y**.
- Khi hỏi **thiết lập credentials** hoặc **đăng nhập Apple** → dùng **Apple ID** (tài khoản Developer) và làm theo hướng dẫn. EAS sẽ tạo certificate/provisioning profile và lưu trên server.
- Sau lần đầu xong, các lần sau có thể chạy `npm run build:ios` bình thường (hoặc dùng CI với credentials đã có).

---

## Cách 1: EAS Build (khuyến nghị – không cần Mac)

Dùng Expo Application Services (EAS) để build trên cloud, sau đó tải file IPA hoặc cài qua link.

### Bước 1: Cài EAS CLI và đăng nhập

```bash
npm install -g eas-cli
eas login
```

(Tạo tài khoản Expo tại https://expo.dev nếu chưa có.)

### Bước 2: Cấu hình dự án cho EAS (lần đầu)

Trong thư mục `meeting_app`:

```bash
cd meeting_app
eas build:configure
```

Chọn **All** (iOS + Android) nếu cần, hoặc chỉ iOS.

### Bước 3: Build bản iOS (file để nạp lên iPhone)

```bash
eas build --platform ios --profile preview
```

- **preview**: bản internal, cài trực tiếp lên máy (qua link EAS), không cần App Store.
- **production**: bản để đưa lên App Store / TestFlight.

Build chạy trên server. Khi xong, EAS sẽ cho:
- Link tải file **IPA**
- Hoặc **QR code / link cài trực tiếp** lên iPhone (với distribution internal).

### Bước 4: Nạp app lên iPhone

**A. Cài qua link (internal distribution)**  
- Mở email/link EAS gửi sau khi build xong.  
- Mở link trên **iPhone** (Safari).  
- Nhấn **Install** và làm theo hướng dẫn (có thể cần “Trust” trong Cài đặt > Cài đặt chung > Quản lý thiết bị / VPN & Quản lý thiết bị).

**B. Cài bằng file IPA**  
- Tải file **.ipa** từ trang build EAS.  
- Cài lên iPhone bằng một trong các cách:
  - **Apple Configurator 2** (Mac): kết nối iPhone, kéo thả file IPA vào thiết bị.
  - **Xcode** (Mac): Window > Devices and Simulators, chọn iPhone > kéo IPA vào phần Installed Apps (hoặc dùng **xcrun devicectl**).
  - **Cydia Impactor** / **AltStore** (cách khác, tùy phiên bản iOS).

---

## Cách 2: Build trên Mac bằng Xcode

Nếu bạn có Mac và đã cài Xcode:

```bash
cd meeting_app
npx expo run:ios --device
```

Chọn iPhone đã kết nối USB. Xcode sẽ build và **nạp trực tiếp** app lên iPhone (không tạo file IPA tách ra để cất trữ, nhưng app sẽ có trên máy).

---

## Profile build trong dự án

Trong `eas.json` đã có:

| Profile     | Mục đích                          |
|------------|------------------------------------|
| `preview`  | Bản internal, cài trực tiếp lên iPhone (link/IPA). |
| `production` | Bản đưa lên App Store / TestFlight. |

Lệnh tạo **file để nạp lên iPhone** (internal):

```bash
eas build --platform ios --profile preview
```

Sau khi build xong, dùng link EAS hoặc file IPA như mục “Bước 4” ở trên để nạp vào iPhone.
