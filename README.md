

# Movie Reservation System API Design

[Movie Reservation System](https://roadmap.sh/projects/movie-reservation-system)

## Models

### User Model
- `_id`: ObjectId  
- `username`: String (required, unique, min: 3, max: 30)  
- `email`: String (required, unique, lowercase, trimmed)  
- `password`: String (required, min length: 6)  
- `firstName`: String (required)  
- `lastName`: String (required)  
- `dateOfBirth` : Date
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
- `posterImage`: object (public_id (String required) , secure_url (String required))
- `releaseDate`: Date (required)  
- `contentRating`:  String (enum: ['G', 'PG', 'PG-13', 'R', 'NC-17'])
- `trailerUrl`: String (required, trimmed)  
- `genres`: Array of ObjectIds (references `Genre`)   
- `cast`: Array of Strings (max 100 characters per item)  
- `language`: String (default: "english")  
- `isActive`: Boolean (default: true)  
- `createdAt`: Date  
- `updatedAt`: Date 

**Indexes:**  
- `title` (unique, case-insensitive)
- `slug` (unique)
- `releaseDate`
- `genres`
- `isActive`

---

### Genre Model
- `_id`: ObjectId  
- `name`: String (required, unique, lowercase, trimmed)  
- `description`: String (max 300, trimmed)  
- `slug`: String (unique, lowercase) 
- `createdBy`: ObjectId (reference to User model)
- `updateBy`: ObjectId (reference to User model) 
- `createdAt`: Date  
- `updatedAt`: Date  
**Indexes:**  
- `name` (unique, case-insensitive)

---

### Theater Model
- `_id`: ObjectId  
- `name`: String (required, unique, trimmed)  
- `slug`: String (required, lowercase, unique) - Auto-generated from name  
- `location`: String (required, trimmed) - General location description
- `address`:
    - city: String (trimmed)
    - street: String (trimmed)
    - zipCode: String (trimmed)
- `totalSeats`: Number (required, min: 1) - Total capacity of the theater
- `seatingLayout`:
    - rows: Number (default: 0) - Number of seat rows
    - columns: Number (default: 0) - Number of seat columns
    - configuration: Object (default: {})  - Custom seating arrangement
- `facilities`: Array of Strings - Available amenities
     (enum: ['parking', 'food_court', 'wheelchair_access', 'dolby_sound', 'imax', '3d', 'vip_lounge'])
- `isActive`: Boolean (default: true) - Theater operational status
- `manager`: ObjectId (reference `User` with role `admin`) - Theater manager
- `contactInfo` :
    - phone: String
    - email: String
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
- `seatLabel`: String — Virtual field combining row and number (e.g., "A1")
- `createdAt`: Date  
- `updatedAt`: Date  

**Indexes:**  
- `theaterId`, `row`, `number` (compound unique)

---

### Showtime Model
- `_id`: ObjectId
- `movieId`: ObjectId (reference to Movie model)
- `theaterId`: ObjectId (reference to Theater model)
- `startTime`: Date (includes date and time)
- `endTime`: Date (calculated based on movie duration)
- `price`: Number (base ticket price for this showtime)
- `isActive`: Boolean (default: true)
- `createdAt`: Date
- `updatedAt`: Date

**Indexes:**  
- `startTime`  
- `movieId`, `startTime`  
- `theaterId`, `startTime`  
- `isActive`


---

### ShowtimeSeat Model
- `_id`: ObjectId
- `showtimeId`: ObjectId (reference to Showtime model)
- `seatId`: ObjectId (reference to Seat model)
- `status`: String (enum: ["available", "reserved", "occupied", "disabled"])
- `price`: Number (could be different from base seat price due to showtime premium)
- `userId`: ObjectId (reference to User model)
- `reservedAt`: Date
- `createdAt`: Date
- `updatedAt`: Date

**Indexes:**  
- `showtimeId`, `seatId` (compound unique)

---

### Reservation Model
- `_id`: ObjectId
- `userId`: ObjectId (reference to User model)
- `showtimeId`: ObjectId (reference to Showtime model)
- `seats`: Array of ObjectIds (references to ShowtimeSeat model)
- `totalAmount`: Number
- `paymentStatus`: String (enum: ["pending", "completed", "refunded"])
- `reservationStatus`: String (enum: ["active", "cancelled", "completed"])
- `reservationDate`: Date (when the reservation was made)
- `confirmationCode`: String (unique code for the reservation)
- `createdAt`: Date
- `updatedAt`: Date

---

### Payment Model
- `_id`: ObjectId
- `reservationId`: ObjectId (reference to Reservation model)
- `userId`: ObjectId (reference to User model)
- `amount`: Number
- `paymentMethod`: String (enum: ["credit_card", "paypal", "cash"])
- `transactionId`: String
- `status`: String (enum: ["pending", "completed", "failed", "refunded"])
- `paymentDate`: Date
- `createdAt`: Date
- `updatedAt`: Date

---
---
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
- `GET /admin/stats` – Admin statistics route (totalAdmins,activeAdmins,inactiveAdmins,recentlyActiveAdmins)
- `GET /admin/:id` – Get specific admin  
- `PUT /admin/:id` – Update admin role  
- `PUT /admin/:id/status` – Toggle active status  
- `PUT /admin/:id/password` – Force reset password  
- `DELETE /admin/:id` – Delete admin  

---

### User Management Endpoints (Admin & SuperAdmin)
- `GET /user` – List all users  
- `GET /user/status` –  user statistics route (totalUsers,activeUsers,inactiveUsers,recentlyActiveUsers)
- `GET /user/:id` – Get specific user  
- `PUT /user/:id/status` – Toggle user active status  
- `DELETE /user/:id` – Delete user  
- `PUT /user/uploadProfileImage` – user add or update ProfileImage  
- `PUT /user/changePassword` – Change password  

---

### Movie Management Endpoints
- `GET /movie` - Get all movies (public)
- `GET /movie/:id` - Get movie details (public support filtering, sorting, pagination)
- `POST /movie` - Add new movie (admin & superAdmin)
- `PUT /movie/:id` - Update movie (admin & superAdmin)
- `PUT /movie/:id/status` - Toggle movie active status  (admin & superAdmin)
- `DELETE movie/:id` - Delete movie (admin & superAdmin)

---

### Genre Management Endpoints
- `GET /genre` - Get all genres (public)
- `GET /genre/details` - Get all genres (admin,superAdmin) with who created and update each genre
- `GET /genre/:id` - get genre details by id (admin & superAdmin)
- `POST /genre` - Create genre (admin & superAdmin)
- `PUT /genre/:id` - Update genre (admin & superAdmin)
- `DELETE /genre/:id` - Delete genre (admin & superAdmin)

---

### Theater Management Endpoints
- `GET /theater/` - Get all theaters (public)
- `GET /theater/:id` - Get theater details (public)
- `POST /theater/` - Add new theater (superAdmin)
- `PUT /theater/:id` - Update theater (admin(admin.id === manager._id) & superAdmin)
- `PATCH /theater/:id/status` - Toggle theatre active status (admin(admin.id === manager._id) & superAdmin)
- `DELETE /theater/:id` - Delete theater (admin(admin.id === manager._id) & superAdmin)

---

### Seat Management Endpoints
- `GET /theater/:id/seats` - Get seats for specific theater (public)
- `POST /theater/:id/seats` - Configure theater seats (admin & superAdmin)
- `PUT /theater/seats/:id` - Update seat details (admin & superAdmin)
- `PATCH /theater/seats/:id/status` - Toggle seat active status (admin(admin.id === manager._id) & superAdmin)
- `DELETE /theater/seats/:id` - Delete seat (admin & superAdmin)

---

### Showtime Management Endpoints
- `GET /showtime` - Get all showtimes (public)
- `GET /:id` - Get showtime details (public)
- `GET /showtime/date/:date` - Get showtime for specific date (public)
- `GET /movie/:id/showtime` - Get showtime for specific movie (public)
- `POST /showtime` - Create showtime (admin & superAdmin)
- `PUT /showtime/:id` - Update showtime (admin & superAdmin)
- `PATCH /showtime/:id/status` - Toggle theatre active status (admin & superAdmin)
- `DELETE /showtime/:id` - Delete showtime (admin & superAdmin)

### Seat Availability Endpoints
- `GET /showtimes/:id/seats` - Get seats for specific showtime (public)

### Reservation Management Endpoints
- `POST /reservations` - Create reservation (user)
- `GET /reservations` - Get user's reservations (user)
- `GET /reservations/:id` - Get specific reservation details (user)
- `DELETE /reservations/:id` - Cancel reservation (upcoming only, user)
- `GET /reservations` - Get all reservations (admin & superAdmin)
- `GET /reservations/:id` - Get specific reservation (admin & superAdmin)
- `PUT /reservations/:id/status` - Update reservation status (admin & superAdmin)

### Payment Endpoints
- `POST /payments` - Process payment for reservation (user)
- `GET /payments/:id` - Get payment details (user)
- `GET /payments` - Get all payments (admin & superAdmin)

### Admin Reporting Endpoints
- `GET /reservations/stats` - Get reservation statistics (admin & superAdmin)
- `GET /revenue/daily` - Get daily revenue report (admin & superAdmin)
- `GET /revenue/weekly` - Get weekly revenue report (admin & superAdmin)
- `GET /revenue/monthly` - Get monthly revenue report (admin & superAdmin)
- `GET /capacity` - Get theater capacity and utilization reports (admin & superAdmin)
