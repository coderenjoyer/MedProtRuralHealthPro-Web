import { ref, set } from 'firebase/database';
import { database } from './firebase';

const initialStructure = {
  'users': {
    // This will be populated by user input
  },
  'userRoles': {
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
  },
  'metadata': {
    'lastUserId': 0,
    'userCount': 0,
    'lastUpdated': new Date().toISOString()
  }
};

export const setupUserDatabase = async () => {
  try {
    // Create the initial database structure
    await set(ref(database, 'rhp'), initialStructure);
    console.log('User database structure created successfully!');
  } catch (error) {
    console.error('Error setting up user database:', error);
  }
};

// Run the setup
setupUserDatabase(); 