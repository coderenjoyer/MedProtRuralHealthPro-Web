import { initializeApp } from 'firebase/app';
import { getDatabase, ref, child } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyCSrn8KCYVCKdw2xt-YNPEjg9s7bNNPsXM",
    authDomain: "rh-database-de875.firebaseapp.com",
    databaseURL: "https://rh-database-de875-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "rh-database-de875",
    storageBucket: "rh-database-de875.firebasestorage.app",
    messagingSenderId: "461020614242",
    appId: "1:461020614242:web:f88407fdfd22fba7ad8b3b"
};

const firebaseApp = initializeApp(firebaseConfig);
export const database = getDatabase(firebaseApp);

// Database references
export const rhp = child(ref(database), 'rhp');
export const patientsRef = child(rhp, 'patients');
export const metadataRef = child(rhp, 'metadata');
export const usersRef = child(rhp, 'users');
export const userRolesRef = child(rhp, 'userRoles');

export default firebaseApp;
