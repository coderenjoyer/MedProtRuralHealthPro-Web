import React, { useState } from 'react';
import { addPatient } from '../../Firebase/patientOperations';

function PatientInformation({ onRegister, onError }) {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        middleName: '',
        address: {
            street: '',
            barangay: '',
            municipality: '',
            province: '',
            zipcode: ''
        },
        personalInfo: {
            birthdate: '',
            gender: '',
            age: '',
            civilStatus: '',
            employmentStatus: ''
        },
        contactInfo: {
            email: '',
            phoneNumber: ''
        },
        medicalInfo: {
            height: '',
            weight: '',
            bmi: '',
            bloodType: ''
        }
    });

    const validateForm = () => {
        // Required fields validation
        const requiredFields = [
            { field: 'firstName', label: 'First Name' },
            { field: 'lastName', label: 'Last Name' },
            { field: 'address.street', label: 'Street Address' },
            { field: 'address.barangay', label: 'Barangay' },
            { field: 'address.municipality', label: 'Municipality' },
            { field: 'address.province', label: 'Province' },
            { field: 'personalInfo.birthdate', label: 'Birthdate' },
            { field: 'personalInfo.gender', label: 'Gender' },
            { field: 'personalInfo.age', label: 'Age' },
            { field: 'contactInfo.phoneNumber', label: 'Phone Number' }
        ];

        for (const { field, label } of requiredFields) {
            const value = field.includes('.') 
                ? formData[field.split('.')[0]][field.split('.')[1]]
                : formData[field];

            if (!value) {
                onError(`${label} is required`);
                return false;
            }
        }

        // Email validation
        if (formData.contactInfo.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactInfo.email)) {
            onError('Please enter a valid email address');
            return false;
        }

        // Phone number validation
        if (formData.contactInfo.phoneNumber && !/^\+?[\d\s-]{10,}$/.test(formData.contactInfo.phoneNumber)) {
            onError('Please enter a valid phone number');
            return false;
        }

        // Age validation
        const age = parseInt(formData.personalInfo.age);
        if (isNaN(age) || age < 0 || age > 150) {
            onError('Please enter a valid age');
            return false;
        }

        return true;
    };

    const handleInputChange = (e, section, field) => {
        const { value } = e.target;
        if (section) {
            setFormData(prev => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [field]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [field]: value
            }));
        }

        // Calculate BMI when height and weight are both present
        if (section === 'medicalInfo' && (field === 'height' || field === 'weight')) {
            const height = parseFloat(formData.medicalInfo.height);
            const weight = parseFloat(formData.medicalInfo.weight);
            if (!isNaN(height) && !isNaN(weight) && height > 0 && weight > 0) {
                const bmi = (weight / ((height / 100) * (height / 100))).toFixed(2);
                setFormData(prev => ({
                    ...prev,
                    medicalInfo: {
                        ...prev.medicalInfo,
                        bmi
                    }
                }));
            }
        }
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            // Structure the patient data according to the expected format
            const patientData = {
                personalInfo: {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    middleName: formData.middleName,
                    birthdate: formData.personalInfo.birthdate,
                    gender: formData.personalInfo.gender,
                    age: parseInt(formData.personalInfo.age),
                    civilStatus: formData.personalInfo.civilStatus,
                    employmentStatus: formData.personalInfo.employmentStatus
                },
                address: {
                    street: formData.address.street,
                    barangay: formData.address.barangay,
                    municipality: formData.address.municipality,
                    province: formData.address.province,
                    zipcode: formData.address.zipcode
                },
                contactInfo: {
                    email: formData.contactInfo.email,
                    contactNumber: formData.contactInfo.phoneNumber
                },
                medicalInfo: {
                    height: parseFloat(formData.medicalInfo.height) || null,
                    weight: parseFloat(formData.medicalInfo.weight) || null,
                    bmi: parseFloat(formData.medicalInfo.bmi) || null,
                    bloodType: formData.medicalInfo.bloodType
                },
                registrationInfo: {
                    registrationDate: new Date().toISOString(),
                    status: 'active'
                }
            };

            console.log('Submitting patient data:', patientData);
            const result = await addPatient(patientData);
            console.log('Registration result:', result);

            if (result.success) {
                onRegister(result.patientId);
                // Clear form
                setFormData({
                    firstName: '',
                    lastName: '',
                    middleName: '',
                    address: {
                        street: '',
                        barangay: '',
                        municipality: '',
                        province: '',
                        zipcode: ''
                    },
                    personalInfo: {
                        birthdate: '',
                        gender: '',
                        age: '',
                        civilStatus: '',
                        employmentStatus: ''
                    },
                    contactInfo: {
                        email: '',
                        phoneNumber: ''
                    },
                    medicalInfo: {
                        height: '',
                        weight: '',
                        bmi: '',
                        bloodType: ''
                    }
                });
                // Show success message and reload page
                alert('Patient registered successfully!');
                window.location.reload();
            } else {
                onError(result.error || 'Failed to register patient');
            }
        } catch (error) {
            console.error('Registration error:', error);
            onError('Error registering patient: ' + error.message);
        }
    };

    return (
        <div className="patient-information">
            <div className="header-section">
                <h2 className='patient-information-header'>Patient Information</h2>
            </div>
            <div className="patient-info-content">
                <div className="left-section">
                    <h4>Patient Name</h4>
                    <div className="name-group">                        
                        <div className="form-group">
                            <label>Last Name *</label>
                            <input 
                                type="text" 
                                className="form-control light-theme"
                                value={formData.lastName}
                                onChange={(e) => handleInputChange(e, null, 'lastName')}
                                required
                                style={{ backgroundColor: '#ffffff', color: '#000000' }}
                            />
                        </div>
                        <div className="form-group">
                            <label>First Name *</label>
                            <input 
                                type="text" 
                                className="form-control light-theme"
                                value={formData.firstName}
                                onChange={(e) => handleInputChange(e, null, 'firstName')}
                                required
                                style={{ backgroundColor: '#ffffff', color: '#000000' }}
                            />
                        </div>
                        <div className="form-group">
                            <label>Middle Name</label>
                            <input 
                                type="text" 
                                className="form-control light-theme"
                                value={formData.middleName}
                                onChange={(e) => handleInputChange(e, null, 'middleName')}
                                style={{ backgroundColor: '#ffffff', color: '#000000' }}
                            />
                        </div>
                    </div>
                    <h4>Address</h4>
                    <div className="form-group">
                        <label>Street Address/Purok *</label>
                        <input 
                            type="text" 
                            className="form-control light-theme"
                            value={formData.address.street}
                            onChange={(e) => handleInputChange(e, 'address', 'street')}
                            required
                            style={{ backgroundColor: '#ffffff', color: '#000000' }}
                        />
                    </div>

                    <div className="form-group">
                        <label>Barangay *</label>
                        <select 
                            className="form-control light-theme"
                            value={formData.address.barangay}
                            onChange={(e) => handleInputChange(e, 'address', 'barangay')}
                            required
                            style={{ backgroundColor: '#ffffff', color: '#000000' }}
                        >
                            <option value="">Select Barangay</option>
                            <option value="Poblacion">Poblacion</option>
                            <option value="Compostela">Compostela</option>
                            <option value="Legaspi">Legaspi</option>
                            <option value="Sta. Filomena">Sta. Filomena</option>
                            <option value="Montpeller">Montpeller</option>
                            <option value="Madridejos">Madridejos</option>
                            <option value="Lepanto">Lepanto</option>
                            <option value="Valencia">Valencia</option>
                            <option value="Guadalupe">Guadalupe</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Municipality *</label>
                        <input 
                            type="text" 
                            className="form-control light-theme"
                            value={formData.address.municipality}
                            onChange={(e) => handleInputChange(e, 'address', 'municipality')}
                            required
                            style={{ backgroundColor: '#ffffff', color: '#000000' }}
                        />
                    </div>

                    <div className="form-group">
                        <label>Province *</label>
                        <input 
                            type="text" 
                            className="form-control light-theme"
                            value={formData.address.province}
                            onChange={(e) => handleInputChange(e, 'address', 'province')}
                            required
                            style={{ backgroundColor: '#ffffff', color: '#000000' }}
                        />
                    </div>

                    <div className="form-group">
                        <label>Zipcode</label>
                        <input 
                            type="text" 
                            className="form-control light-theme"
                            value={formData.address.zipcode}
                            onChange={(e) => handleInputChange(e, 'address', 'zipcode')}
                            style={{ backgroundColor: '#ffffff', color: '#000000' }}
                        />
                    </div>

                    <div className="form-group">
                        <label>Birthdate *</label>
                        <input 
                            type="date" 
                            className="form-control light-theme"
                            value={formData.personalInfo.birthdate}
                            onChange={(e) => handleInputChange(e, 'personalInfo', 'birthdate')}
                            required
                            style={{ backgroundColor: '#ffffff', color: '#000000' }}
                        />
                    </div>

                    <div className="form-group">
                        <label>Gender *</label>
                        <select 
                            className="form-control light-theme"
                            value={formData.personalInfo.gender}
                            onChange={(e) => handleInputChange(e, 'personalInfo', 'gender')}
                            required
                            style={{ backgroundColor: '#ffffff', color: '#000000' }}
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Age *</label>
                        <input 
                            type="number" 
                            className="form-control light-theme"
                            value={formData.personalInfo.age}
                            onChange={(e) => handleInputChange(e, 'personalInfo', 'age')}
                            required
                            min="0"
                            max="150"
                            style={{ backgroundColor: '#ffffff', color: '#000000' }}
                        />
                    </div>
                    <h4 className='contact-information-header'>Contact Information</h4>
                    <div className="contact-group">
                        <div className="form-group">
                            <label>Email Address</label>
                            <input 
                                type="email" 
                                className="form-control light-theme"
                                value={formData.contactInfo.email}
                                onChange={(e) => handleInputChange(e, 'contactInfo', 'email')}
                                style={{ backgroundColor: '#ffffff', color: '#000000' }}
                            />
                        </div>
                        <div className="form-group">
                            <label>Phone Number *</label>
                            <input 
                                type="tel" 
                                className="form-control light-theme"
                                value={formData.contactInfo.phoneNumber}
                                onChange={(e) => handleInputChange(e, 'contactInfo', 'phoneNumber')}
                                required
                                style={{ backgroundColor: '#ffffff', color: '#000000' }}
                            />
                        </div>
                    </div>

                    <div className='civil-and-employment-status'>
                        <div className="form-group-small">
                            <label>Civil Status</label>
                            <select 
                                className="form-control light-theme"
                                value={formData.personalInfo.civilStatus}
                                onChange={(e) => handleInputChange(e, 'personalInfo', 'civilStatus')}
                                style={{ backgroundColor: '#ffffff', color: '#000000' }}
                            >
                                <option value="">Select Status</option>
                                <option value="single">Single</option>
                                <option value="married">Married</option>
                                <option value="widowed">Widowed</option>
                                <option value="divorced">Divorced</option>
                            </select>
                        </div>

                        <div className="form-group-small">
                            <label>Employment Status</label>
                            <select 
                                className="form-control light-theme"
                                value={formData.personalInfo.employmentStatus}
                                onChange={(e) => handleInputChange(e, 'personalInfo', 'employmentStatus')}
                                style={{ backgroundColor: '#ffffff', color: '#000000' }}
                            >
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
                            <input 
                                type="number" 
                                className="form-control light-theme"
                                value={formData.medicalInfo.height}
                                onChange={(e) => handleInputChange(e, 'medicalInfo', 'height')}
                                min="0"
                                step="0.1"
                                style={{ backgroundColor: '#ffffff', color: '#000000' }}
                            />
                        </div>
                        <div className="form-group">
                            <label>Weight (kg)</label>
                            <input 
                                type="number" 
                                className="form-control light-theme"
                                value={formData.medicalInfo.weight}
                                onChange={(e) => handleInputChange(e, 'medicalInfo', 'weight')}
                                min="0"
                                step="0.1"
                                style={{ backgroundColor: '#ffffff', color: '#000000' }}
                            />
                        </div>
                        <div className="form-group">
                            <label>BMI</label>
                            <input 
                                type="number" 
                                className="form-control light-theme" 
                                disabled
                                value={formData.medicalInfo.bmi}
                                style={{ backgroundColor: '#ffffff', color: '#000000' }}
                            />
                        </div>
                        <div className="form-group-small">
                            <label>Blood Type</label>
                            <select 
                                className="form-control light-theme"
                                value={formData.medicalInfo.bloodType}
                                onChange={(e) => handleInputChange(e, 'medicalInfo', 'bloodType')}
                                style={{ backgroundColor: '#ffffff', color: '#000000' }}
                            >
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
            <div className="form-actions">
                <button className="btn-register" onClick={handleSubmit}>
                    Register Patient
                </button>
            </div>
        </div>
    );
}

export default PatientInformation;