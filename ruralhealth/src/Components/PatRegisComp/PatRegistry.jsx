import React from 'react';
import PatientInformation from '../PatRegisComp/PatInfo';
import PatientSearch from '../PatRegisComp/PatSearch';

function PatientRegistry() {
    console.log('PatientRegistry component rendered');
    return (
        <div className="patient-registry-container">
            <h1 className="registry-title">Patient Registry</h1>
            <div className="registry-content">
                <PatientInformation />
                <PatientSearch />
            </div>
            <div className="bottom-buttons">
                <div className="left-buttons">
                    <button className="delete-btn">Delete</button>
                    <button className="update-btn">Update</button>
                </div>
                <div className="right-buttons">
                    <button className="clear-btn">Clear</button>
                    <button className="register-btn">Register</button>
                </div>
            </div>
        </div>
    );
}

export default PatientRegistry;