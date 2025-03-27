import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import { ref, onValue, push, update, remove } from 'firebase/database';
import { database } from '../../Firebase/firebase';
import { toast } from 'react-toastify';
import 'react-calendar/dist/Calendar.css';
import styled from 'styled-components';

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
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    // Handle patient selection
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

    // Load patient data when selected
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

    // Load appointments from Firebase
    useEffect(() => {
        const patient = localSelectedPatient || selectedPatient;
        if (patient) {
            const appointmentsRef = ref(database, `rhp/patients/${patient.id}/appointments`);
            const unsubscribe = onValue(appointmentsRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    const appointmentsList = Object.entries(data).map(([id, appointment]) => ({
                        id,
                        ...appointment,
                    }));
                    // Sort appointments by date and time
                    const sortedAppointments = appointmentsList.sort((a, b) => {
                        const dateA = new Date(`${a.appointmentDate}T${a.appointmentTime}`);
                        const dateB = new Date(`${b.appointmentDate}T${b.appointmentTime}`);
                        return dateA - dateB;
                    });
                    setAppointments(sortedAppointments);
                } else {
                    setAppointments([]);
                }
            });

            return () => unsubscribe();
        }
    }, [localSelectedPatient, selectedPatient]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!selectedPatient) {
            toast.error("Please select a patient first");
            setIsSubmitting(false);
            return;
        }

        if (!formData.appointmentDate || !formData.appointmentTime) {
            toast.error("Please select both date and time for the appointment");
            setIsSubmitting(false);
            return;
        }

        try {
            const appointmentsRef = ref(database, `rhp/patients/${selectedPatient.id}/appointments`);
            const newAppointmentRef = push(appointmentsRef);
            
            await update(newAppointmentRef, {
                patientId: selectedPatient.id,
                patientName: `${selectedPatient.personalInfo.firstName} ${selectedPatient.personalInfo.lastName}`,
                appointmentDate: formData.appointmentDate,
                appointmentTime: formData.appointmentTime,
                description: formData.description,
                createdAt: new Date().toISOString(),
                status: 'pending'
            });

            // Update patient's last visit
            const patientRef = ref(database, `rhp/patients/${selectedPatient.id}`);
            await update(patientRef, {
                'registrationInfo.lastVisit': new Date().toISOString()
            });

            toast.success("Appointment scheduled successfully");
            handleClear();
        } catch (error) {
            console.error("Error scheduling appointment:", error);
            toast.error("Failed to schedule appointment");
        } finally {
            setIsSubmitting(false);
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

    const handleCancelAppointment = async (appointmentId) => {
        try {
            const appointmentRef = ref(database, `rhp/patients/${selectedPatient.id}/appointments/${appointmentId}`);
            await remove(appointmentRef);
            toast.success("Appointment cancelled successfully");
        } catch (error) {
            console.error("Error cancelling appointment:", error);
            toast.error("Failed to cancel appointment");
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

    const validateForm = () => {
        const errors = {};
        let isValid = true;

        // Required fields
        if (!formData.firstName.trim()) {
            errors.firstName = "First name is required";
            isValid = false;
        } else if (!/^[A-Za-z\s\-'\.]+$/.test(formData.firstName)) {
            errors.firstName = "First name contains invalid characters";
            isValid = false;
        }

        if (!formData.lastName.trim()) {
            errors.lastName = "Last name is required";
            isValid = false;
        } else if (!/^[A-Za-z\s\-'\.]+$/.test(formData.lastName)) {
            errors.lastName = "Last name contains invalid characters";
            isValid = false;
        }

        if (formData.middleName && !/^[A-Za-z\s\-'\.]*$/.test(formData.middleName)) {
            errors.middleName = "Middle name contains invalid characters";
            isValid = false;
        }

        // Email validation (if provided)
        if (formData.email && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
            errors.email = "Invalid email format";
            isValid = false;
        }

        // Phone validation
        if (!formData.phoneNumber) {
            errors.phoneNumber = "Phone number is required";
            isValid = false;
        } else if (!/^(\+63|0)[\d\s\-]{9,}$/.test(formData.phoneNumber)) {
            errors.phoneNumber = "Please enter a valid Philippine phone number";
            isValid = false;
        }

        // Date validation
        if (!formData.appointmentDate) {
            errors.appointmentDate = "Appointment date is required";
            isValid = false;
        } else {
            const selectedDate = new Date(formData.appointmentDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate < today) {
                errors.appointmentDate = "Appointment date cannot be in the past";
                isValid = false;
            }
            
            const oneYearFromNow = new Date();
            oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
            
            if (selectedDate > oneYearFromNow) {
                errors.appointmentDate = "Appointment date cannot be more than a year in the future";
                isValid = false;
            }
        }

        // Time validation
        if (!formData.appointmentTime) {
            errors.appointmentTime = "Appointment time is required";
            isValid = false;
        } else {
            const [hours, minutes] = formData.appointmentTime.split(':').map(Number);
            
            // Check if appointment is within business hours (8 AM to 5 PM)
            if (hours < 8 || hours > 17 || (hours === 17 && minutes > 0)) {
                errors.appointmentTime = "Appointments are only available between 8:00 AM and 5:00 PM";
                isValid = false;
            }
            
            // Check for past time if appointment is today
            if (formData.appointmentDate === new Date().toISOString().split('T')[0]) {
                const now = new Date();
                const appointmentTime = new Date();
                appointmentTime.setHours(hours, minutes, 0, 0);
                
                if (appointmentTime < now) {
                    errors.appointmentTime = "Appointment time cannot be in the past";
                    isValid = false;
                }
            }
        }

        // Description validation
        if (!formData.description.trim()) {
            errors.description = "Appointment description is required";
            isValid = false;
        } else if (formData.description.length > 500) {
            errors.description = "Description is too long (maximum 500 characters)";
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
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
                            <form className="appointment-form" onSubmit={handleSubmit}>
                                <h3>Patient Information</h3>
                                
                                <div className="name-fields">
                                    <div className="form-group">
                                        <label>Last Name *</label>
                                        <input 
                                            type="text" 
                                            name="lastName"
                                            className={`form-control ${formErrors.lastName ? 'is-invalid' : ''}`}
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            required 
                                            pattern="^[A-Za-z\s\-'\.]+$"
                                            title="Only letters, spaces, hyphens, apostrophes, and periods are allowed"
                                            style={{ backgroundColor: '#ffffff', color: '#000000' }}
                                        />
                                        {formErrors.lastName && (
                                            <div className="invalid-feedback">{formErrors.lastName}</div>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <label>First Name *</label>
                                        <input 
                                            type="text" 
                                            name="firstName"
                                            className={`form-control ${formErrors.firstName ? 'is-invalid' : ''}`}
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            required
                                            pattern="^[A-Za-z\s\-'\.]+$"
                                            title="Only letters, spaces, hyphens, apostrophes, and periods are allowed"
                                            style={{ backgroundColor: '#ffffff', color: '#000000' }}
                                        />
                                        {formErrors.firstName && (
                                            <div className="invalid-feedback">{formErrors.firstName}</div>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <label>Middle Name</label>
                                        <input 
                                            type="text" 
                                            name="middleName"
                                            className={`form-control ${formErrors.middleName ? 'is-invalid' : ''}`}
                                            value={formData.middleName}
                                            onChange={handleInputChange}
                                            pattern="^[A-Za-z\s\-'\.]*$"
                                            title="Only letters, spaces, hyphens, apostrophes, and periods are allowed"
                                            style={{ backgroundColor: '#ffffff', color: '#000000' }}
                                        />
                                        {formErrors.middleName && (
                                            <div className="invalid-feedback">{formErrors.middleName}</div>
                                        )}
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Email</label>
                                    <input 
                                        type="email" 
                                        name="email"
                                        className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="example@email.com"
                                        pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                                        title="Please enter a valid email address"
                                        style={{ backgroundColor: '#ffffff', color: '#000000' }}
                                    />
                                    {formErrors.email && (
                                        <div className="invalid-feedback">{formErrors.email}</div>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label>Phone Number *</label>
                                    <input 
                                        type="tel" 
                                        name="phoneNumber"
                                        className={`form-control ${formErrors.phoneNumber ? 'is-invalid' : ''}`}
                                        value={formData.phoneNumber}
                                        onChange={handleInputChange}
                                        placeholder="+63 XXX XXX XXXX"
                                        pattern="^(\+63|0)[\d\s\-]{9,}$"
                                        title="Please enter a valid Philippine phone number (e.g., +63 XXX XXX XXXX or 09XX XXX XXXX)"
                                        required
                                        style={{ backgroundColor: '#ffffff', color: '#000000' }}
                                    />
                                    {formErrors.phoneNumber && (
                                        <div className="invalid-feedback">{formErrors.phoneNumber}</div>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label>Appointment Date *</label>
                                    <input 
                                        type="date" 
                                        name="appointmentDate"
                                        className={`form-control ${formErrors.appointmentDate ? 'is-invalid' : ''}`}
                                        value={formData.appointmentDate}
                                        onChange={handleInputChange}
                                        min={new Date().toISOString().split('T')[0]}
                                        max={new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]} // Max 1 year in future
                                        required
                                        style={{ backgroundColor: '#ffffff', color: '#000000' }}
                                    />
                                    {formErrors.appointmentDate && (
                                        <div className="invalid-feedback">{formErrors.appointmentDate}</div>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label>Appointment Time *</label>
                                    <input 
                                        type="time" 
                                        name="appointmentTime"
                                        className={`form-control ${formErrors.appointmentTime ? 'is-invalid' : ''}`}
                                        value={formData.appointmentTime}
                                        onChange={handleInputChange}
                                        min="08:00"
                                        max="17:00"
                                        step="1800" // 30-minute intervals
                                        required
                                        style={{ backgroundColor: '#ffffff', color: '#000000' }}
                                    />
                                    {formErrors.appointmentTime && (
                                        <div className="invalid-feedback">{formErrors.appointmentTime}</div>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label>Appointment Description *</label>
                                    <textarea 
                                        name="description"
                                        className={`form-control ${formErrors.description ? 'is-invalid' : ''}`}
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows="3"
                                        required
                                        maxLength="500"
                                        style={{ backgroundColor: '#ffffff', color: '#000000' }}
                                    ></textarea>
                                    {formErrors.description && (
                                        <div className="invalid-feedback">{formErrors.description}</div>
                                    )}
                                </div>
                                
                                {/* Buttons section */}
                                <div className="button-group">
                                    <button 
                                        type="button" 
                                        className="btn clear-btn" 
                                        onClick={handleClear}
                                    >
                                        Clear Appointment
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="btn confirm-btn"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Processing...' : 'Confirm Appointment'}
                                    </button>
                                </div>
                            </form>
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
                                                        // Handle view appointment details
                                                        console.log('View appointment:', appointment);
                                                    }}
                                                >
                                                    View
                                                </button>
                                                <button 
                                                    className="cancel-btn"
                                                    onClick={() => handleCancelAppointment(appointment.id)}
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
        </div>
    );
}

export default Appointments;