import { ref, set } from 'firebase/database';
import { database } from './firebase';

const initialStructure = {
  'patients': {
    // This will be populated by patient registrations
  },
  'metadata': {
    'lastPatientId': 0,
    'patientCount': 0,
    'lastUpdated': new Date().toISOString()
  }
};

export const setupPatientDatabase = async () => {
  try {
    // Create the initial database structure
    await set(ref(database, 'rhp'), initialStructure);
    console.log('Patient database structure created successfully!');
  } catch (error) {
    console.error('Error setting up patient database:', error);
  }
};

// Run the setup
setupPatientDatabase(); 