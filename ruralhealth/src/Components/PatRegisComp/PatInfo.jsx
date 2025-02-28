import React from 'react';

function PatientInformation() {
    return (
        <div className="patient-information">
            <div className="header-section">
                <h2 className='patient-information-header'>Patient Information</h2>
                <div className="patient-number">
                    <label>Patient No.</label>
                    <input type="text" className="form-control" disabled />
                </div>
            </div>
            <div className="patient-info-content">
                <div className="left-section">
                <h4>Patient Name</h4>
                    <div className="name-group">                        
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
                    <h4>Address</h4>
                    <div className="form-group">
                        <label>Street Address/Purok</label>
                        <input type="text" className="form-control" />
                    </div>

                    <div className="form-group">
                        <label>Barangay</label>
                        <select className="form-control">
                            <option value="">Select Barangay</option>
                            <option value="brgy1">Barangay 1</option>
                            <option value="brgy2">Barangay 2</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Municipality</label>
                        <input type="text" className="form-control" />
                    </div>

                    <div className="form-group">
                        <label>Province</label>
                        <input type="text" className="form-control" />
                    </div>

                    <div className="form-group">
                        <label>Zipcode</label>
                        <input type="text" className="form-control" />
                    </div>

                    <div className="form-group">
                        <label>Birthdate</label>
                        <input type="date" className="form-control" />
                    </div>

                    <div className="form-group">
                        <label>Gender</label>
                        <select className="form-control">
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Age</label>
                        <input type="number" className="form-control" />
                    </div>
                    <h4 className='contact-information-header'>Contact Information</h4>
                    <div className="contact-group">
                        <div className="form-group">
                            <label>Email Address</label>
                            <input type="email" className="form-control" />
                        </div>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input type="tel" className="form-control" />
                        </div>
                    </div>

                    <div className='civil-and-employment-status'>
                    <div className="form-group-small">
                        <label>Civil Status</label>
                        <select className="form-control">
                            <option value="">Select Status</option>
                            <option value="single">Single</option>
                            <option value="married">Married</option>
                            <option value="widowed">Widowed</option>
                            <option value="divorced">Divorced</option>
                        </select>
                    </div>

                    <div className="form-group-small">
                        <label>Employment Status</label>
                        <select className="form-control">
                            <option value="">Select Status</option>
                            <option value="employed">Employed</option>
                            <option value="unemployed">Unemployed</option>
                            <option value="self-employed">Self-Employed</option>
                        </select>
                    </div>
                    </div>
                </div>

                <div className="right-section">
                    <div className="photo-section">
                        <div className="patient-photo">
                            <img src="placeholder.jpg" alt="Patient Photo" />
                        </div>
                        <div className="photo-buttons">
                            <button className="btn-upload">Upload</button>
                            <button className="btn-clear">Clear</button>
                        </div>
                    </div>

                    <div className="medical-info">
                        <h3>Medical Information</h3>
                        <div className="form-group">
                            <label>Height (cm)</label>
                            <input type="number" className="form-control" />
                        </div>
                        <div className="form-group">
                            <label>Weight (kg)</label>
                            <input type="number" className="form-control" />
                        </div>
                        <div className="form-group">
                            <label>BMI</label>
                            <input type="number" className="form-control" disabled />
                        </div>
                        <div className="form-group-small">
                            <label>Blood Type</label>
                            <select className="form-control">
                                <option value="">Select Blood Type</option>
                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B-">B-</option>
                                <option value="O+">O+</option>
                                <option value="O-">O-</option>
                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PatientInformation;