import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

function ManageInventory() {
    const [medicineForm, setMedicineForm] = useState({
        medicineId: '',
        name: '',
        brand: '',
        description: '',
        quantity: '',
        expiryDate: ''
    });
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });
    const [searchTerm, setSearchTerm] = useState('');
    
    // Mock data for medicines
    const [medicines, setMedicines] = useState([
        { 
            id: 'MED001', 
            name: 'Paracetamol', 
            brand: 'Biogesic', 
            quantity: 100, 
            expiryDate: '2025-12-31',
            description: 'Pain reliever and fever reducer'
        }
    ]);
    const [selectedMedicine, setSelectedMedicine] = useState(null);

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
        setMedicineForm(prev => ({
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
            { field: 'name', label: 'Medicine Name' },
            { field: 'quantity', label: 'Quantity' }
        ];

        for (const { field, label } of requiredFields) {
            if (!medicineForm[field]) {
                errors[field] = `${label} is required`;
                isValid = false;
            }
        }

        // Quantity validation - must be a positive number
        if (medicineForm.quantity) {
            const quantity = parseFloat(medicineForm.quantity);
            if (isNaN(quantity) || quantity <= 0 || !Number.isInteger(quantity)) {
                errors.quantity = 'Quantity must be a positive whole number';
                isValid = false;
            }
        }

        // Expiry date validation
        if (medicineForm.expiryDate) {
            const expiryDate = new Date(medicineForm.expiryDate);
            const today = new Date();
            
            if (expiryDate < today) {
                errors.expiryDate = 'Medicine is already expired';
                isValid = false;
            }
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleAddMedicine = (e) => {
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

        // Simulate medicine addition with a delay
        setTimeout(() => {
            try {
                // In a real app, this would be an API call
                const newMedicine = {
                    id: medicineForm.medicineId || `MED${Math.floor(Math.random() * 1000)}`,
                    name: medicineForm.name.trim(),
                    brand: medicineForm.brand.trim(),
                    description: medicineForm.description.trim(),
                    quantity: parseInt(medicineForm.quantity, 10),
                    expiryDate: medicineForm.expiryDate
                };

                setMedicines([...medicines, newMedicine]);
                setSubmitMessage({ 
                    type: 'success', 
                    text: 'Medicine added successfully!' 
                });

                // Clear form
                setMedicineForm({
                    medicineId: '',
                    name: '',
                    brand: '',
                    description: '',
                    quantity: '',
                    expiryDate: ''
                });
            } catch (error) {
                console.error('Error adding medicine:', error);
                setSubmitMessage({ 
                    type: 'error', 
                    text: `Error adding medicine: ${error.message || 'Unknown error'}` 
                });
            } finally {
                setIsSubmitting(false);
            }
        }, 1000);
    };

    const handleUpdateStock = (e) => {
        e.preventDefault();
        if (!medicineForm.medicineId) {
            setSubmitMessage({ 
                type: 'error', 
                text: 'Please select a medicine to update' 
            });
            return;
        }

        if (!medicineForm.quantity || isNaN(parseInt(medicineForm.quantity, 10)) || parseInt(medicineForm.quantity, 10) <= 0) {
            setFormErrors({
                ...formErrors,
                quantity: 'Quantity must be a positive whole number'
            });
            setSubmitMessage({ 
                type: 'error', 
                text: 'Please enter a valid quantity' 
            });
            return;
        }

        setIsSubmitting(true);
        
        // Simulate medicine update with a delay
        setTimeout(() => {
            try {
                // In a real app, this would be an API call
                const updatedMedicines = medicines.map(medicine => 
                    medicine.id === medicineForm.medicineId 
                        ? { 
                            ...medicine, 
                            quantity: parseInt(medicineForm.quantity, 10),
                            brand: medicineForm.brand.trim(),
                            description: medicineForm.description.trim(),
                            expiryDate: medicineForm.expiryDate
                        } 
                        : medicine
                );

                setMedicines(updatedMedicines);
                setSubmitMessage({ 
                    type: 'success', 
                    text: 'Medicine updated successfully!' 
                });
            } catch (error) {
                console.error('Error updating medicine:', error);
                setSubmitMessage({ 
                    type: 'error', 
                    text: `Error updating medicine: ${error.message || 'Unknown error'}` 
                });
            } finally {
                setIsSubmitting(false);
            }
        }, 1000);
    };

    const handleRemoveStock = (e) => {
        e.preventDefault();
        if (!medicineForm.medicineId) {
            setSubmitMessage({ 
                type: 'error', 
                text: 'Please select a medicine to remove' 
            });
            return;
        }

        if (window.confirm('Are you sure you want to remove this medicine from stock?')) {
            setIsSubmitting(true);
            
            // Simulate medicine removal with a delay
            setTimeout(() => {
                try {
                    // In a real app, this would be an API call
                    const updatedMedicines = medicines.filter(medicine => 
                        medicine.id !== medicineForm.medicineId
                    );

                    setMedicines(updatedMedicines);
                    setSubmitMessage({ 
                        type: 'success', 
                        text: 'Medicine removed successfully!' 
                    });
                    
                    // Clear form
                    setMedicineForm({
                        medicineId: '',
                        name: '',
                        brand: '',
                        description: '',
                        quantity: '',
                        expiryDate: ''
                    });
                } catch (error) {
                    console.error('Error removing medicine:', error);
                    setSubmitMessage({ 
                        type: 'error', 
                        text: `Error removing medicine: ${error.message || 'Unknown error'}` 
                    });
                } finally {
                    setIsSubmitting(false);
                }
            }, 1000);
        }
    };

    const handleMedicineSelect = (medicineId) => {
        const selected = medicines.find(medicine => medicine.id === medicineId);
        if (selected) {
            setMedicineForm({
                medicineId: selected.id,
                name: selected.name,
                brand: selected.brand || '',
                description: selected.description || '',
                quantity: selected.quantity.toString(),
                expiryDate: selected.expiryDate || ''
            });
            setSelectedMedicine(selected);
        }
    };

    const handleClearForm = () => {
        setMedicineForm({
            medicineId: '',
            name: '',
            brand: '',
            description: '',
            quantity: '',
            expiryDate: ''
        });
        setFormErrors({});
        setSelectedMedicine(null);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredMedicines = medicines.filter(medicine => 
        searchTerm === '' || 
        medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        medicine.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        medicine.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="inventory-container">
            {/* Left side - existing medicine management */}
            <div className="medicine-management">
                <div className="header-section">
                    <h2 className="section-title">Medicine Management</h2>
                    <div className="medicine-id">
                        <label>Medicine ID</label>
                        <input 
                            type="text" 
                            name="medicineId"
                            className="form-control" 
                            value={medicineForm.medicineId}
                            onChange={handleInputChange}
                            disabled={true}
                            style={{ backgroundColor: '#f9f9f9', color: '#000000' }}
                        />
                    </div>
                </div>

                {submitMessage.text && (
                    <div className={`message-container ${submitMessage.type}`}>
                        {submitMessage.text}
                    </div>
                )}

                <form className="medicine-form">
                    <div className="form-group">
                        <label>Medicine Name *</label>
                        <input 
                            type="text" 
                            name="name"
                            className={`form-control ${formErrors.name ? 'is-invalid' : ''}`} 
                            value={medicineForm.name}
                            onChange={handleInputChange}
                            disabled={!!medicineForm.medicineId}
                            required
                            style={{ backgroundColor: '#ffffff', color: '#000000' }}
                        />
                        {formErrors.name && (
                            <div className="invalid-feedback">{formErrors.name}</div>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Medicine Brand</label>
                        <input 
                            type="text" 
                            name="brand"
                            className="form-control" 
                            value={medicineForm.brand}
                            onChange={handleInputChange}
                            style={{ backgroundColor: '#ffffff', color: '#000000' }}
                        />
                    </div>

                    <div className="form-group">
                        <label>Medicine Description</label>
                        <textarea 
                            name="description"
                            className="form-control" 
                            rows="3"
                            value={medicineForm.description}
                            onChange={handleInputChange}
                            style={{ backgroundColor: '#ffffff', color: '#000000' }}
                        ></textarea>
                    </div>

                    <div className="form-group">
                        <label>Quantity *</label>
                        <input 
                            type="number" 
                            name="quantity"
                            className={`form-control ${formErrors.quantity ? 'is-invalid' : ''}`} 
                            value={medicineForm.quantity}
                            onChange={handleInputChange}
                            min="1"
                            step="1"
                            required
                            style={{ backgroundColor: '#ffffff', color: '#000000' }}
                        />
                        {formErrors.quantity && (
                            <div className="invalid-feedback">{formErrors.quantity}</div>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Medicine Expiry</label>
                        <input 
                            type="date" 
                            name="expiryDate"
                            className={`form-control ${formErrors.expiryDate ? 'is-invalid' : ''}`} 
                            value={medicineForm.expiryDate}
                            onChange={handleInputChange}
                            min={new Date().toISOString().split('T')[0]}
                            style={{ backgroundColor: '#ffffff', color: '#000000' }}
                        />
                        {formErrors.expiryDate && (
                            <div className="invalid-feedback">{formErrors.expiryDate}</div>
                        )}
                    </div>

                    <div className="button-group">
                        <button 
                            type="button"
                            className="btn add-btn"
                            onClick={handleAddMedicine}
                            disabled={isSubmitting || !!medicineForm.medicineId}
                        >
                            {isSubmitting ? 'Processing...' : 'Add Medicine'}
                        </button>
                        <button 
                            type="button"
                            className="btn update-btn"
                            onClick={handleUpdateStock}
                            disabled={isSubmitting || !medicineForm.medicineId}
                        >
                            {isSubmitting ? 'Processing...' : 'Update Stock'}
                        </button>
                        <button 
                            type="button"
                            className="btn remove-btn"
                            onClick={handleRemoveStock}
                            disabled={isSubmitting || !medicineForm.medicineId}
                        >
                            {isSubmitting ? 'Processing...' : 'Remove Stock'}
                        </button>
                        <button 
                            type="button"
                            className="btn clear-btn"
                            onClick={handleClearForm}
                            disabled={isSubmitting}
                        >
                            Clear Form
                        </button>
                    </div>
                </form>
            </div>

            {/* Right side - medicine search and table */}
            <div className="medicine-list">
                <div className="search-section">
                    <div className="search-box">
                        <input 
                            type="text" 
                            placeholder="Search medicine..." 
                            className="search-input"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            style={{ backgroundColor: '#ffffff', color: '#000000' }}
                        />
                        <button className="search-button">
                            <Search size={20} />
                            Search
                        </button>
                    </div>
                </div>

                <div className="table-section">
                    {filteredMedicines.length === 0 ? (
                        <div className="no-results">No medicines found</div>
                    ) : (
                        <table className="medicine-table">
                            <thead>
                                <tr>
                                    <th>Medicine ID</th>
                                    <th>Name</th>
                                    <th>Brand</th>
                                    <th>Quantity</th>
                                    <th>Expiry Date</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredMedicines.map(medicine => (
                                    <tr key={medicine.id} className={medicine.quantity <= 10 ? 'low-stock' : ''}>
                                        <td>{medicine.id}</td>
                                        <td>{medicine.name}</td>
                                        <td>{medicine.brand}</td>
                                        <td>{medicine.quantity}</td>
                                        <td>{medicine.expiryDate}</td>
                                        <td>
                                            <button 
                                                className="action-btn"
                                                onClick={() => handleMedicineSelect(medicine.id)}
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
                
                .no-results {
                    padding: 20px;
                    text-align: center;
                    background-color: #f8f9fa;
                    border-radius: 4px;
                    color: #6c757d;
                }
                
                .low-stock {
                    background-color: #fff3cd;
                }
                
                /* New styles to ensure white background */
                input, select, textarea, .form-control {
                    background-color: #ffffff !important;
                    color: #000000 !important;
                    border-color: #ced4da !important;
                }
                
                input:focus, select:focus, textarea:focus, .form-control:focus {
                    background-color: #ffffff !important;
                    color: #000000 !important;
                    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25) !important;
                }
                
                input:disabled, select:disabled, textarea:disabled, .form-control:disabled {
                    background-color: #f9f9f9 !important;
                    color: #000000 !important;
                }
                
                .inventory-container {
                    background-color: #f8f9fa !important;
                }
                
                .search-input {
                    background-color: #ffffff !important;
                    color: #000000 !important;
                }
                
                table {
                    background-color: #ffffff !important;
                    color: #000000 !important;
                }
                
                th {
                    background-color: #f8f9fa !important;
                    color: #000000 !important;
                }
                
                .medicine-management, .medicine-list {
                    background-color: #ffffff !important;
                }
                
                .add-btn {
                    background-color: #28a745 !important;
                    color: #ffffff !important;
                    border-color: #28a745 !important;
                }
                
                .update-btn {
                    background-color: #007bff !important;
                    color: #ffffff !important;
                    border-color: #007bff !important;
                }
                
                .remove-btn {
                    background-color: #dc3545 !important;
                    color: #ffffff !important;
                    border-color: #dc3545 !important;
                }
                
                .clear-btn {
                    background-color: #6c757d !important;
                    color: #ffffff !important;
                    border-color: #6c757d !important;
                }
                
                .search-button {
                    background-color: #007bff !important;
                    color: #ffffff !important;
                    border-color: #007bff !important;
                }
                
                .action-btn {
                    background-color: #17a2b8 !important;
                    color: #ffffff !important;
                    border-color: #17a2b8 !important;
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
            `}</style>
        </div>
    );
}

export default ManageInventory;