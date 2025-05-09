import React, { useState } from 'react';
import PatientInformation from './PatInfo';
import PatientSearch from './PatSearch';
import { Eye, EyeOff } from 'lucide-react';
import styled from 'styled-components';

const ToggleButton = styled.button`
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 10px;
    background-color: #4FC3F7;
    color: black;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    z-index: 1000;

    &:hover {
        background-color: #29B6F6;
        transform: translateY(-2px);
    }

    span {
        font-size: 14px;
        font-weight: 500;
    }
`;

function PatRegistry({ onCollapse }) {
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [showSearch, setShowSearch] = useState(true);

    const handleRegister = (patientId) => {
        setSuccess(`Patient ${selectedPatient ? 'updated' : 'registered'} successfully with ID: ${patientId}`);
        setError(null);
        // Clear success message after 5 seconds
        setTimeout(() => setSuccess(null), 5000);
        // Clear selected patient after successful update
        if (selectedPatient) {
            setSelectedPatient(null);
        }
    };

    const handleError = (errorMessage) => {
        setError(errorMessage);
        setSuccess(null);
        // Clear error message after 5 seconds
        setTimeout(() => setError(null), 5000);
    };

    const handlePatientSelect = (patient) => {
        setSelectedPatient(patient);
    };

    const toggleSearch = () => {
        setShowSearch(!showSearch);
        // Uncollapse the sidebar when showing search
        if (!showSearch && onCollapse) {
            onCollapse(false);
        }
    };

    return (
        <div className="pat-registry">
            <ToggleButton onClick={toggleSearch}>
                {showSearch ? <EyeOff size={20} /> : <Eye size={20} />}
                <span>{showSearch ? 'Hide Search' : 'Show Search'}</span>
            </ToggleButton>
            <div className="pat-registry-header">
                <h1>Patient Registry</h1>
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}
            </div>
            <PatientInformation 
                onRegister={handleRegister} 
                onError={handleError} 
                selectedPatient={selectedPatient}
            />
            {showSearch && <PatientSearch onPatientSelect={handlePatientSelect} />}
        </div>
    );
}

export default PatRegistry;