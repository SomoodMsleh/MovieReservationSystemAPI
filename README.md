

# Movie Reservation System API Design

## Models

### User Model
- `_id`: ObjectId  
- `username`: String (required, unique, min: 3, max: 30)  
- `email`: String (required, unique, lowercase, trimmed)  
- `password`: String (required, min length: 6)  
- `firstName`: String (required)  
- `lastName`: String (required)  
- `phoneNumber`: String  
- `gender`: String (enum: ["male", "female", "other"])  
- `role`: String (enum: ["user", "admin", "superAdmin"], default: "user")  
- `profileImage`: Object  
- `isEmailConfirmed`: Boolean (default: false)  
- `isActive`: Boolean (default: true)  
- `lastLogin`: Date (default: now)  
- `resetPasswordToken`: String  
- `resetPasswordExpiresAt`: Date  
- `verificationCode`: String  
- `verificationCodeExpiresAt`: Date  
- `createdAt`: Date  
- `updatedAt`: Date  

---

### Movie Model
- `_id`: ObjectId  
- `title`: String (required, unique, lowercase, trimmed)  
- `slug`: String (required)  
- `description`: String (required, trimmed)  
- `duration`: Number (required, min: 1, in minutes)  
- `posterImage`: Object (public_id, secure_url) (required)  
- `releaseDate`: Date (required)  
- `endDate`: Date (optional)  
- `genres`: Array of ObjectIds (references `Genre`)  
- `rating`:  
  - `average`: Number (0–10, default: 0)  
  - `count`: Number (default: 0)  
- `director`: String (trimmed)  
- `cast`: Array of Strings (max 100 characters per item)  
- `language`: String (default: "english")  
- `isActive`: Boolean (default: true)  
- `createdBy`: ObjectId (reference `User`)  
- `updatedBy`: ObjectId (reference `User`)  
- `createdAt`: Date  
- `updatedAt`: Date  

---

### Genre Model
- `_id`: ObjectId  
- `name`: String (required, unique, lowercase, trimmed)  
- `description`: String (max 300, trimmed)  
- `slug`: String (unique, lowercase)  
- `createdAt`: Date  
- `updatedAt`: Date  

---

### Theater Model
- `_id`: ObjectId  
- `name`: String (required, unique, trimmed)  
- `slug`: String (required, lowercase, unique)  
- `location`: String (required, trimmed)  
- `totalSeats`: Number (required, min: 1)  
- `seatingLayout`: Object (default: {})  
- `isActive`: Boolean (default: true)  
- `manager`: ObjectId (reference `User` with role `admin`)  
- `createdBy`: ObjectId (reference `User`)  
- `updatedBy`: ObjectId (reference `User`)  
- `createdAt`: Date  
- `updatedAt`: Date  

---

### Seat Model
- `_id`: ObjectId  
- `theaterId`: ObjectId (reference `Theater`)  
- `row`: String (required, e.g., "A", "B")  
- `number`: Number (required)  
- `type`: String (enum: ["standard", "premium", "handicap"], default: "standard")  
- `price`: Number (required, min: 0)  
- `isActive`: Boolean (default: true)  
- `createdAt`: Date  
- `updatedAt`: Date  

---

## API Endpoints

### Authentication Endpoints
- `POST /auth/register` – Register a new user  
- `POST /auth/verifyEmail` – Verify email with code  
- `POST /auth/login` – Login  
- `POST /auth/logout` – Logout  
- `POST /auth/forgotPassword` – Request password reset  
- `POST /auth/resetPassword/:token` – Reset password  
- `PUT /auth/profile` – Update profile  
- `GET /auth/profile` – Get profile  

---

### Admin Management Endpoints (SuperAdmin only)
- `GET /admin` – List all admins  
- `GET /admin/:id` – Get specific admin  
- `PUT /admin/:id` – Update admin role  
- `PUT /admin/:id/status` – Toggle active status  
- `PUT /admin/:id/password` – Force reset password  
- `DELETE /admin/:id` – Delete admin  

---

### User Management Endpoints (Admin & SuperAdmin)
- `GET /user` – List all users  
- `GET /user/:id` – Get specific user  
- `PUT /user/:id/status` – Toggle user active status  
- `DELETE /user/:id` – Delete user  
- `PUT /user/changePassword` – Change password  
