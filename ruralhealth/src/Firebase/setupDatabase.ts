import { ref, set } from 'firebase/database';
import { database } from './firebase';

const initialUsers = {
  'Staff-Admin': {
    password: 'admin123',
    role: 'admin',
    name: 'Admin Staff',
  },
  'Doctor-Physician': {
    password: 'doctor123',
    role: 'doctor',
    name: 'Doctor Physician',
  },
  'Staff-FrontDesk': {
    password: 'desk123',
    role: 'frontdesk',
    name: 'Front Desk Staff'
  },
  'Specialist-Dentist': {
    password: 'spec123',
    role: 'specialist',
    name: 'Dental Specialist',
  }
};

export const setupDatabase = async () => {
  try {
    await set(ref(database, 'rhp/users'), initialUsers);
    console.log('Database structure created successfully!');
  } catch (error) {
    console.error('Error setting up database:', error);
  }
};

setupDatabase(); 