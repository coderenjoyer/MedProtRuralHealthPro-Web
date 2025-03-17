import { ref, get, set, update } from 'firebase/database';
import { database } from './firebase.js';
import { PatientData } from './types/patient.js';

export const addPatient = async (patientData: PatientData): Promise<{ success: boolean; message: string; patientId?: string }> => {
  try {
    // Get current metadata
    const metadataRef = ref(database, 'rhp/metadata');
    const metadataSnapshot = await get(metadataRef);
    const metadata = metadataSnapshot.val() || { lastPatientId: 0, patientCount: 0 };

    // Generate new patient ID
    const newPatientId = metadata.lastPatientId + 1;
    const formattedPatientId = `PAT-${String(newPatientId).padStart(4, '0')}`;

    // Create new patient object with registration info
    const newPatient = {
      ...patientData,
      registrationInfo: {
        ...patientData.registrationInfo,
        registrationDate: new Date().toISOString(),
        registrationNumber: formattedPatientId,
        status: 'active'
      }
    };

    // Add patient to database
    await set(ref(database, `rhp/patients/${formattedPatientId}`), newPatient);

    // Update metadata
    await update(metadataRef, {
      lastPatientId: newPatientId,
      patientCount: metadata.patientCount + 1,
      lastUpdated: new Date().toISOString()
    });

    return {
      success: true,
      message: 'Patient added successfully',
      patientId: formattedPatientId
    };
  } catch (error) {
    console.error('Error adding patient:', error);
    return {
      success: false,
      message: 'Failed to add patient'
    };
  }
};

export const getPatient = async (patientId: string): Promise<{ success: boolean; data?: PatientData; message: string }> => {
  try {
    const patientRef = ref(database, `rhp/patients/${patientId}`);
    const snapshot = await get(patientRef);
    
    if (snapshot.exists()) {
      return {
        success: true,
        data: snapshot.val(),
        message: 'Patient retrieved successfully'
      };
    } else {
      return {
        success: false,
        message: 'Patient not found'
      };
    }
  } catch (error) {
    console.error('Error getting patient:', error);
    return {
      success: false,
      message: 'Failed to retrieve patient'
    };
  }
};

export const updatePatient = async (patientId: string, patientData: Partial<PatientData>): Promise<{ success: boolean; message: string }> => {
  try {
    const patientRef = ref(database, `rhp/patients/${patientId}`);
    const snapshot = await get(patientRef);
    
    if (!snapshot.exists()) {
      return {
        success: false,
        message: 'Patient not found'
      };
    }

    // Update patient data
    await update(patientRef, {
      ...patientData,
      registrationInfo: {
        ...patientData.registrationInfo,
        lastUpdated: new Date().toISOString()
      }
    });

    return {
      success: true,
      message: 'Patient updated successfully'
    };
  } catch (error) {
    console.error('Error updating patient:', error);
    return {
      success: false,
      message: 'Failed to update patient'
    };
  }
};

export const getAllPatients = async (): Promise<{ success: boolean; data?: Record<string, PatientData>; message: string }> => {
  try {
    const patientsRef = ref(database, 'rhp/patients');
    const snapshot = await get(patientsRef);
    
    if (snapshot.exists()) {
      return {
        success: true,
        data: snapshot.val(),
        message: 'Patients retrieved successfully'
      };
    } else {
      return {
        success: true,
        data: {},
        message: 'No patients found'
      };
    }
  } catch (error) {
    console.error('Error getting all patients:', error);
    return {
      success: false,
      message: 'Failed to retrieve patients'
    };
  }
}; 