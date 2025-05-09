import React, { useState, useEffect } from 'react';
import { getAllPatients } from '../../Firebase/patientOperations.js';
import { ref, get, query, orderByChild, equalTo } from 'firebase/database';
import { database } from '../../Firebase/firebase';

function PatientSearch({ onPatientSelect }) {
    const [patients, setPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [dataLoadError, setDataLoadError] = useState(false);
    const [searchResults, setSearchResults] = useState([]);

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

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchTerm.trim()) {
            setError('Please enter a search term');
            return;
        }

        setIsSearching(true);
        setError(null);

        try {
            // Search by patient ID
            const patientRef = ref(database, 'rhp/patients');
            const patientQuery = query(patientRef, orderByChild('patientId'), equalTo(searchTerm));
            const snapshot = await get(patientQuery);

            if (snapshot.exists()) {
                const results = [];
                snapshot.forEach((childSnapshot) => {
                    results.push({
                        id: childSnapshot.key,
                        ...childSnapshot.val()
                    });
                });
                setSearchResults(results);
            } else {
                setSearchResults([]);
                setError('No patient found with the given ID');
            }
        } catch (error) {
            console.error('Error searching for patient:', error);
            setError('Error searching for patient. Please try again.');
        } finally {
            setIsSearching(false);
        }
    };

    const handleSelectPatient = (patient) => {
        // Format the patient data to match the form structure
        const formattedPatient = {
            id: patient.id,
            firstName: patient.personalInfo?.firstName || '',
            lastName: patient.personalInfo?.lastName || '',
            middleName: patient.personalInfo?.middleName || '',
            address: {
                street: patient.address?.street || '',
                barangay: patient.address?.barangay || '',
                municipality: patient.address?.municipality || '',
                province: patient.address?.province || '',
                zipcode: patient.address?.zipcode || ''
            },
            personalInfo: {
                birthdate: patient.personalInfo?.birthdate || '',
                gender: patient.personalInfo?.gender || '',
                age: patient.personalInfo?.age || '',
                civilStatus: patient.personalInfo?.civilStatus || '',
                employmentStatus: patient.personalInfo?.employmentStatus || ''
            },
            contactInfo: {
                email: patient.contactInfo?.email || '',
                phoneNumber: patient.contactInfo?.contactNumber || ''
            },
            medicalInfo: {
                height: patient.medicalInfo?.height || '',
                weight: patient.medicalInfo?.weight || '',
                bmi: patient.medicalInfo?.bmi || '',
                bloodType: patient.medicalInfo?.bloodType || ''
            }
        };

        onPatientSelect(formattedPatient);
        setSearchResults([]);
        setSearchTerm('');
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
                marginBottom: '20px',
                backgroundColor: '#ffffff',
                padding: '20px',
                borderRadius: '10px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}>
                <h2 style={{ 
                    margin: 0,
                    color: '#2c3e50',
                    fontSize: '1.5rem',
                    fontWeight: '600'
                }}>Patient Search</h2>
                <div style={{ 
                    display: 'flex', 
                    gap: '10px',
                    flex: 1,
                    maxWidth: '500px',
                    marginLeft: '20px'
                }}>
                    <form onSubmit={handleSearch} style={{ width: '100%' }}>
                        <div style={{
                            position: 'relative',
                            width: '100%'
                        }}>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by Patient ID..."
                                disabled={isSearching}
                                style={{
                                    width: '100%',
                                    padding: '12px 20px',
                                    paddingLeft: '45px',
                                    fontSize: '1rem',
                                    border: '2px solid #e0e0e0',
                                    borderRadius: '8px',
                                    backgroundColor: '#ffffff',
                                    color: '#2c3e50',
                                    transition: 'all 0.3s ease',
                                    outline: 'none'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#007bff';
                                    e.target.style.boxShadow = '0 0 0 3px rgba(0,123,255,0.1)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#e0e0e0';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                            <div style={{
                                position: 'absolute',
                                left: '15px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#6c757d'
                            }}>
                                <svg 
                                    width="20" 
                                    height="20" 
                                    viewBox="0 0 24 24" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    strokeWidth="2" 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round"
                                >
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                </svg>
                            </div>
                            <button 
                                type="submit" 
                                disabled={isSearching}
                                style={{
                                    position: 'absolute',
                                    right: '5px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    padding: '8px 16px',
                                    backgroundColor: '#007bff',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    fontWeight: '500',
                                    transition: 'all 0.3s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                                onMouseOver={(e) => {
                                    e.target.style.backgroundColor = '#0056b3';
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.backgroundColor = '#007bff';
                                }}
                            >
                                {isSearching ? (
                                    <>
                                        <svg 
                                            width="16" 
                                            height="16" 
                                            viewBox="0 0 24 24" 
                                            fill="none" 
                                            stroke="currentColor" 
                                            strokeWidth="2" 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round"
                                            style={{
                                                animation: 'spin 1s linear infinite'
                                            }}
                                        >
                                            <line x1="12" y1="2" x2="12" y2="6"></line>
                                            <line x1="12" y1="18" x2="12" y2="22"></line>
                                            <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                                            <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                                            <line x1="2" y1="12" x2="6" y2="12"></line>
                                            <line x1="18" y1="12" x2="22" y2="12"></line>
                                            <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                                            <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                                        </svg>
                                        Searching...
                                    </>
                                ) : (
                                    <>
                                        <svg 
                                            width="16" 
                                            height="16" 
                                            viewBox="0 0 24 24" 
                                            fill="none" 
                                            stroke="currentColor" 
                                            strokeWidth="2" 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round"
                                        >
                                            <circle cx="11" cy="11" r="8"></circle>
                                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                        </svg>
                                        Search
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
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
                                            <button 
                                                onClick={() => handleSelectPatient(patient)}
                                                style={{
                                                    padding: '6px 12px',
                                                    backgroundColor: '#007bff',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Select
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
            
            <style jsx>{`
                @keyframes spin {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }

                input:disabled {
                    background-color: #f8f9fa !important;
                    cursor: not-allowed;
                }

                button:disabled {
                    background-color: #6c757d !important;
                    cursor: not-allowed;
                }
            `}</style>
        </div>
    );
}

export default PatientSearch;