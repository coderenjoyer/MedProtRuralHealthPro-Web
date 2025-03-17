import React, { useState, useEffect } from 'react';
import { getAllPatients } from '../../Firebase/patientOperations.js';

function PatientSearch() {
    const [patients, setPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            setLoading(true);
            const result = await getAllPatients();
            console.log('Raw result from Firebase:', result);
            
            if (result.success) {
                const patientsArray = Object.entries(result.data || {}).map(([id, data]) => {
                    console.log('Processing patient data:', data);
                    return {
                        id,
                        ...data
                    };
                });
                console.log('Processed patients array:', patientsArray);
                setPatients(patientsArray);
            } else {
                setError('Failed to fetch patients');
            }
        } catch (err) {
            setError('Error loading patients');
            console.error('Error fetching patients:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const getFullName = (patient) => {
        console.log('Getting full name for patient:', patient);
        const firstName = patient.personalInfo?.firstName || '';
        const middleName = patient.personalInfo?.middleName || '';
        const lastName = patient.personalInfo?.lastName || '';
        return `${firstName} ${middleName} ${lastName}`.trim();
    };

    const filteredPatients = patients.filter(patient => {
        const searchString = searchTerm.toLowerCase();
        const fullName = getFullName(patient).toLowerCase();
        const registrationNumber = patient.registrationInfo?.registrationNumber?.toLowerCase() || '';
        return fullName.includes(searchString) || registrationNumber.includes(searchString);
    });

    const handleViewPatient = (patientId) => {
        console.log('View patient:', patientId);
    };

    if (loading) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                Loading patients...
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: '20px', color: 'red', textAlign: 'center' }}>
                {error}
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
                        style={{
                            padding: '8px 12px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            width: '250px'
                        }}
                    />
                    <button style={{
                        padding: '8px 16px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}>
                        Search
                    </button>
                </div>
            </div>

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
                            }}>Contact</th>
                            <th style={{ 
                                padding: '12px 16px',
                                textAlign: 'left',
                                borderBottom: '1px solid #dee2e6',
                                fontWeight: 600
                            }}>Status</th>
                            <th style={{ 
                                padding: '12px 16px',
                                textAlign: 'left',
                                borderBottom: '1px solid #dee2e6',
                                fontWeight: 600
                            }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPatients.map(patient => {
                            console.log('Rendering patient:', patient);
                            return (
                                <tr key={patient.id} style={{ 
                                    borderBottom: '1px solid #dee2e6',
                                    '&:hover': {
                                        backgroundColor: '#f8f9fa'
                                    }
                                }}>
                                    <td style={{ padding: '12px 16px' }}>
                                        {patient.registrationInfo?.registrationNumber || 'N/A'}
                                    </td>
                                    <td style={{ padding: '12px 16px' }}>
                                        {patient.personalInfo?.firstName || 'N/A'}
                                    </td>
                                    <td style={{ padding: '12px 16px' }}>
                                        {patient.personalInfo?.middleName || 'N/A'}
                                    </td>
                                    <td style={{ padding: '12px 16px' }}>
                                        {patient.personalInfo?.lastName || 'N/A'}
                                    </td>
                                    <td style={{ padding: '12px 16px' }}>
                                        {patient.contactInfo?.contactNumber || 'N/A'}
                                    </td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <span style={{
                                            padding: '4px 8px',
                                            borderRadius: '12px',
                                            fontSize: '0.875rem',
                                            backgroundColor: patient.registrationInfo?.status === 'active' ? '#d4edda' :
                                                           patient.registrationInfo?.status === 'inactive' ? '#f8d7da' : '#e2e3e5',
                                            color: patient.registrationInfo?.status === 'active' ? '#155724' :
                                                   patient.registrationInfo?.status === 'inactive' ? '#721c24' : '#383d41'
                                        }}>
                                            {patient.registrationInfo?.status || 'N/A'}
                                        </span>
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
                                                cursor: 'pointer'
                                            }}
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        {filteredPatients.length === 0 && (
                            <tr>
                                <td colSpan="7" style={{ 
                                    padding: '20px',
                                    textAlign: 'center',
                                    color: '#666'
                                }}>
                                    No patients found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default PatientSearch;