import React, { useState } from 'react';
import PatientInformation from './PatInfo';
import PatientSearch from './PatSearch';
import { Eye, EyeOff, HelpCircle, Info } from 'lucide-react';
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

// Tooltip styled components
const TooltipContainer = styled.div`
    position: absolute;
    background-color: rgba(0, 0, 0, 0.85);
    color: #fff;
    padding: 10px 12px;
    border-radius: 6px;
    font-size: 14px;
    max-width: 300px;
    z-index: 1100;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    transition: opacity 0.3s ease, visibility 0.3s ease;
    pointer-events: none;
    opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
    visibility: ${({ isVisible }) => (isVisible ? 'visible' : 'hidden')};
`;

const HelpButton = styled.button`
    background: none;
    border: none;
    cursor: help;
    padding: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-left: 10px;
    color: #4FC3F7;
    
    &:hover {
        color: #29B6F6;
    }
`;

const RegistryHeader = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    position: relative;
    
    h1 {
        margin: 0;
    }
`;

const MessageContainer = styled.div`
    margin: 10px 0;
    padding: 12px;
    border-radius: 6px;
    font-size: 14px;
    display: flex;
    align-items: center;
    max-width: 600px;
    
    &.error {
        background-color: rgba(244, 67, 54, 0.1);
        border-left: 4px solid #f44336;
        color: #d32f2f;
    }
    
    &.success {
        background-color: rgba(76, 175, 80, 0.1);
        border-left: 4px solid #4caf50;
        color: #388e3c;
    }
`;

function PatRegistry({ onCollapse }) {
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [showSearch, setShowSearch] = useState(true);
    const [activeTooltip, setActiveTooltip] = useState(null);

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

    // Tooltip handlers
    const showTooltip = (id) => {
        setActiveTooltip(id);
    };

    const hideTooltip = () => {
        setActiveTooltip(null);
    };

    return (
        <div className="pat-registry">
            <ToggleButton 
                onClick={toggleSearch}
                onMouseEnter={() => showTooltip('toggle-search')}
                onMouseLeave={hideTooltip}
            >
                {showSearch ? <EyeOff size={20} /> : <Eye size={20} />}
                <span>{showSearch ? 'Hide Search' : 'Show Search'}</span>
            </ToggleButton>
            {activeTooltip === 'toggle-search' && (
                <TooltipContainer 
                    isVisible={true}
                    style={{
                        top: '60px',
                        right: '20px',
                    }}
                >
                    {showSearch 
                        ? 'Hide the patient search panel to have more space for the registration form' 
                        : 'Show the patient search panel to find and select existing patients'}
                </TooltipContainer>
            )}
            
            <RegistryHeader>
                <h1>Patient Registry</h1>
                <HelpButton
                    onMouseEnter={() => showTooltip('registry-help')}
                    onMouseLeave={hideTooltip}
                >
                    <HelpCircle size={18} />
                </HelpButton>
                {activeTooltip === 'registry-help' && (
                    <TooltipContainer 
                        isVisible={true}
                        style={{
                            top: '40px',
                            left: '150px',
                        }}
                    >
                        The Patient Registry allows you to register new patients and update existing patient records. 
                        Use the search panel on the right to find existing patients or fill out the form to register a new one.
                    </TooltipContainer>
                )}
            </RegistryHeader>
            
            {error && (
                <MessageContainer className="error">
                    <Info size={16} style={{ marginRight: '8px' }} />
                    {error}
                </MessageContainer>
            )}
            {success && (
                <MessageContainer className="success">
                    <Info size={16} style={{ marginRight: '8px' }} />
                    {success}
                </MessageContainer>
            )}
            
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