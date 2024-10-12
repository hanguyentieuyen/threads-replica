# User Authentication Flow

## 1. User Login Flow

```mermaid
sequenceDiagram
    participant User
    participant System

    User->>System: Nhập email và password
    alt Đăng nhập thành công
        System-->>User: Trả về access_token và refresh_token
    else Đăng nhập thất bại
        System-->>User: Thông báo lỗi
    end
```

## 2. User Registration Flow

```mermaid
sequenceDiagram
    participant User
    participant System
    participant EmailService

    User->>System: Nhập email, password và confirm_password [/register]
    System-->>User: Xác nhận đăng kí thành công
    System->>EmailService: Connect AWS SES
    EmailService-->>User: Gửi email xác nhận với link xác thực tài khoản
    User->>System: Click vào link email [/verify-email]
    System-->>User: Tài khoản được xác thực thành công
```

## 3. Forgot Password Flow

```mermaid
sequenceDiagram
    participant User
    participant System
    participant EmailService

    User->>System: Nhập email để yêu cầu reset mật khẩu [/forgot-password]
    System-->>User: Xác nhận yêu cầu quên mật khẩu
    System->>EmailService: Connect AWS SES
    EmailService-->>User: Gửi email với link reset password
    User->>System: Click vào link để reset password [/verify-forgot-password]
    System-->User: Xác thực forgot_password token thành công
    User->>System: Nhập mật khẩu cũ, mật khẩu mới, forgot_password_token [/reset-password]
    System-->>User: Tài khoản reset password thành công
```
