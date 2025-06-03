# Wenlock Hospital Management System - Frontend

This is the frontend application for the Wenlock Hospital Management System, built with React and Material-UI.

## Features

- Real-time patient and token management
- Operation theatre scheduling and status tracking
- Pharmacy and drug inventory management
- Emergency alerts and response tracking
- Role-based access control
- Responsive design for all devices

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository
2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Development

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Environment Variables

Create a `.env` file in the frontend directory with the following variables:

```
VITE_API_URL=http://localhost:5000
```

## Project Structure

```
src/
  ├── components/     # Reusable components
  ├── pages/         # Page components
  ├── contexts/      # React contexts
  ├── App.jsx        # Main application component
  └── main.jsx       # Application entry point
```

## Dependencies

- React
- Material-UI
- React Router
- Axios
- Socket.IO Client
- Chart.js

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License. 