import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import { ref, onValue, push, update, remove, get, set } from 'firebase/database';
import { database } from '../../Firebase/firebase';
import { toast } from 'react-toastify';
import 'react-calendar/dist/Calendar.css';
import styled from 'styled-components';
import emailjs from '@emailjs/browser';
import { EMAIL_CONFIG } from '../../config/emailConfig';

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
        
          // Confirmation dialog
          const confirmSchedule = window.confirm("Are you sure you want to schedule this appointment?");
          if (!confirmSchedule) {
            return; // Exit if the user cancels
          }
        
          // Error handling for missing patient
          if (!currentPatient) {
            toast.error("Please select a patient first");
            return;
          }
        
          // Error handling for missing required fields
          if (!formData.appointmentDate || !formData.appointmentTime || !formData.description) {
            toast.error("Please fill out all required fields (date, time, and description)");
            return;
        }

        // Create confirmation message
        const confirmationMessage = `
Please confirm the following appointment details:

Patient Information:
------------------
Name: ${formData.lastName}, ${formData.firstName} ${formData.middleName}
Email: ${formData.email || 'Not provided'}

Appointment Details:
------------------
Date: ${formData.appointmentDate}
Time: ${formData.appointmentTime}
Description: ${formData.description || 'No description provided'}

Do you want to proceed with scheduling this appointment?`;

        // Show confirmation dialog
        const isConfirmed = window.confirm(confirmationMessage);
        if (!isConfirmed) {
            return;
        }

        try {
          }
        
          try {
            const appointmentsRef = ref(database, `rhp/patients/${currentPatient.id}/appointments`);
            const appointmentData = {
                patientId: currentPatient.id,
                patientNumber: currentPatient.registrationInfo?.registrationNumber || 'N/A',
                patientName: `${currentPatient.personalInfo.firstName} ${currentPatient.personalInfo.lastName}`,
                contactInfo: {
                    phoneNumber: currentPatient.contactInfo?.phoneNumber || currentPatient.contactInfo?.contactNumber || 'N/A',
                    contactNumber: currentPatient.contactInfo?.contactNumber || currentPatient.contactInfo?.phoneNumber || 'N/A',
                    email: currentPatient.contactInfo?.email || 'N/A'
                },
                appointmentDate: formData.appointmentDate,
                appointmentTime: formData.appointmentTime,
                description: formData.description,
                createdAt: new Date().toISOString(),
                status: 'pending'
            };

            await set(appointmentsRef, appointmentData);
            console.log('Appointment set in database');
            
            const newAppointmentRef = push(appointmentsRef);
        
            // Save the appointment to Firebase
            await update(newAppointmentRef, {
              patientId: currentPatient.id,
              patientName: `${currentPatient.personalInfo.firstName} ${currentPatient.personalInfo.lastName}`,
              appointmentDate: formData.appointmentDate,
              appointmentTime: formData.appointmentTime,
              description: formData.description,
              createdAt: new Date().toISOString(),
              status: 'pending',
            });
        
            // Update the patient's last visit
            const patientRef = ref(database, `rhp/patients/${currentPatient.id}`);
            await update(patientRef, {
                'registrationInfo.lastVisit': new Date().toISOString(),
                'registrationInfo.nextAppointment': `${formData.appointmentDate}T${formData.appointmentTime}`
            });
            console.log('Patient info updated in database');

            toast.success("Appointment scheduled successfully!", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            try {
                handleClear();
            } catch (clearError) {
                console.error('Error in handleClear:', clearError);
            }
        } catch (error) {
            console.error("Error in handleSubmit:", error);
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
              'registrationInfo.lastVisit': new Date().toISOString(),
            });
        
            toast.success("Appointment scheduled successfully");
            handleClear(); // Clear the form after successful submission
          } catch (error) {
            console.error("Error scheduling appointment:", error);
            toast.error("Failed to schedule appointment. Please try again.");
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

    return (
        <div className="appointments-container">
            <div className="appointment-management">
                <AppointmentManagementSection>
                    <h2 className="section-title" style={{ color: '#000000' }}>Appointment Management</h2>
                    
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
                                        value={
                                            currentPatient.contactInfo?.phoneNumber ||
                                            currentPatient.contactInfo?.contactNumber ||
                                            'N/A'
                                        }
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
                            <h3 style={{ color: '#000000' }}>Schedule Appointment</h3>
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
                                    <label>Appointment Date</label>
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
                                    <label>Appointment Time</label>
                                    <input 
                                        type="time" 
                                        name="appointmentTime"
                                        value={formData.appointmentTime}
                                        onChange={handleInputChange}
                                        disabled={!currentPatient}
                                    />
                                </PatientInfoItem>
                                <PatientInfoItem style={{ gridColumn: '1 / -1' }}>
                                    <label>Appointment Description</label>
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
                                >
                                    Clear
                                </button>
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
                                >
                                    Schedule Appointment
                                </button>
                            </div>
                        </div>
                    </AppointmentFormRef>
                </AppointmentManagementSection>
            </div>

            <div className="appointments-right-section">
                <div className="search-patient-section">
                    <h2 className="section-title" style={{ color: '#000000' }}>Search Patient</h2>
                    <div className="search-box">
                        <input 
                            type="text" 
                            placeholder="Search patient..." 
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ color: '#000000' }}
                        />
                        <button className="search-button" style={{ color: '#000000' }}>
                            <Search size={20} color="#000000" />
                            Search
                        </button>
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
                                            >
                                                {currentPatient?.id === patient.id ? 'Selected' : 'Select'}
                                            </SelectButton>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </PatientsTable>
                    </SearchResultsContainer>
                </div>

                <div className="upcoming-appointments-section">
                    <h2 className="section-title" style={{ color: '#000000' }}>Upcoming Appointments</h2>
                    <div className="appointments-list">
                        <AppointmentsTable>
                            <thead>
                                <tr>
                                    <th style={{ color: '#000000' }}>Patient No.</th>
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
                                        <td style={{ color: '#000000' }}>{appointment.patientNumber || 'N/A'}</td>
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
                                                >
                                                    View
                                                </button>
                                                <button 
                                                    className="cancel-btn"
                                                    onClick={handleCancelAppointment}
                                                    style={{ color: '#000000' }}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {getUpcomingAppointments().length === 0 && (
                                    <tr>
                                        <td colSpan="7" style={{ textAlign: 'center', color: '#000000' }}>
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