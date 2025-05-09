import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { ref, onValue, set, remove, update } from "firebase/database";
import { database } from "../../Firebase/firebase";
import { toast } from "react-toastify";
import styled from "styled-components";

const InventoryContainer = styled.div`
  display: flex;
  gap: 20px;
  padding: 20px;
  background-color: #f8f9fa;
  min-height: 100vh;
`;

const MedicineManagement = styled.div`
  flex: 1;
  background: white;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  max-width: 400px;
`;

const HeaderSection = styled.div`
  margin-bottom: 20px;
`;

const SectionTitle = styled.h2`
  font-size: 22px;
  font-weight: 600;
  color: #105c7c;
  margin-bottom: 15px;
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
    border: 1px solid #ced4da;
    background: #f8f9fa;
    font-size: 14px;
    outline: none;
    color: #000000;
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

  &:hover {
    background-color: #0d4a63;
  }

  &.remove-btn {
    background-color: #dc3545;
    &:hover {
      background-color: #c82333;
    }
  }
`;

const MedicineList = styled.div`
  flex: 2;
  background: white;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
`;

const SearchSection = styled.div`
  margin-bottom: 20px;
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 10px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.05);

  input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 14px;
  }

  button {
    display: flex;
    align-items: center;
    gap: 5px;
    background: none;
    border: none;
    color: #105c7c;
    cursor: pointer;
    padding: 5px 10px;
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

function ManageInventory() {
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

    // Function to generate a 3-digit ID
    const generateThreeDigitId = () => {
        const existingIds = medicines.map(med => parseInt(med.id));
        let newId;
        do {
            newId = Math.floor(Math.random() * 900) + 100; // Generates number between 100 and 999
        } while (existingIds.includes(newId));
        return newId.toString();
    };

    useEffect(() => {
        const medicinesRef = ref(database, 'rhp/medicines');
        const unsubscribe = onValue(medicinesRef, (snapshot) => {
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
        });

        return () => unsubscribe();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Check for duplicate medicine name
            const isDuplicate = medicines.some(medicine => 
                medicine.name.toLowerCase() === formData.name.toLowerCase() && 
                medicine.id !== editingId // Exclude current medicine when editing
            );

            if (isDuplicate) {
                toast.error("A medicine with this name already exists!");
                return;
            }

            // Create confirmation message
            const confirmationMessage = `
Please confirm the following medicine details:

Medicine Name: ${formData.name}
Brand: ${formData.brand}
Description: ${formData.description}
Quantity: ${formData.quantity}
Expiry Date: ${formData.expiryDate}

Do you want to ${editingId ? 'update' : 'add'} this medicine?`;

            // Show confirmation dialog
            if (!window.confirm(confirmationMessage)) {
                return;
            }

            if (editingId) {
                // Update existing medicine
                const medicineRef = ref(database, `rhp/medicines/${editingId}`);
                await update(medicineRef, formData);
                toast.success("Medicine updated successfully!");
            } else {
                // Add new medicine with 3-digit ID
                const newId = generateThreeDigitId();
                const newMedicineRef = ref(database, `rhp/medicines/${newId}`);
                await set(newMedicineRef, formData);
                toast.success("Medicine added successfully!");
            }
            setFormData({ name: "", brand: "", description: "", quantity: 0, expiryDate: "" });
            setEditingId(null);
        } catch (error) {
            toast.error("Error saving medicine: " + error.message);
        }
    };

    const handleEdit = (medicine) => {
        setFormData({
            name: medicine.name,
            brand: medicine.brand,
            description: medicine.description,
            quantity: medicine.quantity,
            expiryDate: medicine.expiryDate || ""
        });
        setEditingId(medicine.id);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this medicine?")) {
            try {
                const medicineRef = ref(database, `rhp/medicines/${id}`);
                await remove(medicineRef);
                toast.success("Medicine deleted successfully!");
            } catch (error) {
                toast.error("Error deleting medicine: " + error.message);
            }
        }
    };

    const filteredMedicines = medicines.filter(medicine =>
        medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        medicine.brand.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <InventoryContainer>
            <MedicineManagement>
                <HeaderSection>
                    <SectionTitle>Medicine Management</SectionTitle>
                    <FormGroup>
                        <label>Medicine ID</label>
                        <input type="text" value={editingId || generateThreeDigitId()} disabled />
                    </FormGroup>
                </HeaderSection>

                <form onSubmit={handleSubmit}>
                    <FormGroup>
                        <label>Medicine Name</label>
                        <input 
                            type="text" 
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                        />
                    </FormGroup>

                    <FormGroup>
                        <label>Medicine Brand</label>
                        <input 
                            type="text" 
                            name="brand"
                            value={formData.brand}
                            onChange={handleInputChange}
                            required
                        />
                    </FormGroup>

                    <FormGroup>
                        <label>Medicine Description</label>
                        <textarea 
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            required
                        ></textarea>
                    </FormGroup>

                    <FormGroup>
                        <label>Quantity</label>
                        <input 
                            type="number" 
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleInputChange}
                            required
                            min="0"
                        />
                    </FormGroup>

                    <FormGroup>
                        <label>Medicine Expiry</label>
                        <input 
                            type="date" 
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleInputChange}
                            required
                        />
                    </FormGroup>

                    <ButtonGroup>
                        <Button type="submit">{editingId ? 'Update' : 'Add'}</Button>
                        {editingId && (
                            <Button type="button" onClick={() => {
                                setFormData({ name: "", brand: "", description: "", quantity: 0, expiryDate: "" });
                                setEditingId(null);
                            }}>Cancel</Button>
                        )}
                    </ButtonGroup>
                </form>
            </MedicineManagement>

            <MedicineList>
                <SearchSection>
                    <SearchBox>
                        <input 
                            type="text" 
                            placeholder="Search medicine..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button>
                            <Search size={20} />
                            Search
                        </button>
                    </SearchBox>
                </SearchSection>

                <Table>
                    <thead>
                        <tr>
                            <th>Medicine ID</th>
                            <th>Name</th>
                            <th>Brand</th>
                            <th>Quantity</th>
                            <th>Expiry Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMedicines.map((medicine) => (
                            <tr key={medicine.id}>
                                <td>{medicine.id}</td>
                                <td>{medicine.name}</td>
                                <td>{medicine.brand}</td>
                                <td>{medicine.quantity === 0 ? <span style={{ color: 'red', fontWeight: 'bold' }}>OUT OF STOCK</span> : medicine.quantity}</td>
                                <td>{medicine.expiryDate}</td>
                                <td>
                                    <Button onClick={() => handleEdit(medicine)} style={{ marginRight: '5px' }}>Edit</Button>
                                    <Button onClick={() => handleDelete(medicine.id)} className="remove-btn">Delete</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </MedicineList>
        </InventoryContainer>
    );
}

export default ManageInventory;