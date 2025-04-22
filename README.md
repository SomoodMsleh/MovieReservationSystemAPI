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








