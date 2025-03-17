import { ref, get, set, update } from 'firebase/database';
import { database, usersRef, userRolesRef, metadataRef } from './firebase';

interface UserData {
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  password: string;
  role: string;
  contactNumber: string;
  address: {
    street: string;
    barangay: string;
    municipality: string;
    province: string;
    zipcode: string;
  };
  personalInfo: {
    birthdate: string;
    gender: string;
    civilStatus: string;
    employmentStatus: string;
  };
}

export const addUser = async (userData: UserData) => {
  try {
    // Get current metadata
    const metadataSnapshot = await get(metadataRef);
    const metadata = metadataSnapshot.val();
    
    // Generate new user ID
    const newUserId = metadata.lastUserId + 1;
    const userId = `USER${String(newUserId).padStart(3, '0')}`;
    
    // Create new user object
    const newUser = {
      id: userId,
      ...userData,
      createdAt: new Date().toISOString(),
      lastLogin: null
    };
    
    // Update users node
    await set(ref(database, `rhp/users/${userId}`), newUser);
    
    // Update metadata
    await update(metadataRef, {
      lastUserId: newUserId,
      userCount: metadata.userCount + 1,
      lastUpdated: new Date().toISOString()
    });
    
    return { success: true, userId };
  } catch (error) {
    console.error('Error adding user:', error);
    return { success: false, error };
  }
};

export const getUser = async (userId: string) => {
  try {
    const userRef = ref(database, `rhp/users/${userId}`);
    const snapshot = await get(userRef);
    
    if (snapshot.exists()) {
      return { success: true, user: snapshot.val() };
    } else {
      return { success: false, error: 'User not found' };
    }
  } catch (error) {
    console.error('Error getting user:', error);
    return { success: false, error };
  }
};

export const updateUser = async (userId: string, userData: Partial<UserData>) => {
  try {
    const userRef = ref(database, `rhp/users/${userId}`);
    const snapshot = await get(userRef);
    
    if (snapshot.exists()) {
      await update(userRef, {
        ...userData,
        lastUpdated: new Date().toISOString()
      });
      return { success: true };
    } else {
      return { success: false, error: 'User not found' };
    }
  } catch (error) {
    console.error('Error updating user:', error);
    return { success: false, error };
  }
};

export const getAllUsers = async () => {
  try {
    const snapshot = await get(usersRef);
    
    if (snapshot.exists()) {
      return { success: true, users: snapshot.val() };
    } else {
      return { success: true, users: {} };
    }
  } catch (error) {
    console.error('Error getting all users:', error);
    return { success: false, error };
  }
};

export const getUserRoles = async () => {
  try {
    const snapshot = await get(userRolesRef);
    
    if (snapshot.exists()) {
      return { success: true, roles: snapshot.val() };
    } else {
      return { success: false, error: 'Roles not found' };
    }
  } catch (error) {
    console.error('Error getting user roles:', error);
    return { success: false, error };
  }
}; 