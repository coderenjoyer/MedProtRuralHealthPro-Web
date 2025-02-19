import React, { useState } from "react";
import styled from "styled-components";
import Select from "react-select";
import { Camera } from "lucide-react";

const medicines = [
  "Aspirin", "Ibuprofen", "Paracetamol", "Amoxicillin", "Metformin", 
  "Lisinopril", "Atorvastatin", "Omeprazole", "Losartan", "Hydrochlorothiazide"
].map(med => ({ label: med, value: med }));

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 30px;
  font-family: Arial, sans-serif;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 100%;
  height: 95%;
  overflow-y: auto;
`;

const Header = styled.h1`
  font-size: 2.4rem;
  color: #111;
  font-weight: bold;
  margin-bottom: 40px;
  text-transform: uppercase;
  text-align: left;
`;

const ContentRow = styled.div`
  display: flex;
  flex: 1;
  gap: 40px;
  align-items: flex-start;
`;

const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 0.6;
`;

const PictureUpload = styled.label`
  width: 220px;
  height: 220px;
  border: 3px solid #4dd0e1;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f9f9f9;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);

  &:hover {
    background-color: #e0f7fa;
    transform: scale(1.05);
  }
`;

const PicturePreview = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
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
`;

const DetailsSection = styled.div`
  flex: 1.4;
  display: flex;
  flex-direction: column;
  width: 100%;
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
`;

const FooterRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-top: 20px;
`;

const Section = styled.div`
  flex: 1;
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
`;

const MedicineList = styled.div`
  margin-top: 10px;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 10px;
  margin-top: 20px;
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

const MainContentPatient = () => {
  const [image, setImage] = useState(null);
  const [allergies, setAllergies] = useState([]);
  const [plannedMeds, setPlannedMeds] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [selectedButton, setSelectedButton] = useState(null);

  const handleQuantityChange = (med, value) => {
    setQuantities({ ...quantities, [med]: value });
  };

  const handleClear = () => {
    setAllergies([]);
    setPlannedMeds([]);
    setQuantities({});
    setImage(null);
    setSelectedButton(null);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleButtonClick = (button) => {
    setSelectedButton(button);
    setTimeout(() => setSelectedButton(null), 100);
  };  

  return (
    <Container>
      <Header>PATIENT INFORMATION</Header>
      <ContentRow>
        <LeftSection>
          <PictureUpload>
            <input type="file" accept="image/*" hidden onChange={handleImageChange} />
            {image ? (
              <PicturePreview src={image} alt="Uploaded Preview" />
            ) : (
              <Camera size={54} color="#555" />
            )}
          </PictureUpload>
          <CommentsSection>
            <CommentsLabel>OTHER COMMENTS:</CommentsLabel>
            <CommentsInput placeholder="Enter comments here..." />
          </CommentsSection>
        </LeftSection>
  
        <DetailsSection>
          {["Patient Name", "Medical Care", "Chief Complaint", "Diagnosis", "Present Illnesses", "Past Illnesses"].map((label, index) => (
            <DetailItem key={index}>
              <Label>{label.toUpperCase()}:</Label>
              <InputField type="text" placeholder={`Enter ${label.toLowerCase()}...`} />
            </DetailItem>
          ))}
  
          <FooterRow>
            <Section>
              <FooterLabel>ALLERGIES / MEDICINES TO AVOID:</FooterLabel>
              <Select 
                options={medicines} 
                isMulti 
                value={allergies} 
                onChange={setAllergies} 
                placeholder="Select medicines..." 
              />
            </Section>
  
            <Section>
              <FooterLabel>PLANNED MEDICINES:</FooterLabel>
              <Select 
                options={medicines} 
                isMulti 
                value={plannedMeds} 
                onChange={setPlannedMeds} 
                placeholder="Select medicines..." 
              />
              <MedicineList>
                {plannedMeds.map(med => (
                  <div key={med.value}>
                    {med.label.toUpperCase()} 
                    <QuantityInput 
                      type="number" 
                      placeholder="Qty" 
                      onChange={(e) => handleQuantityChange(med.value, e.target.value)} 
                    />
                  </div>
                ))}
              </MedicineList>
            </Section>
          </FooterRow>
  
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
              onClick={() => handleButtonClick("input")}
            >
              INPUT
            </Button>
          </ButtonRow>
        </DetailsSection>
      </ContentRow>
    </Container>
  );
};

export default MainContentPatient;