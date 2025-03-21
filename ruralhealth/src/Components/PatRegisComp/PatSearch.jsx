import React, { useState, useEffect } from 'react';
import { getAllPatients } from '../../Firebase/patientOperations.js';

function PatientSearch() {
    const [patients, setPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [dataLoadError, setDataLoadError] = useState(false);

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            setLoading(true);
            setDataLoadError(false);
            setError(null);
            
            const result = await getAllPatients();
            console.log('Raw result from Firebase:', result);
            
            if (result.success) {
                if (!result.data || Object.keys(result.data).length === 0) {
                    setPatients([]);
                    setDataLoadError(true);
                    setError('No patients found in the database');
                } else {
                    try {
                        const patientsArray = Object.entries(result.data || {}).map(([id, data]) => {
                            console.log('Processing patient data:', data);
                            // Validate essential patient data exists
                            if (!data.personalInfo) {
                                console.warn(`Patient ${id} is missing personalInfo`, data);
                                return {
                                    id,
                                    personalInfo: {
                                        firstName: 'Unknown',
                                        middleName: '',
                                        lastName: 'Unknown'
                                    },
                                    dataComplete: false,
                                    ...data
                                };
                            }
                            return {
                                id,
                                dataComplete: Boolean(
                                    data.personalInfo && 
                                    data.personalInfo.firstName && 
                                    data.personalInfo.lastName
                                ),
                                ...data
                            };
                        });
                        console.log('Processed patients array:', patientsArray);
                        setPatients(patientsArray);
                    } catch (parseError) {
                        console.error('Error parsing patient data:', parseError);
                        setDataLoadError(true);
                        setError('Error processing patient data: ' + parseError.message);
                        setPatients([]);
                    }
                }
            } else {
                setDataLoadError(true);
                setError(result.error || 'Failed to fetch patients');
                setPatients([]);
            }
        } catch (err) {
            setDataLoadError(true);
            setError('Error loading patients: ' + (err.message || 'Unknown error'));
            console.error('Error fetching patients:', err);
            setPatients([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const executeSearch = () => {
        setIsSearching(true);
        // This is a client-side search, so just set the flag to show we're "searching"
        // and then reset it after a short delay to simulate a search operation
        setTimeout(() => {
            setIsSearching(false);
        }, 300);
    };

    const getFullName = (patient) => {
        try {
            console.log('Getting full name for patient:', patient);
            if (!patient.personalInfo) {
                return 'Unknown Patient';
            }
            
            const firstName = patient.personalInfo.firstName || '';
            const middleName = patient.personalInfo.middleName || '';
            const lastName = patient.personalInfo.lastName || '';
            
            return `${firstName} ${middleName} ${lastName}`.trim().replace(/\s+/g, ' ');
        } catch (error) {
            console.error('Error getting full name:', error);
            return 'Error: Unable to get name';
        }
    };

    const filteredPatients = patients.filter(patient => {
        try {
            if (!searchTerm.trim()) return true; // Show all if no search term
            
            const searchString = searchTerm.toLowerCase();
            const fullName = getFullName(patient).toLowerCase();
            const registrationNumber = (patient.registrationInfo?.registrationNumber || '').toLowerCase();
            
            return fullName.includes(searchString) || registrationNumber.includes(searchString);
        } catch (error) {
            console.error('Error filtering patient:', error, patient);
            return false; // Exclude this patient from results due to error
        }
    });

    const handleViewPatient = (patientId) => {
        try {
            console.log('View patient:', patientId);
            const selected = patients.find(p => p.id === patientId);
            if (selected) {
                setSelectedPatient(selected);
            } else {
                console.error('Patient not found with ID:', patientId);
                setError(`Patient with ID ${patientId} not found`);
                setTimeout(() => setError(null), 3000);
            }
        } catch (error) {
            console.error('Error handling view patient:', error);
            setError('Error selecting patient: ' + error.message);
            setTimeout(() => setError(null), 3000);
        }
    };

    const retryFetchPatients = () => {
        fetchPatients(); // Retry loading the patients
    };

    if (loading) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <div style={{ marginBottom: '15px' }}>Loading patients...</div>
                <div className="loading-spinner"></div>
            </div>
        );
    }

    if (dataLoadError) {
        return (
            <div style={{ 
                padding: '20px', 
                color: 'red', 
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '200px'
            }}>
                <div style={{ marginBottom: '15px' }}>{error}</div>
                <button 
                    onClick={retryFetchPatients}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '20px'
            }}>
                <h2 style={{ margin: 0 }}>Patient Search</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <input 
                        type="text" 
                        placeholder="Search by name or patient number..."
                        value={searchTerm}
                        onChange={handleSearch}
                        onKeyPress={(e) => e.key === 'Enter' && executeSearch()}
                        style={{
                            padding: '8px 12px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            width: '250px'
                        }}
                    />
                    <button 
                        style={{
                            padding: '8px 16px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            opacity: isSearching ? 0.7 : 1,
                        }}
                        onClick={executeSearch}
                        disabled={isSearching}
                    >
                        {isSearching ? 'Searching...' : 'Search'}
                    </button>
                </div>
            </div>

            {error && !dataLoadError && (
                <div style={{
                    padding: '10px',
                    backgroundColor: '#f8d7da',
                    color: '#721c24',
                    border: '1px solid #f5c6cb',
                    borderRadius: '4px',
                    marginBottom: '15px'
                }}>
                    {error}
                </div>
            )}

            {patients.length === 0 && !dataLoadError && (
                <div style={{ 
                    textAlign: 'center', 
                    padding: '20px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '4px'
                }}>
                    No patients found. Please add patients through the registration form.
                </div>
            )}

            {patients.length > 0 && (
                <div style={{ 
                    overflowX: 'auto',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                    <table style={{ 
                        width: '100%',
                        borderCollapse: 'collapse'
                    }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f8f9fa' }}>
                                <th style={{ 
                                    padding: '12px 16px',
                                    textAlign: 'left',
                                    borderBottom: '1px solid #dee2e6',
                                    fontWeight: 600
                                }}>Patient No.</th>
                                <th style={{ 
                                    padding: '12px 16px',
                                    textAlign: 'left',
                                    borderBottom: '1px solid #dee2e6',
                                    fontWeight: 600
                                }}>First Name</th>
                                <th style={{ 
                                    padding: '12px 16px',
                                    textAlign: 'left',
                                    borderBottom: '1px solid #dee2e6',
                                    fontWeight: 600
                                }}>Middle Name</th>
                                <th style={{ 
                                    padding: '12px 16px',
                                    textAlign: 'left',
                                    borderBottom: '1px solid #dee2e6',
                                    fontWeight: 600
                                }}>Last Name</th>
                                <th style={{ 
                                    padding: '12px 16px',
                                    textAlign: 'left',
                                    borderBottom: '1px solid #dee2e6',
                                    fontWeight: 600
                                }}>Gender</th>
                                <th style={{ 
                                    padding: '12px 16px',
                                    textAlign: 'left',
                                    borderBottom: '1px solid #dee2e6',
                                    fontWeight: 600
                                }}>Age</th>
                                <th style={{ 
                                    padding: '12px 16px',
                                    textAlign: 'left',
                                    borderBottom: '1px solid #dee2e6',
                                    fontWeight: 600
                                }}>Contact</th>
                                <th style={{ 
                                    padding: '12px 16px',
                                    textAlign: 'left',
                                    borderBottom: '1px solid #dee2e6',
                                    fontWeight: 600
                                }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPatients.length === 0 ? (
                                <tr>
                                    <td colSpan="8" style={{ 
                                        padding: '20px',
                                        textAlign: 'center',
                                        color: '#666'
                                    }}>
                                        No patients match your search
                                    </td>
                                </tr>
                            ) : (
                                filteredPatients.map(patient => (
                                    <tr key={patient.id} style={{
                                        borderBottom: '1px solid #dee2e6',
                                        backgroundColor: patient.dataComplete ? 'white' : '#fff8e1'
                                    }}>
                                        <td style={{ padding: '12px 16px' }}>
                                            {patient.id.substring(0, 8)}
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            {patient.personalInfo?.firstName || 'Unknown'}
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            {patient.personalInfo?.middleName || ''}
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            {patient.personalInfo?.lastName || 'Unknown'}
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            {patient.personalInfo?.gender || 'Unknown'}
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            {patient.personalInfo?.age || 'Unknown'}
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            {patient.contactInfo?.contactNumber || 'None'}
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <button 
                                                onClick={() => handleViewPatient(patient.id)}
                                                style={{
                                                    padding: '6px 12px',
                                                    backgroundColor: '#28a745',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                    marginRight: '5px'
                                                }}
                                            >
                                                View
                                            </button>
                                            {!patient.dataComplete && (
                                                <span style={{
                                                    fontSize: '12px',
                                                    color: '#856404',
                                                    backgroundColor: '#fff3cd',
                                                    padding: '2px 5px',
                                                    borderRadius: '3px',
                                                    marginLeft: '5px'
                                                }}>
                                                    Incomplete
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {selectedPatient && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        padding: '20px',
                        width: '80%',
                        maxWidth: '800px',
                        maxHeight: '80vh',
                        overflowY: 'auto'
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '20px'
                        }}>
                            <h3 style={{ margin: 0 }}>Patient Details</h3>
                            <button 
                                onClick={() => setSelectedPatient(null)}
                                style={{
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    fontSize: '24px',
                                    cursor: 'pointer'
                                }}
                            >
                                &times;
                            </button>
                        </div>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: '15px'
                        }}>
                            <div>
                                <h4>Personal Information</h4>
                                <p><strong>Name:</strong> {getFullName(selectedPatient)}</p>
                                <p><strong>Gender:</strong> {selectedPatient.personalInfo?.gender || 'Unknown'}</p>
                                <p><strong>Age:</strong> {selectedPatient.personalInfo?.age || 'Unknown'}</p>
                                <p><strong>Birth Date:</strong> {selectedPatient.personalInfo?.birthdate 
                                    ? new Date(selectedPatient.personalInfo.birthdate).toLocaleDateString()
                                    : 'Unknown'}</p>
                                <p><strong>Civil Status:</strong> {selectedPatient.personalInfo?.civilStatus || 'Unknown'}</p>
                                <p><strong>Employment:</strong> {selectedPatient.personalInfo?.employmentStatus || 'Unknown'}</p>
                            </div>
                            <div>
                                <h4>Contact Information</h4>
                                <p><strong>Phone:</strong> {selectedPatient.contactInfo?.contactNumber || 'None'}</p>
                                <p><strong>Email:</strong> {selectedPatient.contactInfo?.email || 'None'}</p>
                                
                                <h4>Medical Information</h4>
                                <p><strong>Blood Type:</strong> {selectedPatient.medicalInfo?.bloodType || 'Unknown'}</p>
                                <p><strong>Height:</strong> {selectedPatient.medicalInfo?.height 
                                    ? `${selectedPatient.medicalInfo.height} cm` 
                                    : 'Unknown'}</p>
                                <p><strong>Weight:</strong> {selectedPatient.medicalInfo?.weight 
                                    ? `${selectedPatient.medicalInfo.weight} kg` 
                                    : 'Unknown'}</p>
                                <p><strong>BMI:</strong> {selectedPatient.medicalInfo?.bmi || 'Unknown'}</p>
                            </div>
                        </div>
                        <div>
                            <h4>Address</h4>
                            {selectedPatient.address ? (
                                <p>{[
                                    selectedPatient.address.street,
                                    selectedPatient.address.barangay,
                                    selectedPatient.address.municipality,
                                    selectedPatient.address.province,
                                    selectedPatient.address.zipcode
                                ].filter(Boolean).join(', ')}</p>
                            ) : (
                                <p>No address information</p>
                            )}
                        </div>
                        <div style={{ marginTop: '20px', textAlign: 'right' }}>
                            <button
                                onClick={() => setSelectedPatient(null)}
                                style={{
                                    padding: '8px 16px',
                                    backgroundColor: '#6c757d',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PatientSearch;