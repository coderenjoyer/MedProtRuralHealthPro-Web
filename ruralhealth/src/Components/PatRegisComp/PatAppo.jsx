import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import 'react-calendar/dist/Calendar.css';

function Appointments() {
    const [isCalendarCollapsed, setIsCalendarCollapsed] = useState(false);
    const [appointmentForm, setAppointmentForm] = useState({
        patientNo: '',
        lastName: '',
        firstName: '',
        middleName: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        description: ''
    });
    const [formErrors, setFormErrors] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Mock data for patients and appointments
    const [patients, setPatients] = useState([
        { id: 'P001', name: 'John Doe', contact: '123-456-7890' }
    ]);
    const [appointments, setAppointments] = useState([
        { id: 1, date: '2025-02-15', time: '10:00 AM', description: 'Regular Checkup' }
    ]);

    useEffect(() => {
        // Clear success/error messages after 5 seconds
        if (submitMessage.text) {
            const timer = setTimeout(() => {
                setSubmitMessage({ type: '', text: '' });
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [submitMessage]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAppointmentForm(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when field is edited
        if (formErrors[name]) {
            setFormErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const validateForm = () => {
        const errors = {};
        let isValid = true;

        // Required fields validation
        const requiredFields = [
            { field: 'firstName', label: 'First Name' },
            { field: 'lastName', label: 'Last Name' },
            { field: 'phone', label: 'Phone Number' },
            { field: 'date', label: 'Appointment Date' },
            { field: 'time', label: 'Appointment Time' },
            { field: 'description', label: 'Appointment Description' }
        ];

        for (const { field, label } of requiredFields) {
            if (!appointmentForm[field]) {
                errors[field] = `${label} is required`;
                isValid = false;
            }
        }

        // Email validation if provided
        if (appointmentForm.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(appointmentForm.email)) {
            errors.email = 'Please enter a valid email address';
            isValid = false;
        }

        // Phone validation
        if (appointmentForm.phone && !/^\+?[\d\s-]{10,}$/.test(appointmentForm.phone)) {
            errors.phone = 'Please enter a valid phone number (at least 10 digits)';
            isValid = false;
        }

        // Date validation
        if (appointmentForm.date) {
            const selectedDate = new Date(appointmentForm.date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (selectedDate < today) {
                errors.date = 'Appointment date cannot be in the past';
                isValid = false;
            }
        }

        // Time validation
        if (appointmentForm.date && appointmentForm.time) {
            const selectedDate = new Date(appointmentForm.date);
            const [hours, minutes] = appointmentForm.time.split(':');
            selectedDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
            
            const now = new Date();
            
            if (selectedDate < now) {
                errors.time = 'Appointment time cannot be in the past';
                isValid = false;
            }
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (isSubmitting) {
            return; // Prevent multiple submissions
        }

        if (!validateForm()) {
            setSubmitMessage({ 
                type: 'error', 
                text: 'Please correct the errors in the form' 
            });
            return;
        }

        setIsSubmitting(true);

        // Simulate appointment creation with a delay
        setTimeout(() => {
            try {
                // In a real app, this would be an API call
                const newAppointment = {
                    id: appointments.length + 1,
                    date: appointmentForm.date,
                    time: appointmentForm.time,
                    description: appointmentForm.description,
                    patientInfo: {
                        id: appointmentForm.patientNo || `P${Math.floor(Math.random() * 1000)}`,
                        name: `${appointmentForm.firstName} ${appointmentForm.middleName ? appointmentForm.middleName + ' ' : ''}${appointmentForm.lastName}`,
                        contact: appointmentForm.phone
                    }
                };

                setAppointments([...appointments, newAppointment]);
                setSubmitMessage({ 
                    type: 'success', 
                    text: 'Appointment confirmed successfully!' 
                });

                // Clear form
                setAppointmentForm({
                    patientNo: '',
                    lastName: '',
                    firstName: '',
                    middleName: '',
                    email: '',
                    phone: '',
                    date: '',
                    time: '',
                    description: ''
                });
            } catch (error) {
                console.error('Error creating appointment:', error);
                setSubmitMessage({ 
                    type: 'error', 
                    text: `Error creating appointment: ${error.message || 'Unknown error'}` 
                });
            } finally {
                setIsSubmitting(false);
            }
        }, 1000);
    };

    const handleClearForm = () => {
        setAppointmentForm({
            patientNo: '',
            lastName: '',
            firstName: '',
            middleName: '',
            email: '',
            phone: '',
            date: '',
            time: '',
            description: ''
        });
        setFormErrors({});
        setSubmitMessage({ type: '', text: '' });
    };

    const handleCalendarChange = (value) => {
        setSelectedDate(value);
        // Format date as YYYY-MM-DD
        const formattedDate = value.toISOString().split('T')[0];
        setAppointmentForm(prev => ({
            ...prev,
            date: formattedDate
        }));
        
        // Clear date error if exists
        if (formErrors.date) {
            setFormErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.date;
                return newErrors;
            });
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handlePatientSelect = (patient) => {
        setAppointmentForm(prev => ({
            ...prev,
            patientNo: patient.id,
            firstName: patient.name.split(' ')[0],
            lastName: patient.name.split(' ').pop(),
            phone: patient.contact
        }));
    };

    const handleCancelAppointment = (id) => {
        try {
            if (window.confirm('Are you sure you want to cancel this appointment?')) {
                setAppointments(appointments.filter(app => app.id !== id));
                setSubmitMessage({ 
                    type: 'success', 
                    text: 'Appointment cancelled successfully' 
                });
            }
        } catch (error) {
            console.error('Error cancelling appointment:', error);
            setSubmitMessage({ 
                type: 'error', 
                text: `Error cancelling appointment: ${error.message || 'Unknown error'}` 
            });
        }
    };

    const filteredPatients = patients.filter(patient => 
        searchTerm === '' || 
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="appointments-container">
            {/* Left section - existing appointment management */}
            <div className="appointment-management">
                <div className="header-section">
                    <h2 className="section-title">Appointment Management</h2>
                    <div className="patient-number">
                        <label>Patient No.</label>
                        <input 
                            type="text" 
                            name="patientNo"
                            className="form-control" 
                            value={appointmentForm.patientNo}
                            onChange={handleInputChange}
                            disabled={appointmentForm.patientNo !== ''}
                        />
                    </div>
                </div>

                {submitMessage.text && (
                    <div className={`message-container ${submitMessage.type}`}>
                        {submitMessage.text}
                    </div>
                )}

                <div className="calendar-wrapper">
                    <button 
                        className="calendar-toggle"
                        onClick={() => setIsCalendarCollapsed(!isCalendarCollapsed)}
                    >
                        {isCalendarCollapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                        Calendar
                    </button>
                    <div className={`calendar-section ${isCalendarCollapsed ? 'collapsed' : ''}`}>
                        <Calendar 
                            className="small-calendar" 
                            value={selectedDate}
                            onChange={handleCalendarChange}
                            minDate={new Date()}
                        />
                    </div>
                </div>

                <form className="appointment-form" onSubmit={handleSubmit}>
                    <h3>Patient Information</h3>
                    
                    <div className="name-fields">
                        <div className="form-group">
                            <label>Last Name *</label>
                            <input 
                                type="text" 
                                name="lastName"
                                className={`form-control ${formErrors.lastName ? 'is-invalid' : ''}`}
                                value={appointmentForm.lastName}
                                onChange={handleInputChange}
                                required 
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
                                value={appointmentForm.firstName}
                                onChange={handleInputChange}
                                required
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
                                className="form-control"
                                value={appointmentForm.middleName}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input 
                            type="email" 
                            name="email"
                            className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
                            value={appointmentForm.email}
                            onChange={handleInputChange}
                            placeholder="example@email.com"
                        />
                        {formErrors.email && (
                            <div className="invalid-feedback">{formErrors.email}</div>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Phone Number *</label>
                        <input 
                            type="tel" 
                            name="phone"
                            className={`form-control ${formErrors.phone ? 'is-invalid' : ''}`}
                            value={appointmentForm.phone}
                            onChange={handleInputChange}
                            placeholder="+63 XXX XXX XXXX"
                            required
                        />
                        {formErrors.phone && (
                            <div className="invalid-feedback">{formErrors.phone}</div>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Appointment Date *</label>
                        <input 
                            type="date" 
                            name="date"
                            className={`form-control ${formErrors.date ? 'is-invalid' : ''}`}
                            value={appointmentForm.date}
                            onChange={handleInputChange}
                            min={new Date().toISOString().split('T')[0]}
                            required
                        />
                        {formErrors.date && (
                            <div className="invalid-feedback">{formErrors.date}</div>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Appointment Time *</label>
                        <input 
                            type="time" 
                            name="time"
                            className={`form-control ${formErrors.time ? 'is-invalid' : ''}`}
                            value={appointmentForm.time}
                            onChange={handleInputChange}
                            required
                        />
                        {formErrors.time && (
                            <div className="invalid-feedback">{formErrors.time}</div>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Appointment Description *</label>
                        <textarea 
                            name="description"
                            className={`form-control ${formErrors.description ? 'is-invalid' : ''}`}
                            value={appointmentForm.description}
                            onChange={handleInputChange}
                            rows="3"
                            required
                        ></textarea>
                        {formErrors.description && (
                            <div className="invalid-feedback">{formErrors.description}</div>
                        )}
                    </div>

                    <div className="button-group">
                        <button 
                            type="button" 
                            className="btn clear-btn" 
                            onClick={handleClearForm}
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

            {/* Right sections */}
            <div className="appointments-right-section">
                {/* Search Patient Section */}
                <div className="search-patient-section">
                    <h2 className="section-title">Search Patient</h2>
                    <div className="search-box">
                        <input 
                            type="text" 
                            placeholder="Search patient..." 
                            className="search-input"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                        <button className="search-button">
                            <Search size={20} />
                            Search
                        </button>
                    </div>
                    <div className="search-results">
                        {filteredPatients.length === 0 ? (
                            <div className="no-results">No patients found</div>
                        ) : (
                            <table className="patients-table">
                                <thead>
                                    <tr>
                                        <th>Patient No.</th>
                                        <th>Name</th>
                                        <th>Contact</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredPatients.map(patient => (
                                        <tr key={patient.id}>
                                            <td>{patient.id}</td>
                                            <td>{patient.name}</td>
                                            <td>{patient.contact}</td>
                                            <td>
                                                <button 
                                                    className="select-btn"
                                                    onClick={() => handlePatientSelect(patient)}
                                                >
                                                    Select
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Upcoming Appointments Section */}
                <div className="upcoming-appointments-section">
                    <h2 className="section-title">Upcoming Appointments</h2>
                    <div className="appointments-list">
                        {appointments.length === 0 ? (
                            <div className="no-appointments">No upcoming appointments</div>
                        ) : (
                            <table className="appointments-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Time</th>
                                        <th>Description</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {appointments.map(appointment => (
                                        <tr key={appointment.id}>
                                            <td>{appointment.date}</td>
                                            <td>{appointment.time}</td>
                                            <td>{appointment.description}</td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button className="view-btn">View</button>
                                                    <button 
                                                        className="cancel-btn"
                                                        onClick={() => handleCancelAppointment(appointment.id)}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
            
            <style jsx>{`
                .is-invalid {
                    border-color: #dc3545 !important;
                    background-color: #fff8f8 !important;
                }
                
                .invalid-feedback {
                    color: #dc3545;
                    font-size: 0.85em;
                    margin-top: 4px;
                }
                
                .message-container {
                    padding: 10px;
                    border-radius: 4px;
                    margin-bottom: 15px;
                    text-align: center;
                }
                
                .message-container.success {
                    background-color: #d4edda;
                    color: #155724;
                    border: 1px solid #c3e6cb;
                }
                
                .message-container.error {
                    background-color: #f8d7da;
                    color: #721c24;
                    border: 1px solid #f5c6cb;
                }
                
                .no-results, .no-appointments {
                    padding: 20px;
                    text-align: center;
                    background-color: #f8f9fa;
                    border-radius: 4px;
                    color: #6c757d;
                }
            `}</style>
        </div>
    );
}

export default Appointments;