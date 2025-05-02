  import React, { useEffect, useState } from 'react';
  import { Search } from 'lucide-react';
  import { ref, onValue, set, remove, update } from "firebase/database";
  import { database } from "../../Firebase/firebase";
  import { toast } from "react-toastify";
  import styled from "styled-components";

  // Styled Components
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

    .invalid-feedback {
      color: red;
      font-size: 12px;
      margin-top: 5px;
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

    .out-of-stock {
      color: #dc3545;
      font-weight: bold;
    }

    button {
      background: #17a2b8;
      color: white;
      border: none;
      padding: 6px 10px;
      border-radius: 4px;
      cursor: pointer;
    }

    .remove-btn {
      background-color: #dc3545;
      margin-left: 5px;
    }
      .out-of-stock {
      color: #dc3545;
      font-weight: bold;
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
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
      const medicinesRef = ref(database, 'rhp/medicines');
      const unsubscribe = onValue(medicinesRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const list = Object.entries(data).map(([id, val]) => ({
            id,
            ...val
          }));
          setMedicines(list);
        } else {
          setMedicines([]);
        }
      });
      return () => unsubscribe();
    }, []);

    const generateThreeDigitId = () => {
      const ids = medicines.map(m => parseInt(m.id));
      let newId;
      do {
        newId = Math.floor(Math.random() * 900) + 100;
      } while (ids.includes(newId));
      return newId.toString();
    };

    const validateForm = () => {
      const errors = {};
      let valid = true;

      if (!formData.name.trim()) {
        errors.name = "Name is required";
        valid = false;
      }

      const qty = parseInt(formData.quantity);
      if (isNaN(qty) || qty < 0) {
        errors.quantity = "Quantity must be a non-negative number";
        valid = false;
      }

      if (formData.expiryDate) {
        const selected = new Date(formData.expiryDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selected < today) {
          errors.expiryDate = "Date can't be in the past";
          valid = false;
        }
      }

      setFormErrors(errors);
      return valid;
    };

    const handleChange = e => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
      if (!validateForm()) return;

      try {
        const exists = medicines.some(m => 
          m.name.toLowerCase() === formData.name.toLowerCase() && m.id !== editingId
        );

        if (exists) {
          toast.error("Medicine with this name already exists!");
          return;
        }

        const data = {
          ...formData,
          quantity: Number(formData.quantity)
        };

        if (editingId) {
          await update(ref(database, `rhp/medicines/${editingId}`), data);
          toast.success("Medicine updated");
        } else {
          const id = generateThreeDigitId();
          await set(ref(database, `rhp/medicines/${id}`), data);
          toast.success("Medicine added");
        }

        setFormData({ name: "", brand: "", description: "", quantity: 0, expiryDate: "" });
        setEditingId(null);
      } catch (err) {
        toast.error("Error saving medicine: " + err.message);
      }
    };

    const handleEdit = med => {
      setFormData({ ...med });
      setEditingId(med.id);
    };

    const handleDelete = async id => {
      if (window.confirm("Delete this medicine?")) {
        try {
          await remove(ref(database, `rhp/medicines/${id}`));
          toast.success("Deleted successfully");
        } catch (err) {
          toast.error("Delete failed: " + err.message);
        }
      }
    };

    const filteredMedicines = medicines.filter(med =>
      med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.brand.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <InventoryContainer>
        <MedicineManagement>
          <HeaderSection>
            <SectionTitle>Medicine Management</SectionTitle>
          </HeaderSection>

          <FormGroup>
            <label>Name *</label>
            <input 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
            />
            {formErrors.name && <div className="invalid-feedback">{formErrors.name}</div>}
          </FormGroup>

          <FormGroup>
            <label>Brand</label>
            <input 
              name="brand" 
              value={formData.brand} 
              onChange={handleChange} 
            />
          </FormGroup>

          <FormGroup>
            <label>Description</label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
            />
          </FormGroup>

          <FormGroup>
            <label>Quantity *</label>
            <input 
              type="number" 
              name="quantity" 
              value={formData.quantity} 
              onChange={handleChange}
            />
            {formErrors.quantity && <div className="invalid-feedback">{formErrors.quantity}</div>}
          </FormGroup>

          <FormGroup>
            <label>Expiry Date</label>
            <input 
              type="date" 
              name="expiryDate" 
              value={formData.expiryDate} 
              onChange={handleChange}
            />
            {formErrors.expiryDate && <div className="invalid-feedback">{formErrors.expiryDate}</div>}
          </FormGroup>

          <ButtonGroup>
            <Button onClick={handleSubmit}>{editingId ? "Update" : "Add"} Medicine</Button>
            {editingId && (
              <Button className="remove-btn" onClick={() => {
                setFormData({ name: "", brand: "", description: "", quantity: 0, expiryDate: "" });
                setEditingId(null);
              }}>
                Cancel
              </Button>
            )}
          </ButtonGroup>
        </MedicineManagement>

        <MedicineList>
          <SearchSection>
            <SearchBox>
              <input 
                type="text" 
                placeholder="Search medicine..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              <button><Search size={20} />Search</button>
            </SearchBox>
          </SearchSection>

          <Table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Brand</th>
                <th>Qty</th>
                <th>Expiry</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMedicines.map(med => (
                <tr key={med.id}>
                  <td>{med.id}</td>
                  <td>{med.name}</td>
                  <td>{med.brand}</td>
                  <td className={med.quantity === 0 ? "out-of-stock" : ""}>
                      {med.quantity === 0 ? "Out of stock" : med.quantity}
                  </td>
                  <td>{med.expiryDate}</td>
                  <td>
                    <button onClick={() => handleEdit(med)}>Edit</button>
                    <button className="remove-btn" onClick={() => handleDelete(med.id)}>Delete</button>
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
