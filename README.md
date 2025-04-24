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
- `gender`: String (enum: ["male", "female","other"])
- `isEmailConfirmed`:Boolean (default: false for user until Confirm email)
- `isActive`: Boolean (default: true for users, requires activation for admins)
- `lastLogin:`: Date
- `resetPasswordToken`: String,
- `resetPasswordExpiresAt`: Date,
- `verificationCode`: String,
- `verificationCodeExpiresAt`: Date,
- `createdAt`: Date
- `updatedAt`: Date

### Movie Model
- `_id`: ObjectId
- `title`: String (required, unique, lowercase)
- `slug`: String (required)
- `description`: String (required)
- `duration`: Number (minutes, required)
- `posterImage`: Object (public_id && secure_url) (required)
- `releaseDate`: Date (required)
- `endDate`: Date (when the movie stops showing)
- `genres`: Array of ObjectIds (references to Genre model)
- `rating`: 
  - `average`: Number (0-10, default: 0)
  - `count`: Number (default: 0)
- `director`: String
- `cast`: Array of Strings (max length: 100 per string)
- `language`: String (default: "english")
- `isActive`: Boolean (default: true)
- `availableSeats`: Number (default: 0)
- `createdAt`: Date
- `updatedAt`: Date


### Genre Model
- `_id`: ObjectId
- `name`: String (required, unique, lowercase)
- `description`: String (max length: 300)
- `slug`: String (unique, lowercase)
- `createdAt`: Date
- `updatedAt`: Date

### Theater Model

- `_id`: ObjectId
- `name`: String (required, unique, trimmed)
- `slug`: String (lowercase, unique)
- `location`: String (required, trimmed)
- `totalSeats`: Number (required, minimum: 1)
- `seatingLayout`: Map  
  - Key: Section name or screen ID  
  - Value:  
    - `rows`: Number  
    - `cols`: Number  
    - `seatType`: String (enum: ["regular", "vip", "accessible"], default: "regular")
- `isActive`: Boolean (default: true)
- `manager`: ObjectId (reference to `User` with role `"admin"`)
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



