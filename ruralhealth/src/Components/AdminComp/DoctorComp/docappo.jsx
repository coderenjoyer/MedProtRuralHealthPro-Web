import React, { useState, useRef } from "react";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Clock, Calendar, Camera } from "lucide-react";

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
  flex: 0.4;
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

const DetailsSection = styled.div`
  flex: 1.6;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const DetailItem = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #ddd;
  gap: 20px;
`;

const Label = styled.h3`
  font-size: 1.1rem;
  font-weight: bold;
  color: #555;
  width: 150px;
  text-align: left;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  flex: 1;
`;

const IconWrapper = styled.div`
  position: absolute;
  right: 10px;
  cursor: pointer;
  color: #555;
`;

const InputField = styled.input`
  width: 100%;
  padding: 10px 35px 10px 10px;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  resize: none;
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

const MCappointment = () => {
  const [image, setImage] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState(new Date());
  const [appointmentTime, setAppointmentTime] = useState(new Date());

  const dateRef = useRef(null);
  const timeRef = useRef(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <Container>
      <Header>APPOINTMENT INFORMATION</Header>
      <ContentRow>
        <LeftSection>
          <PictureUpload>
            <input type="file" accept="image/*" hidden onChange={handleImageChange} />
            {image ? <PicturePreview src={image} alt="Uploaded Preview" /> : <Camera size={54} color="#555" />}
          </PictureUpload>
        </LeftSection>

        <DetailsSection>
          {[{ label: "Patient Name", placeholder: "Enter patient name..." }, { label: "Email", placeholder: "Enter email..." }, { label: "Phone Number", placeholder: "Enter phone number..." }].map((item, index) => (
            <DetailItem key={index}>
              <Label>{item.label.toUpperCase()}:</Label>
              <InputWrapper>
                <InputField type="text" placeholder={item.placeholder} />
              </InputWrapper>
            </DetailItem>
          ))}

          <DetailItem>
            <Label>APPOINTMENT DATE:</Label>
            <InputWrapper>
              <DatePicker selected={appointmentDate} onChange={(date) => setAppointmentDate(date)} dateFormat="MMMM d, yyyy" placeholderText="Select a date" customInput={<InputField ref={dateRef} />} />
              <IconWrapper onClick={() => dateRef.current?.focus()}>
                <Calendar size={20} />
              </IconWrapper>
            </InputWrapper>
          </DetailItem>

          <DetailItem>
            <Label>APPOINTMENT TIME:</Label>
            <InputWrapper>
              <DatePicker selected={appointmentTime} onChange={(time) => setAppointmentTime(time)} showTimeSelect showTimeSelectOnly timeIntervals={15} timeCaption="Time" dateFormat="h:mm aa" placeholderText="Select a time" customInput={<InputField ref={timeRef} />} />
              <IconWrapper onClick={() => timeRef.current?.focus()}>
                <Clock size={20} />
              </IconWrapper>
            </InputWrapper>
          </DetailItem>

          <DetailItem>
            <Label>APPOINTMENT DESCRIPTION:</Label>
            <InputWrapper>
              <TextArea placeholder="Enter appointment description..." rows="4" />
            </InputWrapper>
          </DetailItem>

          <ButtonRow>
            <Button>CLEAR</Button>
            <Button>SUBMIT</Button>
          </ButtonRow>
        </DetailsSection>
      </ContentRow>
    </Container>
  );
};

export default MCappointment;