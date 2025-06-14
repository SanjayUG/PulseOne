# HospitAll System Architecture

## System Architecture Diagram

```mermaid
graph TB
    subgraph Frontend
        UI[User Interface]
        Pages[Pages]
        Components[Components]
        Context[Context Providers]
        Theme[Theme System]
    end

    subgraph Backend
        API[API Layer]
        Controllers[Controllers]
        Models[Data Models]
        Middleware[Middleware]
    end

    subgraph Database
        MongoDB[(MongoDB)]
    end

    subgraph External Systems
        Display[Display Screens]
        Notifications[Notification System]
    end

    UI --> Pages
    Pages --> Components
    Components --> Context
    Context --> Theme

    UI --> API
    API --> Controllers
    Controllers --> Models
    Models --> MongoDB
    Controllers --> Middleware

    API --> Display
    API --> Notifications
```

## Architecture Components

### Frontend
- **User Interface**: Main application interface
- **Pages**: Route-based page components
- **Components**: Reusable UI components
- **Context Providers**: State management
- **Theme System**: UI styling and theming

### Backend
- **API Layer**: RESTful API endpoints
- **Controllers**: Business logic handlers
- **Data Models**: Database schemas
- **Middleware**: Authentication and validation

### Database
- **MongoDB**: Primary data storage

### External Systems
- **Display Screens**: Hospital display integration
- **Notification System**: Real-time alerts and updates 
