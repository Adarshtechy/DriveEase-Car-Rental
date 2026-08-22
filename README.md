# 🚗 DriveEase — Car Rental Platform

DriveEase is a full-stack car rental platform that allows customers to browse available cars, view detailed vehicle information, make bookings, and manage their rental activity through a personalized dashboard.

The platform also includes a dedicated admin dashboard for managing cars, customers, bookings, payments, and other rental operations.

Built with the **MERN stack**, DriveEase focuses on a clean user experience, secure authentication, responsive design, and a structured full-stack architecture.

---

## ✨ Features

### 👤 Customer Features

* User registration and login
* Secure password hashing
* JWT-based authentication
* Protected customer routes
* Customer dashboard
* Profile management
* Change password
* Browse available cars
* Search and filter cars
* View detailed car information
* Select pickup and return locations
* Select rental dates and times
* Online car booking
* Driving license validation
* Booking details
* Booking history
* Payment history
* Razorpay payment integration
* Responsive interface for desktop, tablet, and mobile

### 🛠️ Admin Features

* Admin authentication and authorization
* Admin dashboard
* Dashboard statistics
* Car management
* Add new cars
* Edit car information
* Delete cars
* Customer management
* Booking management
* Payment management
* View rental information
* Protected admin routes

### 💳 Payment

DriveEase integrates **Razorpay** for online payments.

The payment flow supports:

* Creating payment orders
* Processing payments
* Payment verification
* Linking payments with bookings
* Tracking payment status

Razorpay test credentials can be used during development without processing real transactions.

---

## 🖥️ Screenshots

> Add your project screenshots here after uploading them to the repository.

### Home Page

![DriveEase Home](./screenshots/home.png)

### Cars Page

![DriveEase Cars](./screenshots/cars.png)

### Car Details

![DriveEase Car Details](./screenshots/car-details.png)

### Customer Dashboard

![DriveEase Dashboard](./screenshots/dashboard.png)

### Admin Dashboard

![DriveEase Admin Dashboard](./screenshots/admin-dashboard.png)

### Booking & Payment

![DriveEase Booking](./screenshots/booking.png)

---

## 🧰 Tech Stack

### Frontend

| Technology   | Purpose                    |
| ------------ | -------------------------- |
| React.js     | Frontend development       |
| Vite         | Development and build tool |
| React Router | Client-side routing        |
| Axios        | API communication          |
| React Icons  | UI icons                   |
| CSS3         | Responsive styling         |

### Backend

| Technology | Purpose                 |
| ---------- | ----------------------- |
| Node.js    | Runtime environment     |
| Express.js | Backend framework       |
| MongoDB    | Database                |
| Mongoose   | MongoDB object modeling |
| JWT        | Authentication          |
| bcrypt     | Password hashing        |
| Nodemailer | Email functionality     |
| Razorpay   | Payment processing      |

---

## 🏗️ Project Architecture

```text
DriveEase-Car-Rental/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   └── package.json
│
├── screenshots/
│
├── .env.example
├── .gitignore
└── README.md
```

---

## 🔐 Authentication & Authorization

DriveEase uses JWT-based authentication to protect private resources.

The authentication system supports:

* User registration
* User login
* Password hashing using bcrypt
* JWT token generation
* Protected customer routes
* Protected admin routes
* Role-based authorization

Two user roles are supported:

```text
customer
admin
```

Customers can access their own dashboard and booking information, while administrators can access the administrative management system.

---

## 🚘 Car Rental Workflow

The main rental workflow is:

```text
Browse Cars
     ↓
Search / Filter
     ↓
View Car Details
     ↓
Select Rental Dates
     ↓
Enter Customer Details
     ↓
Validate Driving License
     ↓
Create Booking
     ↓
Make Payment
     ↓
Payment Verification
     ↓
Booking Confirmation
```

---

## 💳 Payment Workflow

The Razorpay payment process follows:

```text
Customer
   ↓
Select Car
   ↓
Create Booking
   ↓
Create Razorpay Order
   ↓
Open Razorpay Checkout
   ↓
Complete Payment
   ↓
Verify Payment
   ↓
Update Booking
   ↓
Payment Confirmation
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/DriveEase-Car-Rental.git
```

Navigate into the project:

```bash
cd DriveEase-Car-Rental
```

---

## 📦 Backend Setup

Navigate to the backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
PORT=8080

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

Start the backend:

```bash
npm run dev
```

Or, if your backend does not use a development script:

```bash
node server.js
```

The backend should run at:

```text
http://localhost:8080
```

---

## 🎨 Frontend Setup

Open another terminal and navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

---

## 🔑 Environment Variables

Never commit your real `.env` file to GitHub.

Create a `.env.example` file containing only the required variable names:

```env
PORT=8080

MONGO_URI=

JWT_SECRET=

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
```

Then create your own `.env` file locally and add the actual credentials.

---

## 🗄️ Database

DriveEase uses **MongoDB** with **Mongoose**.

The backend uses MongoDB to manage application data such as:

* Users
* Profiles
* Cars
* Bookings
* Payments

MongoDB Atlas can be used as the cloud database during development and deployment.

---

## 📁 Backend Structure

The backend follows a controller-route-model architecture.

```text
backend/
│
├── config/
│   └── database configuration
│
├── controllers/
│   ├── authController.js
│   ├── profileController.js
│   ├── bookingController.js
│   ├── paymentController.js
│   ├── carController.js
│   └── admin controllers
│
├── middleware/
│   ├── authentication
│   └── authorization
│
├── models/
│   ├── User
│   ├── Profile
│   ├── Car
│   ├── Booking
│   └── Payment
│
├── routes/
│   ├── authRoutes.js
│   ├── profileRoutes.js
│   ├── bookingRoutes.js
│   ├── paymentRoutes.js
│   └── adminRoutes.js
│
└── server.js
```

---

## 🛡️ Security

DriveEase implements several security practices:

* Password hashing with bcrypt
* JWT authentication
* Protected API routes
* Role-based authorization
* Environment variables for sensitive credentials
* Server-side validation
* Ownership checks for user-specific resources
* Razorpay payment verification

Sensitive credentials such as MongoDB passwords, JWT secrets, and Razorpay secret keys are excluded from the repository.

---

## 📱 Responsive Design

DriveEase is designed to work across different screen sizes.

Supported layouts include:

* 💻 Desktop
* 💻 Laptop
* 📱 Tablet
* 📱 Mobile

The interface uses responsive CSS and adaptive layouts to provide a consistent experience across devices.

---

## 🧪 Testing

During development, the application can be tested using:

* Local MongoDB / MongoDB Atlas
* Razorpay test mode
* Razorpay test cards
* Postman
* Browser developer tools

No real payment credentials should be used during development or testing.

---

## 🚀 Future Improvements

Planned improvements include:

* Real-time car availability
* Advanced booking calendar
* Automated booking emails
* SMS notifications
* Coupon and discount system
* Invoice generation
* Improved payment reconciliation
* Rental history analytics
* Advanced admin reports
* Cloud image storage
* Production deployment
* Automated testing
* CI/CD pipeline

---

## 📌 Project Highlights

DriveEase demonstrates practical experience with:

* Full-stack MERN development
* REST API development
* React component architecture
* Authentication and authorization
* MongoDB database design
* CRUD operations
* Protected routes
* Role-based access control
* Payment gateway integration
* Form validation
* Responsive UI development
* Admin dashboard development
* Client-server communication

---

## 👨‍💻 Author

**Adarsh**

B.Tech – Computer Science & Engineering (AI & ML)


⭐ If you found this project useful, consider giving the repository a star!
