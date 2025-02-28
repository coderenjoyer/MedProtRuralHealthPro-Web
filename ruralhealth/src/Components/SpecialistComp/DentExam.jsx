"use client"

import { useState } from "react"
import styled from "styled-components"
import { motion } from "framer-motion"

const ExaminationContainer = styled(motion.div)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  overflow: hidden;
  min-width: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
`

const ExaminationHeader = styled.div`
  background: linear-gradient(90deg, ${({ theme }) => theme.colors.secondaryDark} 0%, ${({ theme }) => theme.colors.secondary} 100%);
  color: white;
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const ExaminationTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
`

const PatientNumber = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const PatientNumberLabel = styled.span`
  font-size: 0.875rem;
`

const PatientNumberValue = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  background-color: rgba(255, 255, 255, 0.2);
  padding: 0.25rem 0.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
`

const ExaminationForm = styled.form`
  padding: 1rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  overflow-y: auto;
  flex: 1;
`

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondaryDark};
  margin-bottom: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.grayLight};
`

const FormRow = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
`

const FormLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.grayDark};
  width: 140px;
  flex-shrink: 0;
`

const FormInput = styled.input`
  flex: 1;
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.grayLight};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.875rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primaryLight};
  }
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid ${({ theme }) => theme.colors.grayLight};
`

const Button = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
`

const ClearButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.grayLight};
  color: ${({ theme }) => theme.colors.grayDark};

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray};
    color: white;
  }
`

const SubmitButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }
`

const DentalExamination = () => {
  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    address: "",
    phoneNumber: "",
    previousIssues: "",
    allergies: "",
    currentMedications: "",
    teethCondition: "",
    gums: "",
    treatment: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleClear = () => {
    setFormData({
      lastName: "",
      firstName: "",
      address: "",
      phoneNumber: "",
      previousIssues: "",
      allergies: "",
      currentMedications: "",
      teethCondition: "",
      gums: "",
      treatment: "",
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission
    console.log(formData)
  }

  return (
    <ExaminationContainer initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <ExaminationHeader>
        <ExaminationTitle>Dental Examination</ExaminationTitle>
        <PatientNumber>
          <PatientNumberLabel>Patient Number</PatientNumberLabel>
          <PatientNumberValue>_____</PatientNumberValue>
        </PatientNumber>
      </ExaminationHeader>

      <ExaminationForm onSubmit={handleSubmit}>
        <FormSection>
          <FormRow>
            <FormLabel>Name</FormLabel>
            <FormInput
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
            />
            <FormInput
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
            />
          </FormRow>

          <FormRow>
            <FormLabel>Address</FormLabel>
            <FormInput
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
            />
          </FormRow>

          <FormRow>
            <FormLabel>Phone Number</FormLabel>
            <FormInput
              type="text"
              name="phoneNumber"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
          </FormRow>
        </FormSection>

        <FormSection>
          <SectionTitle>Dental History</SectionTitle>

          <FormRow>
            <FormLabel>Previous Dental Issues</FormLabel>
            <FormInput type="text" name="previousIssues" value={formData.previousIssues} onChange={handleChange} />
          </FormRow>

          <FormRow>
            <FormLabel>Allergies</FormLabel>
            <FormInput type="text" name="allergies" value={formData.allergies} onChange={handleChange} />
          </FormRow>

          <FormRow>
            <FormLabel>Current Medications</FormLabel>
            <FormInput
              type="text"
              name="currentMedications"
              value={formData.currentMedications}
              onChange={handleChange}
            />
          </FormRow>
        </FormSection>

        <FormSection>
          <SectionTitle>Examination Findings</SectionTitle>

          <FormRow>
            <FormLabel>Condition of Teeth</FormLabel>
            <FormInput type="text" name="teethCondition" value={formData.teethCondition} onChange={handleChange} />
          </FormRow>

          <FormRow>
            <FormLabel>Gums</FormLabel>
            <FormInput type="text" name="gums" value={formData.gums} onChange={handleChange} />
          </FormRow>

          <FormRow>
            <FormLabel>Treatment</FormLabel>
            <FormInput type="text" name="treatment" value={formData.treatment} onChange={handleChange} />
          </FormRow>
        </FormSection>

        <ButtonContainer>
          <ClearButton type="button" onClick={handleClear} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            Clear
          </ClearButton>
          <SubmitButton type="submit" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            Submit
          </SubmitButton>
        </ButtonContainer>
      </ExaminationForm>
    </ExaminationContainer>
  )
}

export default DentalExamination

