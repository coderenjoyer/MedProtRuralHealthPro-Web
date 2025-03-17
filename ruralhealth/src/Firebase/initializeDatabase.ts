import { ref, set } from 'firebase/database';
import { database } from './firebase.js';

const initialDatabaseStructure = {
  rhp: {
    patients: {
      // Example patient record structure
      "PAT-0001": {
        personalInfo: {
          firstName: "",
          lastName: "",
          middleName: "",
          dateOfBirth: "",
          gender: "",
          civilStatus: "",
          occupation: "",
          nationality: "",
          religion: ""
        },
        contactInfo: {
          address: {
            street: "",
            barangay: "",
            city: "",
            province: "",
            zipCode: ""
          },
          contactNumber: "",
          email: "",
          emergencyContact: {
            name: "",
            relationship: "",
            contactNumber: ""
          }
        },
        medicalInfo: {
          bloodType: "",
          height: "",
          weight: "",
          allergies: [],
          existingConditions: [],
          medications: []
        },
        registrationInfo: {
          registrationDate: "",
          registrationNumber: "",
          status: "active",
          lastVisit: "",
          nextAppointment: ""
        }
      }
    },
    metadata: {
      lastPatientId: 1,
      patientCount: 1,
      lastUpdated: new Date().toISOString()
    },
    users: {
      // User records will be stored here
    },
    userRoles: {
      'Staff-Admin': {
        permissions: ['manage_users', 'manage_patients', 'manage_inventory', 'view_reports'],
        description: 'Administrative staff with full system access'
      },
      'Doctor-Physician': {
        permissions: ['manage_patients', 'view_inventory', 'view_reports'],
        description: 'Medical doctor with patient management access'
      },
      'Staff-FrontDesk': {
        permissions: ['manage_patients', 'view_inventory'],
        description: 'Front desk staff with patient registration access'
      },
      'Specialist-Dentist': {
        permissions: ['manage_patients', 'view_inventory', 'view_reports'],
        description: 'Dental specialist with patient management access'
      }
    }
  }
};

export const initializeDatabase = async () => {
  try {
    // Create the initial database structure
    await set(ref(database), initialDatabaseStructure);
    console.log('Database structure initialized successfully!');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

// Run the initialization
initializeDatabase(); 