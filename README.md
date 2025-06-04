# PulseOne - Hospital Management System

PulseOne is a modern, full-stack hospital management system built with React and Node.js. It provides a comprehensive solution for managing hospital operations, including patient management, operation theatre scheduling, pharmacy management, and emergency response.

## 🌟 Features

### Frontend
- Modern, responsive UI with Material-UI components
- Dark theme with attractive color scheme
- Real-time updates and notifications
- Protected routes and authentication
- Role-based access control

### Backend
- RESTful API architecture
- Secure authentication with JWT
- MongoDB database integration
- Role-based authorization
- Real-time data synchronization

## 🏗️ Project Structure

```
PulseOne/
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── contexts/      # React context providers
│   │   ├── pages/        # Page components
│   │   ├── routes.jsx    # Application routes
│   │   └── theme.js      # Material-UI theme configuration
│   └── package.json
│
└── backend/               # Node.js backend application
    ├── src/
    │   ├── controllers/  # Route controllers
    │   ├── models/       # Database models
    │   ├── routes/       # API routes
    │   ├── middleware/   # Custom middleware
    │   └── index.js      # Application entry point
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/PulseOne.git
cd PulseOne
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Install backend dependencies:
```bash
cd ../backend
npm install
```

4. Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pulseone
JWT_SECRET=your_jwt_secret
```

### Running the Application

1. Start the backend server:
```bash
cd backend
npm start
```

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 📋 Features by Module

### Dashboard
- Overview of hospital statistics
- Real-time patient monitoring
- Quick access to all modules

### Token Management
- Patient queue management
- Token generation and tracking
- Priority-based scheduling

### Operation Theatre
- OT scheduling and management
- Surgery tracking
- Resource allocation

### Pharmacy
- Drug inventory management
- Stock tracking
- Expiry date monitoring
- Supplier management

### Emergency
- Emergency alert system
- Real-time response tracking
- Priority-based handling

## 🔒 Security Features

- JWT-based authentication
- Role-based access control
- Secure password hashing
- Protected API endpoints
- Input validation and sanitization

## 🎨 UI/UX Features

- Dark theme with modern color scheme
- Responsive design for all devices
- Intuitive navigation
- Real-time updates
- Error handling and notifications

## 🛠️ Technologies Used

### Frontend
- React
- Material-UI
- React Router
- Axios
- Context API

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Material-UI for the component library
- MongoDB for the database
- All contributors who have helped shape this project 