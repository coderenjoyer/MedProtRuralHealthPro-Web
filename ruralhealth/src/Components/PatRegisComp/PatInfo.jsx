import React, { useState, useEffect } from 'react';
import { addPatient, updatePatient } from '../../Firebase/patientOperations';
import { ref, get } from 'firebase/database';
import { database } from '../../Firebase/firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function PatientInformation({ onRegister, onError, selectedPatient }) {
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
    
    // Add validation states to track field-specific errors
    const [validationErrors, setValidationErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    // Load patient data when selectedPatient changes
    useEffect(() => {
        if (selectedPatient) {
            setFormData({
                firstName: selectedPatient.personalInfo?.firstName || '',
                lastName: selectedPatient.personalInfo?.lastName || '',
                middleName: selectedPatient.personalInfo?.middleName || '',
                address: {
                    street: selectedPatient.address?.street || '',
                    barangay: selectedPatient.address?.barangay || '',
                    municipality: selectedPatient.address?.municipality || '',
                    province: selectedPatient.address?.province || '',
                    zipcode: selectedPatient.address?.zipcode || ''
                },
                personalInfo: {
                    birthdate: selectedPatient.personalInfo?.birthdate || '',
                    gender: selectedPatient.personalInfo?.gender || '',
                    age: selectedPatient.personalInfo?.age || '',
                    civilStatus: selectedPatient.personalInfo?.civilStatus || '',
                    employmentStatus: selectedPatient.personalInfo?.employmentStatus || ''
                },
                contactInfo: {
                    email: selectedPatient.contactInfo?.email || '',
                    phoneNumber: selectedPatient.contactInfo?.phoneNumber || ''
                },
                medicalInfo: {
                    height: selectedPatient.medicalInfo?.height || '',
                    weight: selectedPatient.medicalInfo?.weight || '',
                    bmi: selectedPatient.medicalInfo?.bmi || '',
                    bloodType: selectedPatient.medicalInfo?.bloodType || ''
                }
            });
        }
    }, [selectedPatient]);

    const validateForm = () => {
        // Reset validation errors
        const errors = {};
        let isValid = true;

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
                errors[field] = `${label} is required`;
                isValid = false;
            }
        }

        // Email validation - only if email is provided
        if (formData.contactInfo.email) {
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactInfo.email)) {
                errors['contactInfo.email'] = 'Please enter a valid email address';
                isValid = false;
            }
        }

        // Phone number validation
        if (formData.contactInfo.phoneNumber) {
            if (!/^\+?[\d\s-]{10,}$/.test(formData.contactInfo.phoneNumber)) {
                errors['contactInfo.phoneNumber'] = 'Please enter a valid phone number (at least 10 digits)';
                isValid = false;
            }
        }

        // Age validation
        const age = parseInt(formData.personalInfo.age);
        if (isNaN(age) || age < 0 || age > 150) {
            errors['personalInfo.age'] = 'Please enter a valid age (0-150)';
            isValid = false;
        }

        // Birthdate validation
        if (formData.personalInfo.birthdate) {
            const birthdate = new Date(formData.personalInfo.birthdate);
            const today = new Date();
            
            // Check if birthdate is in the future
            if (birthdate > today) {
                errors['personalInfo.birthdate'] = 'Birthdate cannot be in the future';
                isValid = false;
            }
            
            // Calculate age from birthdate and compare with entered age
            if (!isNaN(age)) {
                const birthYear = birthdate.getFullYear();
                const currentYear = today.getFullYear();
                const calculatedAge = currentYear - birthYear;
                
                // Allow 1 year difference due to different months/days
                if (Math.abs(calculatedAge - age) > 1) {
                    errors['personalInfo.age'] = 'Age does not match birthdate';
                    isValid = false;
                }
            }
        }

        // Height and weight validation if provided
        if (formData.medicalInfo.height) {
            const height = parseFloat(formData.medicalInfo.height);
            if (isNaN(height) || height <= 0 || height > 300) {
                errors['medicalInfo.height'] = 'Please enter a valid height (1-300 cm)';
                isValid = false;
            }
        }

        if (formData.medicalInfo.weight) {
            const weight = parseFloat(formData.medicalInfo.weight);
            if (isNaN(weight) || weight <= 0 || weight > 700) {
                errors['medicalInfo.weight'] = 'Please enter a valid weight (1-700 kg)';
                isValid = false;
            }
        }
        
        // BMI validation - check if manually entered BMI matches calculated BMI
        if (formData.medicalInfo.bmi && formData.medicalInfo.height && formData.medicalInfo.weight) {
            const height = parseFloat(formData.medicalInfo.height);
            const weight = parseFloat(formData.medicalInfo.weight);
            const enteredBmi = parseFloat(formData.medicalInfo.bmi);
            
            if (!isNaN(height) && !isNaN(weight) && height > 0 && weight > 0) {
                const calculatedBmi = (weight / ((height / 100) * (height / 100))).toFixed(2);
                
                // Allow small difference due to rounding
                if (Math.abs(enteredBmi - calculatedBmi) > 0.1) {
                    errors['medicalInfo.bmi'] = 'BMI does not match height and weight';
                    isValid = false;
                }
            }
        }

        // Zipcode validation if provided
        if (formData.address.zipcode) {
            if (!/^\d{4,5}$/.test(formData.address.zipcode)) {
                errors['address.zipcode'] = 'Please enter a valid zipcode (4-5 digits)';
                isValid = false;
            }
        }

        setValidationErrors(errors);
        
        if (!isValid) {
            onError(Object.values(errors)[0]); // Show first error in the main error UI
        }
        
        return isValid;
    };

    const handleInputChange = (e, section, field) => {
        const { value } = e.target;
        
        // Clear specific validation error when field is edited
        if (section) {
            const errorKey = `${section}.${field}`;
            if (validationErrors[errorKey]) {
                setValidationErrors(prev => {
                    const updated = {...prev};
                    delete updated[errorKey];
                    return updated;
                });
            }
            
            setFormData(prev => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [field]: value
                }
            }));
        } else {
            if (validationErrors[field]) {
                setValidationErrors(prev => {
                    const updated = {...prev};
                    delete updated[field];
                    return updated;
                });
            }
            
            setFormData(prev => ({
                ...prev,
                [field]: value
            }));
        }

        // Calculate BMI when height and weight are both present
        if (section === 'medicalInfo' && (field === 'height' || field === 'weight')) {
            const height = field === 'height' ? parseFloat(value) : parseFloat(formData.medicalInfo.height);
            const weight = field === 'weight' ? parseFloat(value) : parseFloat(formData.medicalInfo.weight);
            
            if (!isNaN(height) && !isNaN(weight) && height > 0 && weight > 0) {
                const bmi = (weight / ((height / 100) * (height / 100))).toFixed(2);
                setFormData(prev => ({
                    ...prev,
                    medicalInfo: {
                        ...prev.medicalInfo,
                        bmi
                    }
                }));
                
                // Clear BMI validation error if it exists
                if (validationErrors['medicalInfo.bmi']) {
                    setValidationErrors(prev => {
                        const updated = {...prev};
                        delete updated['medicalInfo.bmi'];
                        return updated;
                    });
                }
            }
        }
        
        // Calculate age from birthdate
        if (section === 'personalInfo' && field === 'birthdate') {
            try {
                const birthdate = new Date(value);
                const today = new Date();
                if (birthdate <= today) { // Only calculate if date is valid and not in future
                    const birthYear = birthdate.getFullYear();
                    const currentYear = today.getFullYear();
                    const calculatedAge = currentYear - birthYear;
                    
                    setFormData(prev => ({
                        ...prev,
                        personalInfo: {
                            ...prev.personalInfo,
                            age: calculatedAge.toString()
                        }
                    }));
                    
                    // Clear age validation error if it exists
                    if (validationErrors['personalInfo.age']) {
                        setValidationErrors(prev => {
                            const updated = {...prev};
                            delete updated['personalInfo.age'];
                            return updated;
                        });
                    }
                }
            } catch (error) {
                console.error("Error calculating age:", error);
            }
        }
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        // Create a summary of the patient information for confirmation
        const patientSummary = `
Patient Information Summary:
---------------------------
Name: ${formData.lastName}, ${formData.firstName} ${formData.middleName}
Birth Date: ${formData.personalInfo.birthdate}
Gender: ${formData.personalInfo.gender}
Age: ${formData.personalInfo.age}
Civil Status: ${formData.personalInfo.civilStatus}
Employment Status: ${formData.personalInfo.employmentStatus}

Contact Information:
------------------
Phone: ${formData.contactInfo.phoneNumber}
Email: ${formData.contactInfo.email}

Address:
--------
${formData.address.street}
${formData.address.barangay}
${formData.address.municipality}, ${formData.address.province} ${formData.address.zipcode}

Medical Information:
------------------
Height: ${formData.medicalInfo.height} cm
Weight: ${formData.medicalInfo.weight} kg
BMI: ${formData.medicalInfo.bmi}
Blood Type: ${formData.medicalInfo.bloodType}

Please confirm if the information above is correct.`;

        // Show confirmation dialog
        const isConfirmed = window.confirm(patientSummary);
        if (!isConfirmed) {
            return;
        }

        try {
            setIsSubmitting(true);
            
            // Structure the patient data according to the expected format
            const patientData = {
                personalInfo: {
                    firstName: formData.firstName.trim(),
                    lastName: formData.lastName.trim(),
                    middleName: formData.middleName.trim(),
                    birthdate: formData.personalInfo.birthdate,
                    gender: formData.personalInfo.gender,
                    age: parseInt(formData.personalInfo.age),
                    civilStatus: formData.personalInfo.civilStatus,
                    employmentStatus: formData.personalInfo.employmentStatus
                },
                address: {
                    street: formData.address.street.trim(),
                    barangay: formData.address.barangay,
                    municipality: formData.address.municipality.trim(),
                    province: formData.address.province.trim(),
                    zipcode: formData.address.zipcode
                },
                contactInfo: {
                    email: formData.contactInfo.email.trim(),
                    contactNumber: formData.contactInfo.phoneNumber.trim()
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
                setValidationErrors({});
                // Show success message and reload page
                alert('Patient registered successfully!');
                window.location.reload();
            } else {
                onError(result.error || 'Failed to register patient');
            }
        } catch (error) {
            console.error('Registration error:', error);
            onError(`Error registering patient: ${error.message || 'Unknown error'}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdate = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            setIsUpdating(true);
            
            // Structure the patient data according to the expected format
            const patientData = {
                personalInfo: {
                    firstName: formData.firstName.trim(),
                    lastName: formData.lastName.trim(),
                    middleName: formData.middleName.trim(),
                    birthdate: formData.personalInfo.birthdate,
                    gender: formData.personalInfo.gender,
                    age: parseInt(formData.personalInfo.age),
                    civilStatus: formData.personalInfo.civilStatus,
                    employmentStatus: formData.personalInfo.employmentStatus
                },
                address: {
                    street: formData.address.street.trim(),
                    barangay: formData.address.barangay,
                    municipality: formData.address.municipality.trim(),
                    province: formData.address.province.trim(),
                    zipcode: formData.address.zipcode
                },
                contactInfo: {
                    email: formData.contactInfo.email.trim(),
                    contactNumber: formData.contactInfo.phoneNumber.trim(),
                    phoneNumber: formData.contactInfo.phoneNumber.trim() // Keep both for compatibility
                },
                medicalInfo: {
                    height: parseFloat(formData.medicalInfo.height) || null,
                    weight: parseFloat(formData.medicalInfo.weight) || null,
                    bmi: parseFloat(formData.medicalInfo.bmi) || null,
                    bloodType: formData.medicalInfo.bloodType
                },
                registrationInfo: {
                    registrationDate: selectedPatient.registrationInfo?.registrationDate || new Date().toISOString(),
                    registrationNumber: selectedPatient.registrationInfo?.registrationNumber,
                    status: selectedPatient.registrationInfo?.status || 'active',
                    lastUpdated: new Date().toISOString()
                }
            };

            console.log('Updating patient data:', patientData);
            const result = await updatePatient(selectedPatient.id, patientData);

            if (result.success) {
                onRegister(selectedPatient.id);
                // Clear form and validation errors
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
                setValidationErrors({});
                toast.success('Patient information updated successfully!', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            } else {
                toast.error(result.message || 'Failed to update patient information', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                onError(result.message || 'Failed to update patient information');
            }
        } catch (error) {
            console.error('Update error:', error);
            toast.error(`Error updating patient: ${error.message || 'Unknown error'}`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            onError(`Error updating patient: ${error.message || 'Unknown error'}`);
        } finally {
            setIsUpdating(false);
        }
    };

    // Helper function to determine if a field has an error
    const hasError = (section, field) => {
        const errorKey = section ? `${section}.${field}` : field;
        return validationErrors[errorKey] ? true : false;
    };

    // Helper function to get error message for a field
    const getErrorMessage = (section, field) => {
        const errorKey = section ? `${section}.${field}` : field;
        return validationErrors[errorKey] || '';
    };

    return (
        <div className="patient-information">
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
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
                                className={`form-control light-theme ${hasError(null, 'lastName') ? 'is-invalid' : ''}`}
                                value={formData.lastName}
                                onChange={(e) => handleInputChange(e, null, 'lastName')}
                                required
                                style={{ backgroundColor: '#ffffff', color: '#000000', borderColor: '#ced4da' }}
                            />
                            {hasError(null, 'lastName') && 
                                <div className="invalid-feedback">{getErrorMessage(null, 'lastName')}</div>
                            }
                        </div>
                        <div className="form-group">
                            <label>First Name *</label>
                            <input 
                                type="text" 
                                className={`form-control light-theme ${hasError(null, 'firstName') ? 'is-invalid' : ''}`}
                                value={formData.firstName}
                                onChange={(e) => handleInputChange(e, null, 'firstName')}
                                required
                                style={{ backgroundColor: '#ffffff', color: '#000000', borderColor: '#ced4da' }}
                            />
                            {hasError(null, 'firstName') && 
                                <div className="invalid-feedback">{getErrorMessage(null, 'firstName')}</div>
                            }
                        </div>
                        <div className="form-group">
                            <label>Middle Name</label>
                            <input 
                                type="text" 
                                className="form-control light-theme"
                                value={formData.middleName}
                                onChange={(e) => handleInputChange(e, null, 'middleName')}
                                style={{ backgroundColor: '#ffffff', color: '#000000', borderColor: '#ced4da' }}
                            />
                        </div>
                    </div>
                    <h4>Address</h4>
                    <div className="form-group">
                        <label>Street Address/Purok *</label>
                        <input 
                            type="text" 
                            className={`form-control light-theme ${hasError('address', 'street') ? 'is-invalid' : ''}`}
                            value={formData.address.street}
                            onChange={(e) => handleInputChange(e, 'address', 'street')}
                            required
                            style={{ backgroundColor: '#ffffff', color: '#000000', borderColor: '#ced4da' }}
                        />
                        {hasError('address', 'street') && 
                            <div className="invalid-feedback">{getErrorMessage('address', 'street')}</div>
                        }
                    </div>

                    <div className="form-group">
                        <label>Barangay *</label>
                        <select 
                            className={`form-control light-theme ${hasError('address', 'barangay') ? 'is-invalid' : ''}`}
                            value={formData.address.barangay}
                            onChange={(e) => handleInputChange(e, 'address', 'barangay')}
                            required
                            style={{ backgroundColor: '#ffffff', color: '#000000', borderColor: '#ced4da' }}
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
                        {hasError('address', 'barangay') && 
                            <div className="invalid-feedback">{getErrorMessage('address', 'barangay')}</div>
                        }
                    </div>

                    <div className="form-group">
                        <label>Municipality *</label>
                        <input 
                            type="text" 
                            className={`form-control light-theme ${hasError('address', 'municipality') ? 'is-invalid' : ''}`}
                            value={formData.address.municipality}
                            onChange={(e) => handleInputChange(e, 'address', 'municipality')}
                            required
                            style={{ backgroundColor: '#ffffff', color: '#000000', borderColor: '#ced4da' }}
                        />
                        {hasError('address', 'municipality') && 
                            <div className="invalid-feedback">{getErrorMessage('address', 'municipality')}</div>
                        }
                    </div>

                    <div className="form-group">
                        <label>Province *</label>
                        <input 
                            type="text" 
                            className={`form-control light-theme ${hasError('address', 'province') ? 'is-invalid' : ''}`}
                            value={formData.address.province}
                            onChange={(e) => handleInputChange(e, 'address', 'province')}
                            required
                            style={{ backgroundColor: '#ffffff', color: '#000000', borderColor: '#ced4da' }}
                        />
                        {hasError('address', 'province') && 
                            <div className="invalid-feedback">{getErrorMessage('address', 'province')}</div>
                        }
                    </div>

                    <div className="form-group">
                        <label>Zip Code</label>
                        <input 
                            type="text" 
                            className={`form-control light-theme ${hasError('address', 'zipcode') ? 'is-invalid' : ''}`}
                            value={formData.address.zipcode}
                            onChange={(e) => handleInputChange(e, 'address', 'zipcode')}
                            style={{ backgroundColor: '#ffffff', color: '#000000', borderColor: '#ced4da' }}
                        />
                        {hasError('address', 'zipcode') && 
                            <div className="invalid-feedback">{getErrorMessage('address', 'zipcode')}</div>
                        }
                    </div>

                </div>
                <div className="right-section">
                    <h4>Personal Information</h4>
                    <div className="form-group">
                        <label>Birth Date *</label>
                        <input 
                            type="date" 
                            className={`form-control light-theme ${hasError('personalInfo', 'birthdate') ? 'is-invalid' : ''}`}
                            value={formData.personalInfo.birthdate}
                            onChange={(e) => handleInputChange(e, 'personalInfo', 'birthdate')}
                            required
                            style={{ backgroundColor: '#ffffff', color: '#000000', borderColor: '#ced4da' }}
                            max={new Date().toISOString().split('T')[0]} // Set max date to today
                        />
                        {hasError('personalInfo', 'birthdate') && 
                            <div className="invalid-feedback">{getErrorMessage('personalInfo', 'birthdate')}</div>
                        }
                    </div>

                    <div className="form-group">
                        <label>Gender *</label>
                        <select 
                            className={`form-control light-theme ${hasError('personalInfo', 'gender') ? 'is-invalid' : ''}`}
                            value={formData.personalInfo.gender}
                            onChange={(e) => handleInputChange(e, 'personalInfo', 'gender')}
                            required
                            style={{ backgroundColor: '#ffffff', color: '#000000', borderColor: '#ced4da' }}
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                        {hasError('personalInfo', 'gender') && 
                            <div className="invalid-feedback">{getErrorMessage('personalInfo', 'gender')}</div>
                        }
                    </div>

                    <div className="form-group">
                        <label>Age *</label>
                        <input 
                            type="number" 
                            className={`form-control light-theme ${hasError('personalInfo', 'age') ? 'is-invalid' : ''}`}
                            value={formData.personalInfo.age}
                            onChange={(e) => handleInputChange(e, 'personalInfo', 'age')}
                            required
                            min="0"
                            max="150"
                            style={{ backgroundColor: '#ffffff', color: '#000000', borderColor: '#ced4da' }}
                        />
                        {hasError('personalInfo', 'age') && 
                            <div className="invalid-feedback">{getErrorMessage('personalInfo', 'age')}</div>
                        }
                    </div>

                    <div className="form-group">
                        <label>Civil Status</label>
                        <select 
                            className="form-control light-theme"
                            value={formData.personalInfo.civilStatus}
                            onChange={(e) => handleInputChange(e, 'personalInfo', 'civilStatus')}
                            style={{ backgroundColor: '#ffffff', color: '#000000', borderColor: '#ced4da' }}
                        >
                            <option value="">Select Civil Status</option>
                            <option value="Single">Single</option>
                            <option value="Married">Married</option>
                            <option value="Divorced">Divorced</option>
                            <option value="Widowed">Widowed</option>
                            <option value="Separated">Separated</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Employment Status</label>
                        <select 
                            className="form-control light-theme"
                            value={formData.personalInfo.employmentStatus}
                            onChange={(e) => handleInputChange(e, 'personalInfo', 'employmentStatus')}
                            style={{ backgroundColor: '#ffffff', color: '#000000', borderColor: '#ced4da' }}
                        >
                            <option value="">Select Employment Status</option>
                            <option value="Employed">Employed</option>
                            <option value="Unemployed">Unemployed</option>
                            <option value="Self-Employed">Self-Employed</option>
                            <option value="Student">Student</option>
                            <option value="Retired">Retired</option>
                        </select>
                    </div>

                    <h4>Contact Information</h4>
                    <div className="form-group">
                        <label>Email</label>
                        <input 
                            type="email" 
                            className={`form-control light-theme ${hasError('contactInfo', 'email') ? 'is-invalid' : ''}`}
                            value={formData.contactInfo.email}
                            onChange={(e) => handleInputChange(e, 'contactInfo', 'email')}
                            placeholder="example@email.com"
                            style={{ backgroundColor: '#ffffff', color: '#000000', borderColor: '#ced4da' }}
                        />
                        {hasError('contactInfo', 'email') && 
                            <div className="invalid-feedback">{getErrorMessage('contactInfo', 'email')}</div>
                        }
                    </div>

                    <div className="form-group">
                        <label>Phone Number *</label>
                        <input 
                            type="tel" 
                            className={`form-control light-theme ${hasError('contactInfo', 'phoneNumber') ? 'is-invalid' : ''}`}
                            value={formData.contactInfo.phoneNumber}
                            onChange={(e) => handleInputChange(e, 'contactInfo', 'phoneNumber')}
                            placeholder="+63 XXX XXX XXXX"
                            required
                            style={{ backgroundColor: '#ffffff', color: '#000000', borderColor: '#ced4da' }}
                        />
                        {hasError('contactInfo', 'phoneNumber') && 
                            <div className="invalid-feedback">{getErrorMessage('contactInfo', 'phoneNumber')}</div>
                        }
                    </div>

                    <h4>Medical Information</h4>
                    <div className="form-group">
                        <label>Height (cm)</label>
                        <input 
                            type="number" 
                            className={`form-control light-theme ${hasError('medicalInfo', 'height') ? 'is-invalid' : ''}`}
                            value={formData.medicalInfo.height}
                            onChange={(e) => handleInputChange(e, 'medicalInfo', 'height')}
                            min="1" 
                            max="300"
                            step="0.1"
                            style={{ backgroundColor: '#ffffff', color: '#000000', borderColor: '#ced4da' }}
                        />
                        {hasError('medicalInfo', 'height') && 
                            <div className="invalid-feedback">{getErrorMessage('medicalInfo', 'height')}</div>
                        }
                    </div>

                    <div className="form-group">
                        <label>Weight (kg)</label>
                        <input 
                            type="number" 
                            className={`form-control light-theme ${hasError('medicalInfo', 'weight') ? 'is-invalid' : ''}`}
                            value={formData.medicalInfo.weight}
                            onChange={(e) => handleInputChange(e, 'medicalInfo', 'weight')}
                            min="1" 
                            max="700"
                            step="0.1"
                            style={{ backgroundColor: '#ffffff', color: '#000000', borderColor: '#ced4da' }}
                        />
                        {hasError('medicalInfo', 'weight') && 
                            <div className="invalid-feedback">{getErrorMessage('medicalInfo', 'weight')}</div>
                        }
                    </div>

                    <div className="form-group">
                        <label>BMI</label>
                        <input 
                            type="number" 
                            className={`form-control light-theme ${hasError('medicalInfo', 'bmi') ? 'is-invalid' : ''}`}
                            value={formData.medicalInfo.bmi}
                            onChange={(e) => handleInputChange(e, 'medicalInfo', 'bmi')}
                            readOnly
                            style={{ backgroundColor: '#f9f9f9', color: '#000000', borderColor: '#ced4da' }}
                        />
                        {hasError('medicalInfo', 'bmi') && 
                            <div className="invalid-feedback">{getErrorMessage('medicalInfo', 'bmi')}</div>
                        }
                    </div>

                    <div className="form-group">
                        <label>Blood Type</label>
                        <select 
                            className="form-control light-theme"
                            value={formData.medicalInfo.bloodType}
                            onChange={(e) => handleInputChange(e, 'medicalInfo', 'bloodType')}
                            style={{ backgroundColor: '#ffffff', color: '#000000', borderColor: '#ced4da' }}
                        >
                            <option value="">Select Blood Type</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                            <option value="Unknown">Unknown</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="button-section">
                {selectedPatient ? (
                    <button 
                        className="update-btn" 
                        onClick={handleUpdate}
                        disabled={isUpdating} 
                        style={{ 
                            backgroundColor: '#28a745', 
                            color: '#ffffff', 
                            border: 'none',
                            marginRight: '10px'
                        }}
                    >
                        {isUpdating ? 'Updating...' : 'Update Patient'}
                    </button>
                ) : (
                    <button 
                        className="submit-btn" 
                        onClick={handleSubmit}
                        disabled={isSubmitting} 
                        style={{ backgroundColor: '#007bff', color: '#ffffff', border: 'none' }}
                    >
                        {isSubmitting ? 'Registering...' : 'Register Patient'}
                    </button>
                )}
            </div>
            
            <style jsx>{`
                .form-control {
                    background-color: #ffffff !important;
                    color: #000000 !important;
                    border-color: #ced4da !important;
                }
                
                .form-control:focus {
                    background-color: #ffffff !important;
                    color: #000000 !important;
                    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25) !important;
                }
                
                .form-control:disabled,
                .form-control[readonly] {
                    background-color: #f9f9f9 !important;
                }
                
                .is-invalid {
                    border-color: #dc3545 !important;
                    background-color: #fff8f8 !important;
                }
                
                select.form-control option {
                    background-color: #ffffff !important;
                    color: #000000 !important;
                }

                /* Fix for number input spinners */
                input[type="number"]::-webkit-inner-spin-button, 
                input[type="number"]::-webkit-outer-spin-button {
                    color: white !important;
                    background-color: white !important;
                    opacity: 1 !important;
                }
                
                /* Firefox */
                input[type="number"] {
                    -moz-appearance: textfield;
                }

                .button-section {
                    display: flex;
                    justify-content: flex-end;
                    margin-top: 20px;
                    padding: 20px;
                    border-top: 1px solid #e0e0e0;
                }

                .update-btn, .submit-btn {
                    padding: 10px 20px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 16px;
                    transition: background-color 0.3s;
                }

                .update-btn:hover {
                    background-color: #218838 !important;
                }

                .submit-btn:hover {
                    background-color: #0056b3 !important;
                }

                .update-btn:disabled, .submit-btn:disabled {
                    background-color: #bdbdbd !important;
                    cursor: not-allowed;
                }
            `}</style>
        </div>
    );
}

export default PatientInformation;