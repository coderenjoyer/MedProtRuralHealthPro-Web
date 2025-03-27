"use client";

import styled from "styled-components";
import Sidebar from "../../Components/AdminComp/Sidebar";
import { FaBars, FaSearch, FaCalendarAlt } from "react-icons/fa";
import { useState, useEffect } from "react";
import { ref, onValue, push, set, remove, update } from "firebase/database";
import { database } from "../../Firebase/firebase";
import { toast } from "react-toastify";

const PageContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f8f9fa;
`;

const MainContent = styled.main`
  flex: 1;
  margin-left: ${(props) => (props.$isSidebarOpen ? "240px" : "0")};
  padding: 20px;
  transition: margin-left 0.3s ease;
  width: 100%;
  @media (max-width: 768px) {
    margin-left: 0;
    padding: 15px;
  }
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  background: white;
  padding: 15px 20px;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 22px;
  font-weight: 600;
  color: #105c7c;
`;

const MenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: #105c7c;
  font-size: 24px;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

const ContentContainer = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
`;

const FormSection = styled.div`
  flex: 1;
  background: white;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  max-width: 400px;

  @media (max-width: 1200px) {
    max-width: 100%;
  }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
  margin-right: 8px;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  font-size: 14px;
  margin-top: 5px;
  background-color: #f8d7da;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #f5c6cb;
`;

const SuccessMessage = styled.div`
  color: #28a745;
  font-size: 14px;
  margin-top: 5px;
  background-color: #d4edda;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #c3e6cb;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;

  label {
    display: block;
    font-weight: 600;
    margin-bottom: 6px;
    color: #495057;
  }

  input, textarea {
    width: 100%;
    padding: 10px;
    border-radius: 6px;
    border: 1px solid ${props => props.$hasError ? '#dc3545' : '#ced4da'};
    background: #f8f9fa;
    font-size: 14px;
    outline: none;
    color: #000000;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;

    &:focus {
      border-color: ${props => props.$hasError ? '#dc3545' : '#105c7c'};
      box-shadow: 0 0 0 2px ${props => props.$hasError ? 'rgba(220, 53, 69, 0.25)' : 'rgba(16, 92, 124, 0.25)'};
    }
  }

  textarea {
    resize: none;
    height: 60px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

const Button = styled.button`
  flex: 1;
  background-color: #105c7c;
  border: none;
  color: white;
  padding: 10px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #0d4a63;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const TableSection = styled.div`
  flex: 2;
  background: white;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 100%;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 10px;
  margin-bottom: 15px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.05);

  input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 14px;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th, td {
    padding: 12px;
    text-align: left;
  }

  th {
    background: #105c7c;
    color: white;
  }

  tr:nth-child(even) {
    background: #f8f9fa;
  }
`;

export default function MedicineInventory({ isSidebarOpen, setIsSidebarOpen, setActivePage, activePage }) {
  const [medicines, setMedicines] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    description: "",
    quantity: 0,
    expiryDate: ""
  });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Function to generate a 3-digit ID
  const generateThreeDigitId = () => {
    try {
      const existingIds = medicines.map(med => parseInt(med.id));
      let newId;
      do {
        newId = Math.floor(Math.random() * 900) + 100;
      } while (existingIds.includes(newId));
      return newId.toString();
    } catch (error) {
      console.error('Error generating ID:', error);
      throw new Error('Failed to generate medicine ID');
    }
  };

  useEffect(() => {
    const medicinesRef = ref(database, 'rhp/medicines');
    setLoading(true);
    setError(null);

    const unsubscribe = onValue(medicinesRef, (snapshot) => {
      try {
        const data = snapshot.val();
        if (data) {
          const medicinesList = Object.entries(data).map(([id, medicine]) => ({
            id,
            ...medicine
          }));
          setMedicines(medicinesList);
        } else {
          setMedicines([]);
        }
      } catch (error) {
        console.error('Error processing medicine data:', error);
        setError('Error loading medicine data');
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = "Medicine name is required";
    } else if (formData.name.length < 2) {
      errors.name = "Medicine name must be at least 2 characters";
    }

    if (!formData.brand.trim()) {
      errors.brand = "Brand name is required";
    }

    if (formData.quantity < 0) {
      errors.quantity = "Quantity cannot be negative";
    }

    if (!formData.expiryDate) {
      errors.expiryDate = "Expiry date is required";
    } else {
      const expiryDate = new Date(formData.expiryDate);
      const today = new Date();
      if (expiryDate < today) {
        errors.expiryDate = "Expiry date cannot be in the past";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      if (editingId) {
        // Update existing medicine
        const medicineRef = ref(database, `rhp/medicines/${editingId}`);
        await update(medicineRef, formData);
        setSuccess("Medicine updated successfully!");
      } else {
        // Add new medicine with 3-digit ID
        const newId = generateThreeDigitId();
        const newMedicineRef = ref(database, `rhp/medicines/${newId}`);
        await set(newMedicineRef, formData);
        setSuccess("Medicine added successfully!");
      }
      
      // Reset form after successful submission
      setFormData({ name: "", brand: "", description: "", quantity: 0, expiryDate: "" });
      setEditingId(null);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error saving medicine:', error);
      setError("Error saving medicine: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (medicine) => {
    try {
      setFormData({
        name: medicine.name || "",
        brand: medicine.brand || "",
        description: medicine.description || "",
        quantity: medicine.quantity || 0,
        expiryDate: medicine.expiryDate || ""
      });
      setEditingId(medicine.id);
      setFormErrors({});
    } catch (error) {
      console.error('Error preparing edit:', error);
      setError("Error preparing medicine for edit");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this medicine?")) {
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const medicineRef = ref(database, `rhp/medicines/${id}`);
      await remove(medicineRef);
      setSuccess("Medicine deleted successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error deleting medicine:', error);
      setError("Error deleting medicine: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearch = (e) => {
    try {
      const value = e.target.value;
      // Sanitize input - only allow alphanumeric characters, spaces, and basic punctuation
      const sanitizedValue = value.replace(/[^A-Za-z0-9\s\-'\.]/g, '');
      setSearchTerm(sanitizedValue);
    } catch (error) {
      console.error('Error handling search:', error);
      setError('Error processing search input');
    }
  };

  const filteredMedicines = medicines.filter(medicine =>
    medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medicine.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageContainer>
      <Sidebar isOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} setActivePage={setActivePage} activePage={activePage} />
      <MainContent $isSidebarOpen={isSidebarOpen}>
        <Header>
          <Title>Medicine Inventory</Title>
          <MenuButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <FaBars />
          </MenuButton>
        </Header>

        <ContentContainer>
          <FormSection>
            <h2>{editingId ? "Edit Medicine" : "Add New Medicine"}</h2>
            <form onSubmit={handleSubmit}>
              <FormGroup $hasError={!!formErrors.name}>
                <label htmlFor="name">Medicine Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  pattern="[A-Za-z0-9\s\-'\.]+"
                  title="Only letters, numbers, spaces, hyphens, apostrophes, and periods are allowed"
                />
                {formErrors.name && <ErrorMessage>{formErrors.name}</ErrorMessage>}
              </FormGroup>

              <FormGroup $hasError={!!formErrors.brand}>
                <label htmlFor="brand">Brand</label>
                <input
                  type="text"
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  required
                  pattern="[A-Za-z0-9\s\-'\.]+"
                  title="Only letters, numbers, spaces, hyphens, apostrophes, and periods are allowed"
                />
                {formErrors.brand && <ErrorMessage>{formErrors.brand}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </FormGroup>

              <FormGroup $hasError={!!formErrors.quantity}>
                <label htmlFor="quantity">Quantity</label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  required
                  min="0"
                />
                {formErrors.quantity && <ErrorMessage>{formErrors.quantity}</ErrorMessage>}
              </FormGroup>

              <FormGroup $hasError={!!formErrors.expiryDate}>
                <label htmlFor="expiryDate">Expiry Date</label>
                <input
                  type="date"
                  id="expiryDate"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
                {formErrors.expiryDate && <ErrorMessage>{formErrors.expiryDate}</ErrorMessage>}
              </FormGroup>

              {error && <ErrorMessage>{error}</ErrorMessage>}
              {success && <SuccessMessage>{success}</SuccessMessage>}

              <ButtonGroup>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner />
                      {editingId ? "Updating..." : "Adding..."}
                    </>
                  ) : (
                    editingId ? "Update Medicine" : "Add Medicine"
                  )}
                </Button>
                {editingId && (
                  <Button
                    type="button"
                    onClick={() => {
                      setFormData({ name: "", brand: "", description: "", quantity: 0, expiryDate: "" });
                      setEditingId(null);
                      setFormErrors({});
                    }}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                )}
              </ButtonGroup>
            </form>
          </FormSection>

          <TableSection>
            <SearchBar>
              <FaSearch />
              <input
                type="text"
                placeholder="Search medicines..."
                value={searchTerm}
                onChange={handleSearch}
                maxLength="50"
                pattern="[A-Za-z0-9\s\-'\.]+"
                title="Only letters, numbers, spaces, hyphens, apostrophes, and periods are allowed"
              />
            </SearchBar>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <LoadingSpinner />
                <p>Loading medicines...</p>
              </div>
            ) : error ? (
              <ErrorMessage>{error}</ErrorMessage>
            ) : (
              <Table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Brand</th>
                    <th>Description</th>
                    <th>Quantity</th>
                    <th>Expiry Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMedicines.length > 0 ? (
                    filteredMedicines.map((medicine) => (
                      <tr key={medicine.id}>
                        <td>{medicine.name}</td>
                        <td>{medicine.brand}</td>
                        <td>{medicine.description}</td>
                        <td>{medicine.quantity}</td>
                        <td>{new Date(medicine.expiryDate).toLocaleDateString()}</td>
                        <td>
                          <Button
                            onClick={() => handleEdit(medicine)}
                            disabled={isSubmitting}
                            style={{ marginRight: '5px' }}
                          >
                            Edit
                          </Button>
                          <Button
                            onClick={() => handleDelete(medicine.id)}
                            disabled={isSubmitting}
                            style={{ backgroundColor: '#dc3545' }}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center' }}>
                        No medicines found
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            )}
          </TableSection>
        </ContentContainer>
      </MainContent>
    </PageContainer>
  );
}
