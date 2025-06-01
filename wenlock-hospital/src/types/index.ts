// Types for the Hospital Management System

// Type definitions
type PatientStatus = 'waiting' | 'in-progress' | 'completed';
type PatientPriority = 'normal' | 'urgent' | 'emergency';
type OTStatus = 'available' | 'occupied' | 'maintenance';
type UserRole = 'admin' | 'doctor' | 'nurse' | 'pharmacist' | 'receptionist';

// Interface definitions
interface Doctor {
  id: string;
  name: string;
  specialization: string;
  isAvailable: boolean;
}

interface Department {
  id: string;
  name: string;
  currentToken: number;
  waitingCount: number;
  doctors: Doctor[];
}

interface Patient {
  id: string;
  name: string;
  department: Department;
  tokenNumber: number;
  status: PatientStatus;
  priority: PatientPriority;
  checkInTime: string;
}

interface OperationTheatre {
  id: string;
  name: string;
  status: OTStatus;
  currentSurgery?: {
    patientId: string;
    patientName: string;
    startTime: string;
    estimatedEndTime: string;
  };
}

interface Drug {
  id: string;
  name: string;
  quantity: number;
  minimumQuantity: number;
  lastUpdated: string;
}

interface User {
  id: string;
  name: string;
  role: UserRole;
  department: string;
}

// Export all types and interfaces
export {
  type PatientStatus,
  type PatientPriority,
  type OTStatus,
  type UserRole,
  type Doctor,
  type Department,
  type Patient,
  type OperationTheatre,
  type Drug,
  type User
}; 