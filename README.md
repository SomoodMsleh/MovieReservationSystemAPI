# Movie Reservation System API Design

## Models

### User Model
- `_id`: ObjectId (MongoDB's default ID)
- `username`: String (required, unique)
- `email`: String (required, unique)
- `password`: String (required, hashed)
- `firstName`: String
- `lastName`: String
- `phoneNumber`: String
- `role`: String (enum: ["user", "admin", "superAdmin"], default: "user")
- `gender`: String (enum: ["male", "female"])
- `isEmailConfirmed`:Boolean (default: false for user until Confirm email)
- `isActive`: Boolean (default: true for users, requires activation for admins)
- `lastLogin:`: Date
- `resetPasswordToken`: String,
- `resetPasswordExpiresAt`: Date,
- `verificationCode`: String,
- `verificationCodeExpiresAt`: Date,
- `createdAt`: Date
- `updatedAt`: Date



## API Endpoints

### Authentication Endpoints
- `POST /auth/register` - Register a new user
- `POST /auth//verifyEmail` - verify Email (req code)
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `post /auth/forgotPassword` -if user forget password
- `post /auth/resetPassword/:token` - user reset new password
- `put /auth/profile` -Update user profile
- `get /auth/profile` -Get user profile


### Admin Management Endpoints (SuperAdmin only)
- `GET /admin/` - Get all admins
- `GET /admin/:id` - Get specific admin
- `PUT /admin/:id` - Update user roles 
- `PUT /admin/:id/status` - Toggle admin active status
- `PUT /admin/:id/password` - Force Reset Admin Password
- `DELETE /admin/:id` - Delete admin


### User Management Endpoints (Admin & SuperAdmin)
- `GET /user` - Get all users
- `GET /user/:id` - Get specific user
- `PUT /user/:id/status` - Toggle user active status
- `DELETE user/:id` - Delete user
- `PUT /user/changePassword` - Change user password



