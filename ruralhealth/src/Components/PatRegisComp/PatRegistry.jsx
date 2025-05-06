import React, { useState } from 'react';
import PatientInformation from './PatInfo';
import PatientSearch from './PatSearch';

function PatRegistry() {
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleRegister = (patientId) => {
        setSuccess(`Patient registered successfully with ID: ${patientId}`);
        setError(null);
        // Clear success message after 5 seconds
        setTimeout(() => setSuccess(null), 5000);
    };

    const handleError = (errorMessage) => {
        setError(errorMessage);
        setSuccess(null);
        // Clear error message after 5 seconds
        setTimeout(() => setError(null), 5000);
    };

    return (
        <div className="pat-registry">
            <div className="pat-registry-header">
                <h1>Patient Registry</h1>
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}
            </div>
            <PatientInformation onRegister={handleRegister} onError={handleError} />
            <PatientSearch />
        </div>
    );
}

export default PatRegistry;