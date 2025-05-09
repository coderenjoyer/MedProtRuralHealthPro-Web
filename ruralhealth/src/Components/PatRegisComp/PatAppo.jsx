import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { ChevronDown, ChevronUp, Search, HelpCircle, Info } from 'lucide-react';
import { ref, onValue, push, update, remove, get, set } from 'firebase/database';
import { database } from '../../Firebase/firebase';
import { toast } from 'react-toastify';
import 'react-calendar/dist/Calendar.css';
import styled from 'styled-components';
import emailjs from '@emailjs/browser';
import { EMAIL_CONFIG } from '../../config/emailConfig';

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

const SectionHeader = styled.div`
    display: flex;
    align-items: center;
    position: relative;
    
    h2 {
        margin-right: 10px;
    }
`;

const SearchResultsContainer = styled.div`
    max-height: 300px;
    overflow-y: auto;
    border: 1px solid #ddd;
    border-radius: 8px;
    margin-top: 10px;
    
    &::-webkit-scrollbar {
        width: 8px;
    }
    
    &::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 4px;
    }
    
    &::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 4px;
        
        &:hover {
            background: #555;
        }
    }
`;

const PatientsTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    
    thead {
        position: sticky;
        top: 0;
        background-color: #f8f9fa;
        z-index: 1;
    }
    
    th, td {
        padding: 12px;
        text-align: left;
        border-bottom: 1px solid #ddd;
    }
    
    th {
        font-weight: 600;
        color: #333;
    }
    
    tr:hover {
        background-color: #f5f5f5;
    }
`;

const SelectButton = styled.button`
    padding: 6px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    background-color: ${props => props.$isSelected ? '#4CAF50' : '#007bff'};
    color: white;
    transition: background-color 0.2s;
    
    &:hover {
        background-color: ${props => props.$isSelected ? '#45a049' : '#0056b3'};
    }
`;

const AppointmentManagementSection = styled.div`
    background-color: #fff;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const PatientInfoSection = styled.div`
    margin-bottom: 20px;
    padding: 15px;
    background-color: #f8f9fa;
    border-radius: 6px;
    border: 1px solid #e9ecef;
`;

const PatientInfoGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
    margin-bottom: 15px;
`;

const PatientInfoItem = styled.div`
    label {
        display: block;
        font-weight: 600;
        color: #000000;
        margin-bottom: 5px;
    }
    
    input, select {
        width: 100%;
        padding: 8px;
        border: 1px solid #ced4da;
        border-radius: 4px;
        background-color: #fff;
        color: #000000;
    }
`;

const AppointmentsTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-top: 15px;
    
    th, td {
        padding: 12px;
        text-align: left;
        border-bottom: 1px solid #dee2e6;
        color: #000000;
    }
    
    th {
        background-color: #f8f9fa;
        font-weight: 600;
        color: #000000;
    }
    
    tr:hover {
        background-color: #f5f5f5;
    }
`;

const AppointmentFormRef = styled.div`
    scroll-margin-top: 20px;
`;

function Appointments({ selectedPatient, onPatientSelect }) {
    const [isCalendarCollapsed, setIsCalendarCollapsed] = useState(false);
    const [appointments, setAppointments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [patients, setPatients] = useState([]);
    const [localSelectedPatient, setLocalSelectedPatient] = useState(null);
    const [formData, setFormData] = useState({
        lastName: '',
        firstName: '',
        middleName: '',
        email: '',
        phoneNumber: '',
        appointmentDate: '',
        appointmentTime: '',
        description: ''
    });
    const [showOverlay, setShowOverlay] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    // Add state for tooltips
    const [activeTooltip, setActiveTooltip] = useState(null);

    // Load all patients from Firebase
    useEffect(() => {
        const patientsRef = ref(database, 'rhp/patients');
        const unsubscribe = onValue(patientsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const patientsList = Object.entries(data).map(([id, patient]) => ({
                    id,
                    ...patient,
                }));
                setPatients(patientsList);
            } else {
                setPatients([]);
            }
        });

        return () => unsubscribe();
    }, []);

    
    const handlePatientSelect = (patient) => {
        if (currentPatient?.id === patient.id) {
            setLocalSelectedPatient(null);
            if (onPatientSelect) {
                onPatientSelect(null);
            }
        } else {
            setLocalSelectedPatient(patient);
            if (onPatientSelect) {
                onPatientSelect(patient);
            }
            // Scroll to appointment form
            const appointmentForm = document.getElementById('appointment-form');
            if (appointmentForm) {
                appointmentForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    };
 
    useEffect(() => {
        const patient = localSelectedPatient || selectedPatient;
        if (patient) {
            setFormData(prev => ({
                ...prev,
                lastName: patient.personalInfo?.lastName || '',
                firstName: patient.personalInfo?.firstName || '',
                middleName: patient.personalInfo?.middleName || '',
                email: patient.contactInfo?.email || '',
                phoneNumber: patient.contactInfo?.phoneNumber || '',
                appointmentDate: '',
                appointmentTime: '',
                description: ''
            }));
        }
    }, [localSelectedPatient, selectedPatient]);

  
    useEffect(() => {
        const patient = localSelectedPatient || selectedPatient;
        if (patient) {
            const appointmentsRef = ref(database, `rhp/patients/${patient.id}/appointments`);
            const unsubscribe = onValue(appointmentsRef, async (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    // Since we're now storing a single appointment, convert it to array format
                    const appointment = {
                        id: 'current',
                        ...data
                    };
                    setAppointments([appointment]);
                    
                    // Schedule reminder email for the appointment
                    const appointmentDate = new Date(`${data.appointmentDate}T${data.appointmentTime}`);
                    if (appointmentDate > new Date() && data.status !== 'cancelled') {
                        await scheduleReminderEmails([appointment]);
                    }
                } else {
                    setAppointments([]);
                }
            });

            return () => unsubscribe();
        }
    }, [localSelectedPatient, selectedPatient, patients]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        const currentPatient = localSelectedPatient || selectedPatient;
        console.log('Current patient in handleSubmit:', currentPatient);
        
        if (!currentPatient) {
            toast.error("Please select a patient first");
            return;
        }

        if (!formData.appointmentDate || !formData.appointmentTime) {
            toast.error("Please select both date and time for the appointment");
            return;
        }

        try {
            const appointmentsRef = ref(database, `rhp/patients/${currentPatient.id}/appointments`);
            
           
            const appointmentData = {
                patientId: currentPatient.id,
                patientName: `${currentPatient.personalInfo.firstName} ${currentPatient.personalInfo.lastName}`,
                appointmentDate: formData.appointmentDate,
                appointmentTime: formData.appointmentTime,
                description: formData.description,
                createdAt: new Date().toISOString(),
                status: 'pending'
            };

           
            await set(appointmentsRef, appointmentData);

            
            const patientRef = ref(database, `rhp/patients/${currentPatient.id}`);
            await update(patientRef, {
                'registrationInfo.lastVisit': new Date().toISOString(),
                'registrationInfo.nextAppointment': `${formData.appointmentDate}T${formData.appointmentTime}`
            });

            toast.success("Appointment scheduled successfully!", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            handleClear();
        } catch (error) {
            console.error("Error scheduling appointment:", error);
            toast.error("Failed to schedule appointment. Please try again.", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    };

    const handleClear = () => {
        setFormData(prev => ({
            ...prev,
            appointmentDate: '',
            appointmentTime: '',
            description: ''
        }));
    };

    const sendCancellationEmail = async (appointment, patient) => {
        try {
            // Check if patient has email
            if (!patient.contactInfo?.email) {
                throw new Error('Patient does not have an email address');
            }

            // Create a cancellation record in Firebase for tracking
            const cancellationRef = ref(database, 'rhp/appointmentCancellations');
            const cancellationData = {
                patientId: patient.id,
                patientEmail: patient.contactInfo.email,
                patientName: `${patient.personalInfo?.firstName} ${patient.personalInfo?.lastName}`,
                appointmentDate: appointment.appointmentDate,
                appointmentTime: appointment.appointmentTime,
                description: appointment.description || 'No specific description provided',
                cancelledAt: new Date().toISOString(),
                status: 'pending' // This will trigger the Firebase Cloud Function
            };

            // Push the cancellation record to Firebase
            const newCancellationRef = await push(cancellationRef, cancellationData);

            // Set up a listener for the cancellation status
            const unsubscribe = onValue(newCancellationRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    if (data.status === 'sent') {
                        toast.success('Cancellation email sent successfully', {
                            position: "top-right",
                            autoClose: 3000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                        });
                        unsubscribe(); // Remove the listener once email is sent
                    } else if (data.status === 'failed') {
                        toast.error(`Failed to send cancellation email: ${data.error || 'Unknown error'}`, {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                        });
                        unsubscribe(); // Remove the listener if email fails
                    }
                }
            });

            console.log('Cancellation email request sent successfully');
            toast.info('Sending cancellation email...', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } catch (error) {
            console.error('Error sending cancellation email:', error);
            toast.error(error.message || 'Failed to send cancellation email', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    };

    const handleCancelAppointment = async () => {
        try {
            const patient = localSelectedPatient || selectedPatient;
            if (!patient) {
                toast.error("No patient selected", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                return;
            }
            
            // Get current appointment before cancelling
            const appointmentsRef = ref(database, `rhp/patients/${patient.id}/appointments`);
            const appointmentSnapshot = await get(appointmentsRef);
            const currentAppointment = appointmentSnapshot.val();
            
            if (!currentAppointment) {
                toast.error("No appointment found to cancel", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                return;
            }

            // Set appointments to null when cancelled
            await set(appointmentsRef, null);
            
            // Update patient's next appointment to null
            const patientRef = ref(database, `rhp/patients/${patient.id}`);
            await update(patientRef, {
                'registrationInfo.nextAppointment': null
            });

            // Send cancellation email if there was an appointment
            if (currentAppointment && patient.contactInfo?.email) {
                await sendCancellationEmail(currentAppointment, patient);
            }
            
            toast.success("Appointment cancelled successfully!", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } catch (error) {
            console.error("Error cancelling appointment:", error);
            toast.error("Failed to cancel appointment. Please try again.", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    };

    // Add debug log for selectedPatient changes
    useEffect(() => {
        console.log('selectedPatient changed:', selectedPatient);
    }, [selectedPatient]);

    const filteredPatients = patients.filter(patient =>
        patient.personalInfo?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.personalInfo?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.registrationInfo?.registrationNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredAppointments = appointments.filter(appointment =>
        appointment.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const currentPatient = localSelectedPatient || selectedPatient;

    // Filter upcoming appointments
    const getUpcomingAppointments = () => {
        const now = new Date();
        return appointments.filter(appointment => {
            const appointmentDateTime = new Date(`${appointment.appointmentDate}T${appointment.appointmentTime}`);
            return appointmentDateTime > now && appointment.status !== 'cancelled';
        });
    };

    // Format date for display
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Format time for display
    const formatTime = (timeString) => {
        return timeString.substring(0, 5); // Remove seconds if present
    };

    const sendAppointmentReminder = async (appointment, patient) => {
        try {
            // Create a reminder record in Firebase
            const reminderRef = ref(database, 'rhp/appointmentReminders');
            await push(reminderRef, {
                patientId: patient.id,
                patientEmail: patient.contactInfo?.email,
                patientName: `${patient.personalInfo?.firstName} ${patient.personalInfo?.lastName}`,
                appointmentDate: appointment.appointmentDate,
                appointmentTime: appointment.appointmentTime,
                description: appointment.description || 'No specific description provided',
                status: 'pending',
                createdAt: new Date().toISOString()
            });

            console.log('Reminder scheduled successfully');
        } catch (error) {
            console.error('Error scheduling reminder:', error);
            toast.error('Failed to schedule reminder email');
        }
    };

    // Function to schedule reminder emails
    const scheduleReminderEmails = async (appointments) => {
        for (const appointment of appointments) {
            const appointmentDate = new Date(`${appointment.appointmentDate}T${appointment.appointmentTime}`);
            const now = new Date();
            const timeUntilAppointment = appointmentDate - now;
            const oneDayInMs = 24 * 60 * 60 * 1000;

            // If appointment is more than 1 day away, schedule the reminder
            if (timeUntilAppointment > oneDayInMs) {
                const patient = patients.find(p => p.id === appointment.patientId);
                if (patient) {
                    await sendAppointmentReminder(appointment, patient);
                }
            }
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
        <div className="appointments-container">
            <div className="appointment-management">
                <AppointmentManagementSection>
                    <SectionHeader>
                        <h2 className="section-title" style={{ color: '#000000' }}>Appointment Management</h2>
                        <HelpButton
                            onMouseEnter={() => showTooltip('appointment-management')}
                            onMouseLeave={hideTooltip}
                        >
                            <HelpCircle size={18} />
                        </HelpButton>
                        {activeTooltip === 'appointment-management' && (
                            <TooltipContainer 
                                isVisible={true}
                                style={{
                                    top: '40px',
                                    left: '10px',
                                }}
                            >
                                This section allows you to schedule and manage patient appointments. First, select a patient from the search panel, then set the appointment details.
                            </TooltipContainer>
                        )}
                    </SectionHeader>
                    
                    {currentPatient && currentPatient.id && (
                        <PatientInfoSection>
                            <h3 style={{ color: '#000000' }}>Patient Information</h3>
                            <PatientInfoGrid>
                                <PatientInfoItem>
                                    <label>Patient No.</label>
                                    <input 
                                        type="text" 
                                        value={currentPatient.registrationInfo?.registrationNumber || 'N/A'} 
                                        disabled 
                                    />
                                </PatientInfoItem>
                                <PatientInfoItem>
                                    <label>Full Name</label>
                                    <input 
                                        type="text" 
                                        value={`${currentPatient.personalInfo?.firstName || ''} ${currentPatient.personalInfo?.lastName || ''}`}
                                        disabled 
                                    />
                                </PatientInfoItem>
                                <PatientInfoItem>
                                    <label>Contact Number</label>
                                    <input 
                                        type="text" 
                                        value={currentPatient.contactInfo?.phoneNumber || 'N/A'} 
                                        disabled 
                                    />
                                </PatientInfoItem>
                                <PatientInfoItem>
                                    <label>Email</label>
                                    <input 
                                        type="text" 
                                        value={currentPatient.contactInfo?.email || 'N/A'} 
                                        disabled 
                                    />
                                </PatientInfoItem>
                            </PatientInfoGrid>
                        </PatientInfoSection>
                    )}

                    <AppointmentFormRef id="appointment-form">
                        <div className="appointment-form">
                            <SectionHeader>
                                <h3 style={{ color: '#000000' }}>Schedule Appointment</h3>
                                <HelpButton
                                    onMouseEnter={() => showTooltip('schedule-appointment')}
                                    onMouseLeave={hideTooltip}
                                >
                                    <HelpCircle size={16} />
                                </HelpButton>
                                {activeTooltip === 'schedule-appointment' && (
                                    <TooltipContainer 
                                        isVisible={true}
                                        style={{
                                            top: '30px',
                                            left: '150px',
                                        }}
                                    >
                                        Select a date and time for the patient's appointment. All fields are required. An email confirmation will be sent to the patient if an email address is provided.
                                    </TooltipContainer>
                                )}
                            </SectionHeader>
                            
                            {!currentPatient && (
                                <div style={{ 
                                    textAlign: 'center', 
                                    padding: '20px',
                                    backgroundColor: '#fff3cd',
                                    borderRadius: '4px',
                                    marginBottom: '20px'
                                }}>
                                    <p style={{ color: '#000000' }}>Please select a patient from the list to schedule an appointment</p>
                                </div>
                            )}
                            <PatientInfoGrid>
                                <PatientInfoItem>
                                    <label>
                                        Appointment Date
                                        <HelpButton
                                            onMouseEnter={() => showTooltip('date-help')}
                                            onMouseLeave={hideTooltip}
                                            style={{ marginLeft: '5px' }}
                                        >
                                            <Info size={14} />
                                        </HelpButton>
                                        {activeTooltip === 'date-help' && (
                                            <TooltipContainer 
                                                isVisible={true}
                                                style={{
                                                    top: '30px',
                                                    left: '100px',
                                                }}
                                            >
                                                Select a future date for the appointment. Past dates are not available.
                                            </TooltipContainer>
                                        )}
                                    </label>
                                    <input 
                                        type="date" 
                                        name="appointmentDate"
                                        value={formData.appointmentDate}
                                        onChange={handleInputChange}
                                        min={new Date().toISOString().split('T')[0]}
                                        disabled={!currentPatient}
                                        autoFocus
                                    />
                                </PatientInfoItem>
                                <PatientInfoItem>
                                    <label>
                                        Appointment Time
                                        <HelpButton
                                            onMouseEnter={() => showTooltip('time-help')}
                                            onMouseLeave={hideTooltip}
                                            style={{ marginLeft: '5px' }}
                                        >
                                            <Info size={14} />
                                        </HelpButton>
                                        {activeTooltip === 'time-help' && (
                                            <TooltipContainer 
                                                isVisible={true}
                                                style={{
                                                    top: '30px',
                                                    left: '100px',
                                                }}
                                            >
                                                Select the time for the appointment. Clinic hours are 8:00 AM to 5:00 PM.
                                            </TooltipContainer>
                                        )}
                                    </label>
                                    <input 
                                        type="time" 
                                        name="appointmentTime"
                                        value={formData.appointmentTime}
                                        onChange={handleInputChange}
                                        disabled={!currentPatient}
                                    />
                                </PatientInfoItem>
                                <PatientInfoItem style={{ gridColumn: '1 / -1' }}>
                                    <label>
                                        Appointment Description
                                        <HelpButton
                                            onMouseEnter={() => showTooltip('description-help')}
                                            onMouseLeave={hideTooltip}
                                            style={{ marginLeft: '5px' }}
                                        >
                                            <Info size={14} />
                                        </HelpButton>
                                        {activeTooltip === 'description-help' && (
                                            <TooltipContainer 
                                                isVisible={true}
                                                style={{
                                                    top: '30px',
                                                    left: '100px',
                                                }}
                                            >
                                                Enter the reason for the appointment, including any specific symptoms or concerns. This will help the doctor prepare for the consultation.
                                            </TooltipContainer>
                                        )}
                                    </label>
                                    <textarea 
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows="3"
                                        style={{ width: '100%', padding: '8px' }}
                                        disabled={!currentPatient}
                                    ></textarea>
                                </PatientInfoItem>
                            </PatientInfoGrid>

                            <div className="button-group" style={{ marginTop: '20px' }}>
                                <button 
                                    className="btn clear-btn" 
                                    onClick={handleClear}
                                    disabled={!currentPatient}
                                    style={{ color: '#000000' }}
                                    onMouseEnter={() => showTooltip('clear-btn')}
                                    onMouseLeave={hideTooltip}
                                >
                                    Clear
                                </button>
                                {activeTooltip === 'clear-btn' && (
                                    <TooltipContainer 
                                        isVisible={true}
                                        style={{
                                            bottom: '-40px',
                                            left: '0px',
                                        }}
                                    >
                                        Clear all appointment form fields
                                    </TooltipContainer>
                                )}
                                <button 
                                    className="btn confirm-btn" 
                                    onClick={() => {
                                        if (!currentPatient) {
                                            toast.error("Please select a patient first", {
                                                position: "top-right",
                                                autoClose: 3000,
                                                hideProgressBar: false,
                                                closeOnClick: true,
                                                pauseOnHover: true,
                                                draggable: true,
                                            });
                                            return;
                                        }
                                        if (!formData.appointmentDate || !formData.appointmentTime) {
                                            toast.error("Please select both date and time for the appointment", {
                                                position: "top-right",
                                                autoClose: 3000,
                                                hideProgressBar: false,
                                                closeOnClick: true,
                                                pauseOnHover: true,
                                                draggable: true,
                                            });
                                            return;
                                        }
                                        handleSubmit();
                                    }}
                                    disabled={!currentPatient}
                                    style={{ color: '#000000' }}
                                    onMouseEnter={() => showTooltip('schedule-btn')}
                                    onMouseLeave={hideTooltip}
                                >
                                    Schedule Appointment
                                </button>
                                {activeTooltip === 'schedule-btn' && (
                                    <TooltipContainer 
                                        isVisible={true}
                                        style={{
                                            bottom: '-40px',
                                            right: '0px',
                                        }}
                                    >
                                        Save the appointment to the system and notify the patient via email if available
                                    </TooltipContainer>
                                )}
                            </div>
                        </div>
                    </AppointmentFormRef>
                </AppointmentManagementSection>
            </div>

            <div className="appointments-right-section">
                <div className="search-patient-section">
                    <SectionHeader>
                        <h2 className="section-title" style={{ color: '#000000' }}>Search Patient</h2>
                        <HelpButton
                            onMouseEnter={() => showTooltip('search-patient')}
                            onMouseLeave={hideTooltip}
                        >
                            <HelpCircle size={18} />
                        </HelpButton>
                        {activeTooltip === 'search-patient' && (
                            <TooltipContainer 
                                isVisible={true}
                                style={{
                                    top: '40px',
                                    left: '50px',
                                }}
                            >
                                Search for patients by name or patient number. Click "Select" to choose a patient for appointment scheduling.
                            </TooltipContainer>
                        )}
                    </SectionHeader>
                    <div className="search-box">
                        <input 
                            type="text" 
                            placeholder="Search patient..." 
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ color: '#000000' }}
                        />
                        <button 
                            className="search-button" 
                            style={{ color: '#000000' }}
                            onMouseEnter={() => showTooltip('search-button')}
                            onMouseLeave={hideTooltip}
                        >
                            <Search size={20} color="#000000" />
                            Search
                        </button>
                        {activeTooltip === 'search-button' && (
                            <TooltipContainer 
                                isVisible={true}
                                style={{
                                    top: '40px',
                                    right: '20px',
                                }}
                            >
                                Type a name or patient number to filter the list below
                            </TooltipContainer>
                        )}
                    </div>
                    <SearchResultsContainer>
                        <PatientsTable>
                            <thead>
                                <tr>
                                    <th style={{ color: '#000000' }}>Patient No.</th>
                                    <th style={{ color: '#000000' }}>Name</th>
                                    <th style={{ color: '#000000' }}>Contact</th>
                                    <th style={{ color: '#000000' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPatients.map((patient) => (
                                    <tr key={patient.id}>
                                        <td style={{ color: '#000000' }}>{patient.registrationInfo?.registrationNumber || 'N/A'}</td>
                                        <td style={{ color: '#000000' }}>{`${patient.personalInfo?.firstName || ''} ${patient.personalInfo?.lastName || ''}`}</td>
                                        <td style={{ color: '#000000' }}>{patient.contactInfo?.contactNumber}</td>
                                        <td>
                                            <SelectButton 
                                                $isSelected={currentPatient?.id === patient.id}
                                                onClick={() => handlePatientSelect(patient)}
                                                onMouseEnter={() => showTooltip(`select-${patient.id}`)}
                                                onMouseLeave={hideTooltip}
                                            >
                                                {currentPatient?.id === patient.id ? 'Selected' : 'Select'}
                                            </SelectButton>
                                            {activeTooltip === `select-${patient.id}` && (
                                                <TooltipContainer 
                                                    isVisible={true}
                                                    style={{
                                                        top: '0px',
                                                        right: '-100px',
                                                    }}
                                                >
                                                    {currentPatient?.id === patient.id ? 'This patient is currently selected' : 'Select this patient for scheduling'}
                                                </TooltipContainer>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </PatientsTable>
                    </SearchResultsContainer>
                </div>

                <div className="upcoming-appointments-section">
                    <SectionHeader>
                        <h2 className="section-title" style={{ color: '#000000' }}>Upcoming Appointments</h2>
                        <HelpButton
                            onMouseEnter={() => showTooltip('upcoming-appointments')}
                            onMouseLeave={hideTooltip}
                        >
                            <HelpCircle size={18} />
                        </HelpButton>
                        {activeTooltip === 'upcoming-appointments' && (
                            <TooltipContainer 
                                isVisible={true}
                                style={{
                                    top: '40px',
                                    left: '150px',
                                }}
                            >
                                View all upcoming appointments for the selected patient. You can view details or cancel appointments from here.
                            </TooltipContainer>
                        )}
                    </SectionHeader>
                    <div className="appointments-list">
                        <AppointmentsTable>
                            <thead>
                                <tr>
                                    <th style={{ color: '#000000' }}>Date</th>
                                    <th style={{ color: '#000000' }}>Time</th>
                                    <th style={{ color: '#000000' }}>Patient Name</th>
                                    <th style={{ color: '#000000' }}>Description</th>
                                    <th style={{ color: '#000000' }}>Status</th>
                                    <th style={{ color: '#000000' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {getUpcomingAppointments().map((appointment) => (
                                    <tr key={appointment.id}>
                                        <td style={{ color: '#000000' }}>{formatDate(appointment.appointmentDate)}</td>
                                        <td style={{ color: '#000000' }}>{formatTime(appointment.appointmentTime)}</td>
                                        <td style={{ color: '#000000' }}>{appointment.patientName || 'N/A'}</td>
                                        <td style={{ color: '#000000' }}>{appointment.description || 'No description'}</td>
                                        <td>
                                            <span style={{ 
                                                padding: '4px 8px', 
                                                borderRadius: '4px',
                                                backgroundColor: appointment.status === 'pending' ? '#fff3cd' : '#d4edda',
                                                color: '#000000'
                                            }}>
                                                {appointment.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                <button 
                                                    className="view-btn" 
                                                    style={{ color: '#000000' }}
                                                    onClick={() => {
                                                        setSelectedAppointment(appointment);
                                                        setShowOverlay(true);
                                                    }}
                                                    onMouseEnter={() => showTooltip(`view-${appointment.id}`)}
                                                    onMouseLeave={hideTooltip}
                                                >
                                                    View
                                                </button>
                                                {activeTooltip === `view-${appointment.id}` && (
                                                    <TooltipContainer 
                                                        isVisible={true}
                                                        style={{
                                                            top: '0px',
                                                            right: '-100px',
                                                        }}
                                                    >
                                                        View full appointment details
                                                    </TooltipContainer>
                                                )}
                                                <button 
                                                    className="cancel-btn"
                                                    onClick={handleCancelAppointment}
                                                    style={{ color: '#000000' }}
                                                    onMouseEnter={() => showTooltip(`cancel-${appointment.id}`)}
                                                    onMouseLeave={hideTooltip}
                                                >
                                                    Cancel
                                                </button>
                                                {activeTooltip === `cancel-${appointment.id}` && (
                                                    <TooltipContainer 
                                                        isVisible={true}
                                                        style={{
                                                            top: '0px',
                                                            right: '-170px',
                                                        }}
                                                    >
                                                        Cancel this appointment and notify the patient
                                                    </TooltipContainer>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {getUpcomingAppointments().length === 0 && (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center', color: '#000000' }}>
                                            No upcoming appointments found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </AppointmentsTable>
                    </div>
                </div>
            </div>

            {/* Overlay for viewing appointment description */}
            {showOverlay && selectedAppointment && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        background: '#fff',
                        borderRadius: '12px',
                        padding: '32px',
                        minWidth: '320px',
                        maxWidth: '90vw',
                        boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
                        position: 'relative',
                    }}>
                        <h2 style={{marginTop: 0, color: '#000'}}>Appointment Description</h2>
                        <p style={{color: '#333', fontSize: '1.1em'}}>{selectedAppointment.description || 'No description provided.'}</p>
                        <button
                            onClick={() => setShowOverlay(false)}
                            style={{
                                position: 'absolute',
                                top: 12,
                                right: 16,
                                background: '#4dd0e1',
                                color: '#000',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '6px 16px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                fontSize: '1em',
                            }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Appointments;