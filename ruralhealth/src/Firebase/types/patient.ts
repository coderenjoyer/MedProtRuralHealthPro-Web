export interface Address {
  street: string;
  barangay: string;
  city: string;
  province: string;
  zipCode: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  contactNumber: string;
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  middleName: string;
  dateOfBirth: string;
  gender: string;
  civilStatus: string;
  occupation: string;
  nationality: string;
  religion: string;
}

export interface ContactInfo {
  address: Address;
  contactNumber: string;
  email: string;
  emergencyContact: EmergencyContact;
}

export interface MedicalInfo {
  bloodType: string;
  height: string;
  weight: string;
  allergies: string[];
  existingConditions: string[];
  medications: string[];
}

export interface RegistrationInfo {
  registrationDate: string;
  registrationNumber: string;
  status: 'active' | 'inactive' | 'archived';
  lastVisit: string;
  nextAppointment: string;
}

export interface PatientData {
  personalInfo: PersonalInfo;
  contactInfo: ContactInfo;
  medicalInfo: MedicalInfo;
  registrationInfo: RegistrationInfo;
} 