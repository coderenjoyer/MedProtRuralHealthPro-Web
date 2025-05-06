import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Select from "react-select";
import { Camera } from "lucide-react";
import { ref, onValue, update } from "firebase/database";
import { database } from "../../Firebase/firebase";
import { toast } from "react-toastify";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  font-family: Arial, sans-serif;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  height: 100%;
  overflow: hidden;
  min-height: 0;
  box-sizing: border-box;
`;

const Header = styled.h1`
  font-size: 2.4rem;
  color: #111;
  font-weight: bold;
  margin-bottom: 20px;
  text-transform: uppercase;
  text-align: left;
  flex-shrink: 0;
`;

const ContentRow = styled.div`
  display: flex;
  flex: 1;
  gap: 20px;
  align-items: flex-start;
  overflow: hidden;
  min-height: 0;
  box-sizing: border-box;
`;

const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 300px;
  overflow-y: auto;
  padding-right: 10px;
  flex-shrink: 0;
  box-sizing: border-box;
  max-height: calc(100vh - 200px);
  
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const CommentsSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 20px;
`;

const CommentsLabel = styled.label`
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
`;

const CommentsInput = styled.textarea`
  width: 100%;
  height: 120px;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  resize: none;
  font-size: 1rem;
  background-color: #ffffff;
  color: #333333;
`;

const DetailsSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding-right: 10px;
  min-width: 400px;
  box-sizing: border-box;
  max-height: calc(100vh - 200px);
  
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const DetailItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #ddd;
`;

const Label = styled.h3`
  font-size: 1.1rem;
  font-weight: bold;
  color: #555;
  flex: 1;
`;

const InputField = styled.input`
  flex: 2;
  padding: 7px;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #ffffff;
  color: #333333;

  &:disabled {
    background-color: #f5f5f5;
    color: #666666;
  }
`;

const FooterRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-top: 20px;
  flex-wrap: wrap;
  flex-shrink: 0;
`;

const Section = styled.div`
  flex: 1;
  min-width: 200px;
  max-width: 100%;
`;

const FooterLabel = styled.h4`
  font-size: 1rem;
  font-weight: bold;
  color: #555;
  margin-bottom: 5px;
`;

const QuantityInput = styled.input`
  width: 60px;
  padding: 5px;
  margin-left: 10px;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #ffffff;
  color: #333333;
`;

const MedicineList = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #f9f9f9;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const MedicineItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 10px;
  margin-top: 20px;
  flex-shrink: 0;
  margin-bottom: 20px;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  background-color: #4dd0e1;
  color: black;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  justify-content: center;
  transition: background-color 0.2s ease, transform 0.1s ease, box-shadow 0.2s ease;
  outline: none !important;
  font-size: 1rem;
  font-weight: bold;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);

  &:hover {
    background-color: #00bcd4;
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
    outline: none !important;
  }

  &:active {
    background-color: #e0f7fa;
    transform: scale(0.96);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    outline: none !important;
  }

  &:focus {
    outline: none !important;
    box-shadow: none !important;
  }
`;

const MedicineTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const TableHeader = styled.th`
  background-color: #4dd0e1;
  color: white;
  padding: 12px;
  text-align: left;
  font-weight: bold;
`;

const TableCell = styled.td`
  padding: 12px;
  border-bottom: 1px solid #eee;
  color: #333;
`;

const TableRow = styled.tr`
  &:hover {
    background-color: #f5f5f5;
  }
`;

const MainContentPatient = ({ selectedPatient }) => {
  const [allergies, setAllergies] = useState([]);
  const [plannedMeds, setPlannedMeds] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [selectedButton, setSelectedButton] = useState(null);
  const [availableMedicines, setAvailableMedicines] = useState([]);
  const [formData, setFormData] = useState({
    patientName: "",
    medicalCare: "",
    chiefComplaint: "",
    diagnosis: "",
    presentIllnesses: "",
    pastIllnesses: "",
    comments: ""
  });

  const getFilteredMedicines = () => {
    const allergyValues = allergies.map(med => med.value);
    return availableMedicines.filter(med => !allergyValues.includes(med.name));
  };

  // Update planned medicines when allergies change
  useEffect(() => {
    const allergyValues = allergies.map(med => med.value);
    setPlannedMeds(prev => prev.filter(med => !allergyValues.includes(med.value)));
  }, [allergies]);

  useEffect(() => {
    // Fetch available medicines from Firebase
    const medicinesRef = ref(database, "rhp/medicines");
    const unsubscribeMedicines = onValue(medicinesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const medicinesList = Object.entries(data).map(([id, medicine]) => ({
          id,
          ...medicine,
        }));
        setAvailableMedicines(medicinesList);
      }
    });

    return () => unsubscribeMedicines();
  }, []);

  useEffect(() => {
    if (selectedPatient) {
      // Load patient data when a patient is selected
      const patientRef = ref(database, `rhp/patients/${selectedPatient.id}`);
      const unsubscribe = onValue(patientRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setFormData(prev => ({
            ...prev,
            patientName: `${data.personalInfo.firstName} ${data.personalInfo.lastName}`,
            medicalCare: data.medicalInfo?.medications?.join(", ") || "",
            chiefComplaint: "",
            diagnosis: "",
            presentIllnesses: data.medicalInfo?.existingConditions?.join(", ") || "",
            pastIllnesses: "",
            comments: ""
          }));
          setAllergies((data.medicalInfo?.allergies || []).map(med => ({ label: med, value: med })));
        }
      });

      return () => unsubscribe();
    }
  }, [selectedPatient]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleQuantityChange = (med, value) => {
    setQuantities({ ...quantities, [med]: value });
  };

  const handleClear = () => {
    setAllergies([]);
    setPlannedMeds([]);
    setQuantities({});
    setSelectedButton(null);
    setFormData({
      patientName: selectedPatient ? `${selectedPatient.personalInfo.firstName} ${selectedPatient.personalInfo.lastName}` : "",
      medicalCare: "",
      chiefComplaint: "",
      diagnosis: "",
      presentIllnesses: "",
      pastIllnesses: "",
      comments: ""
    });
  };

  const handleButtonClick = (button) => {
    setSelectedButton(button);
    setTimeout(() => setSelectedButton(null), 100);
  };

  const handleSubmit = async () => {
    if (!selectedPatient) {
      toast.error("Please select a patient first");
      return;
    }

    try {
      // Create updates object for all changes
      const updates = {};

      // Update patient information
      updates[`rhp/patients/${selectedPatient.id}/medicalInfo`] = {
        allergies: allergies.map(med => med.value),
        existingConditions: formData.presentIllnesses.split(",").map(condition => condition.trim()),
        medications: plannedMeds.map(med => `${med.label} (${quantities[med.value] || 0})`)
      };
      
      updates[`rhp/patients/${selectedPatient.id}/registrationInfo/lastVisit`] = new Date().toISOString();

      // Update medicine quantities
      plannedMeds.forEach(med => {
        const medicine = availableMedicines.find(m => m.name === med.label);
        if (medicine) {
          const prescribedQuantity = parseInt(quantities[med.value]) || 0;
          const newStock = medicine.quantity - prescribedQuantity;
          if (newStock < 0) {
            throw new Error(`Insufficient stock for ${med.label}`);
          }
          updates[`rhp/medicines/${medicine.id}/quantity`] = newStock;
        }
      });

      // Apply all updates in one transaction
      await update(ref(database), updates);
      toast.success("Patient information updated successfully");
      handleClear();
    } catch (error) {
      console.error("Error updating patient:", error);
      toast.error(error.message || "Failed to update patient information");
    }
  };

  return (
    <Container>
      <Header>PATIENT INFORMATION</Header>
      <ContentRow>
        <LeftSection>
          <CommentsSection>
            <CommentsLabel>OTHER COMMENTS:</CommentsLabel>
            <CommentsInput 
              name="comments"
              value={formData.comments}
              onChange={handleInputChange}
              placeholder="Enter comments here..." 
            />
          </CommentsSection>
        </LeftSection>
  
        <DetailsSection>
          {[
            { name: "patientName", label: "Patient Name" },
            { name: "medicalCare", label: "Medical Care" },
            { name: "chiefComplaint", label: "Chief Complaint" },
            { name: "diagnosis", label: "Diagnosis" },
            { name: "presentIllnesses", label: "Present Illnesses" },
            { name: "pastIllnesses", label: "Past Illnesses" }
          ].map((field) => (
            <DetailItem key={field.name}>
              <Label>{field.label.toUpperCase()}:</Label>
              <InputField 
                type="text" 
                name={field.name}
                value={formData[field.name]}
                onChange={handleInputChange}
                placeholder={`Enter ${field.label.toLowerCase()}...`}
                disabled={field.name === "patientName"}
              />
            </DetailItem>
          ))}
  
          <FooterRow>
            <Section>
              <FooterLabel>ALLERGIES / MEDICINES TO AVOID:</FooterLabel>
              <Select 
                options={availableMedicines.map(med => ({ label: med.name, value: med.name }))} 
                isMulti 
                value={allergies} 
                onChange={setAllergies} 
                placeholder="Select medicines..."
                styles={{
                  control: (base) => ({
                    ...base,
                    backgroundColor: '#ffffff',
                  }),
                  input: (base) => ({
                    ...base,
                    color: '#333333',
                  }),
                  option: (base) => ({
                    ...base,
                    backgroundColor: '#ffffff',
                    color: '#333333',
                    '&:hover': {
                      backgroundColor: '#f0f0f0',
                    },
                  }),
                }}
              />
            </Section>
  
            <Section>
              <FooterLabel>PLANNED MEDICINES:</FooterLabel>
              <Select 
                options={getFilteredMedicines().map(med => ({ label: med.name, value: med.name }))} 
                isMulti 
                value={plannedMeds} 
                onChange={setPlannedMeds} 
                placeholder="Select medicines..."
                styles={{
                  control: (base) => ({
                    ...base,
                    backgroundColor: '#ffffff',
                  }),
                  input: (base) => ({
                    ...base,
                    color: '#333333',
                  }),
                  option: (base) => ({
                    ...base,
                    backgroundColor: '#ffffff',
                    color: '#333333',
                    '&:hover': {
                      backgroundColor: '#f0f0f0',
                    },
                  }),
                }}
              />
              <MedicineList>
                {plannedMeds.map(med => (
                  <MedicineItem key={med.value}>
                    <span>{med.label.toUpperCase()}</span>
                    <QuantityInput 
                      type="number" 
                      placeholder="Qty" 
                      value={quantities[med.value] || ""}
                      onChange={(e) => handleQuantityChange(med.value, e.target.value)} 
                    />
                    <InputField 
                      type="text" 
                      placeholder="Enter prescribed quantity..." 
                      value={quantities[med.value] || ""}
                      onChange={(e) => handleQuantityChange(med.value, e.target.value)} 
                    />
                  </MedicineItem>
                ))}
              </MedicineList>
            </Section>
          </FooterRow>

          <Section>
            <FooterLabel>AVAILABLE MEDICINES:</FooterLabel>
            <MedicineTable>
              <thead>
                <tr>
                  <TableHeader>Name</TableHeader>
                  <TableHeader>Brand</TableHeader>
                  <TableHeader>Quantity</TableHeader>
                  <TableHeader>Expiry</TableHeader>
                </tr>
              </thead>
              <tbody>
                {availableMedicines.map((medicine) => (
                  <TableRow key={medicine.id}>
                    <TableCell>{medicine.name}</TableCell>
                    <TableCell>{medicine.brand || "N/A"}</TableCell>
                    <TableCell>{medicine.quantity || "N/A"}</TableCell>
                    <TableCell>{medicine.expiryDate}</TableCell>
                  </TableRow>
                ))}
              </tbody>
            </MedicineTable>
          </Section>
  
          <ButtonRow>
            <Button 
              className={selectedButton === "clear" ? "selected" : ""} 
              onClick={() => {
                handleButtonClick("clear");
                handleClear();
              }}
            >
              CLEAR
            </Button>
  
            <Button 
              className={selectedButton === "input" ? "selected" : ""} 
              onClick={() => {
                handleButtonClick("input");
                handleSubmit();
              }}
            >
              SAVE
            </Button>
          </ButtonRow>
        </DetailsSection>
      </ContentRow>
    </Container>
  );
};

export default MainContentPatient;