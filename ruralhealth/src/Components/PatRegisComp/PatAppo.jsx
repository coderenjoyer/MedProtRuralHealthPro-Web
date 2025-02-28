import React, { useState } from 'react';
import Calendar from 'react-calendar';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import 'react-calendar/dist/Calendar.css';

function Appointments() {
    const [isCalendarCollapsed, setIsCalendarCollapsed] = useState(false);

    return (
        <div className="appointments-container">
            {/* Left section - existing appointment management */}
            <div className="appointment-management">
                <div className="header-section">
                    <h2 className="section-title">Appointment Management</h2>
                    <div className="patient-number">
                        <label>Patient No.</label>
                        <input type="text" className="form-control" disabled />
                    </div>
                </div>

                <div className="calendar-wrapper">
                    <button 
                        className="calendar-toggle"
                        onClick={() => setIsCalendarCollapsed(!isCalendarCollapsed)}
                    >
                        {isCalendarCollapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                        Calendar
                    </button>
                    <div className={`calendar-section ${isCalendarCollapsed ? 'collapsed' : ''}`}>
                        <Calendar className="small-calendar" />
                    </div>
                </div>

                <div className="appointment-form">
                    <h3>Patient Information</h3>
                    
                    <div className="name-fields">
                        <div className="form-group">
                            <label>Last Name</label>
                            <input type="text" className="form-control" />
                        </div>

                        <div className="form-group">
                            <label>First Name</label>
                            <input type="text" className="form-control" />
                        </div>

                        <div className="form-group">
                            <label>Middle Name</label>
                            <input type="text" className="form-control" />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" className="form-control" />
                    </div>

                    <div className="form-group">
                        <label>Phone Number</label>
                        <input type="tel" className="form-control" />
                    </div>

                    <div className="form-group">
                        <label>Appointment Date</label>
                        <input type="date" className="form-control" />
                    </div>

                    <div className="form-group">
                        <label>Appointment Time</label>
                        <input type="time" className="form-control" />
                    </div>

                    <div className="form-group">
                        <label>Appointment Description</label>
                        <textarea className="form-control" rows="3"></textarea>
                    </div>

                    <div className="button-group">
                        <button className="btn clear-btn">Clear Appointment</button>
                        <button className="btn confirm-btn">Confirm Appointment</button>
                    </div>
                </div>
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
                        />
                        <button className="search-button">
                            <Search size={20} />
                            Search
                        </button>
                    </div>
                    <div className="search-results">
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
                                <tr>
                                    <td>P001</td>
                                    <td>John Doe</td>
                                    <td>123-456-7890</td>
                                    <td>
                                        <button className="select-btn">Select</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Upcoming Appointments Section */}
                <div className="upcoming-appointments-section">
                    <h2 className="section-title">Upcoming Appointments</h2>
                    <div className="appointments-list">
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
                                <tr>
                                    <td>2025-02-15</td>
                                    <td>10:00 AM</td>
                                    <td>Regular Checkup</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="view-btn">View</button>
                                            <button className="cancel-btn">Cancel</button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Appointments;