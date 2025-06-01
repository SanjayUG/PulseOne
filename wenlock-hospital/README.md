# Wenlock Hospital Management System

A centralized, real-time system for managing patient flow, token queues, OT scheduling, emergency alerts, and drug availability across Wenlock Hospital's departments.

## Features

1. **Real-Time Patient & Token Management**
   - Generate and track tokens per department
   - Priority-based token system
   - Real-time status updates

2. **Operation Theatre Scheduling & Alerts**
   - Centralized OT status board
   - Surgery scheduling system
   - Emergency protocols

3. **Pharmacy & Drug Inventory Sync**
   - Real-time drug availability tracking
   - Low stock alerts
   - Inventory management

4. **Smart Display & Public Communication System**
   - Department-wise digital displays
   - Real-time token updates
   - OT status display

5. **Privacy Controls & Access Management**
   - Role-based permissions
   - Audit trails
   - Secure access

## Tech Stack

- React with TypeScript
- Vite for build tooling
- Material-UI for components
- React Router for navigation
- Redux Toolkit for state management
- Socket.IO for real-time updates

## Getting Started

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd wenlock-hospital
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
src/
  ├── components/     # Reusable components
  ├── pages/         # Page components
  ├── types/         # TypeScript interfaces
  ├── store/         # Redux store configuration
  ├── services/      # API services
  └── utils/         # Utility functions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
