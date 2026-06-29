# 🚗 RentalEase – Vehicle Rental Management System

RentalEase is a full-stack Vehicle Rental Management System developed using the MERN Stack (MongoDB, Express.js, React.js, and Node.js). The application provides a seamless platform for users to browse, book, and manage vehicle rentals, while allowing administrators to efficiently manage vehicles, bookings, and users through an intuitive dashboard.

---

## 📌 Features

### 👤 User Features
- User Registration & Login (JWT Authentication)
- Browse Available Vehicles
- Search and Filter Vehicles
- View Vehicle Details
- Book Vehicles
- View Booking History
- Wishlist Functionality
- Secure Logout

### 🔑 Admin Features
- Admin Login
- Dashboard Overview
- Add New Vehicles
- Update Vehicle Details
- Delete Vehicles
- Manage Users
- View & Manage Bookings

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- Axios
- React Router DOM

### Backend
- Node.js
- Express.js
- JWT Authentication
- Multer (Image Upload)

### Database
- MongoDB Atlas
- Mongoose

---

## 📂 Project Structure

```
Vehicle Rental System
│
├── client
│   ├── src
│   ├── public
│   └── package.json
│
├── server
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── services
│   ├── uploads
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation

### Clone the Repository

```bash
git clone https://github.com/PreevanLasrado/RentalEase-Vehicle-Rental-Management-System-Project.git
```

### Navigate to the Project

```bash
cd RentalEase-Vehicle-Rental-Management-System-Project
```

### Install Client Dependencies

```bash
cd client
npm install
```

### Install Server Dependencies

```bash
cd ../server
npm install
```

---

## ▶️ Run the Application

### Start Backend

```bash
cd server
npm start
```

### Start Frontend

```bash
cd client
npm run dev
```

---

## 🔒 Environment Variables

Create a `.env` file inside the `server` folder.

```
PORT=5000
MONGO_URI=YOUR_MONGODB_CONNECTION_STRING
JWT_SECRET=YOUR_SECRET_KEY
```

> **Note:** Never upload your `.env` file to GitHub.

---

## 🚀 Future Enhancements

- Online Payment Gateway
- Email Notifications
- Live Vehicle Availability
- GPS Vehicle Tracking
- Ratings & Reviews
- Mobile Responsive Improvements
- Dark Mode
- Multi-language Support

---

## 👨‍💻 Author

**Preevan Lasrado**

GitHub: https://github.com/PreevanLasrado

---

## 📜 License

This project is developed for educational and learning purposes.
