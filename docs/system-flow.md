# HospitAll System Flow

## System Flow Diagram

```mermaid
graph TD
    A[User Access] --> B{Authentication}
    B -->|Valid| C[Access System]
    B -->|Invalid| D[Login Page]

    C --> E{User Role}
    E -->|Admin| F[Admin Dashboard]
    E -->|Doctor| G[Doctor Dashboard]
    E -->|Staff| H[Staff Dashboard]
    E -->|Patient| I[Patient View]

    F --> J[System Management]
    G --> K[Patient Management]
    H --> L[Queue Management]
    I --> M[View Status]

    J --> N[Manage Users]
    J --> O[Manage Inventory]
    J --> P[Manage OT]

    K --> Q[Patient Records]
    K --> R[Schedule Management]
    K --> S[Emergency Protocol]

    L --> T[Token System]
    L --> U[Queue Display]
    L --> V[Department Sync]

    M --> W[View Token]
    M --> X[View OT Status]
    M --> Y[View Inventory]

    T --> Z[Priority Queue]
    U --> AA[Real-time Updates]
    V --> AB[Cross-department Sync]
```

## Flow Components

### Authentication Flow
- User access validation
- Role-based access control
- Session management

### User Role Flows
1. **Admin Flow**
   - System management
   - User management
   - Inventory control
   - OT management

2. **Doctor Flow**
   - Patient records
   - Schedule management
   - Emergency protocols

3. **Staff Flow**
   - Queue management
   - Token system
   - Department synchronization

4. **Patient Flow**
   - Status viewing
   - Token tracking
   - OT status monitoring

### System Features
- Priority queue management
- Real-time updates
- Cross-department synchronization
- Emergency protocols
- Inventory management 