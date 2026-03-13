# 🏥 MedProt Rural Health Pro

A healthcare management platform designed for clinics and rural healthcare facilities. MedProt digitizes common healthcare workflows — from patient records and prescriptions to queue management and medicine inventory — in a single centralized platform.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
  - [Authentication](#authentication-system)
  - [Patient Features](#patient-features)
  - [Doctor Features](#doctor-features)
  - [Staff Features](#staff-features)
  - [Chat System](#chat-system)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Future Improvements](#future-improvements)
- [License](#license)

---

## Overview

MedProt Rural Health Pro supports role-based access for **Patients**, **Doctors**, **Healthcare Staff**, and **System Administrators**, ensuring each user type only interacts with features relevant to their responsibilities.

The goal is to improve efficiency and accessibility of healthcare services in rural environments.

---

## Features

### Authentication System

Multi-step authentication with:

- Login via **First Name**, **Last Name**, **Mobile Number**, **Email**, and **PIN**
- **OTP verification** for identity confirmation
- **Device session recognition**
- **Quick Login** — if an account already exists on the device, only a PIN is required

---

### Patient Features

**Dashboard**
- View prescribed medicines, health information, and notifications
- Only medicines from doctor prescriptions are displayed

**Queue Management**
- Get a queue number before consultation
- Monitor real-time queue status

**Medical Records**
- View personal and family medical records
- Vaccine timeline and Digital Yellow Card
- Edit personal health data:
  - Height, Weight, Blood Type
  - BMI auto-calculated: `BMI = weight / height²`
  - Blood type options: `A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`, `O+`, `O-`

---

### Doctor Features

**Doctor Dashboard**
- View and manage patient consultations
- Manage prescriptions
- Access patient records
- Communicate with patients

---

### Staff Features

**Staff Dashboard**
- Manage patient queues
- Monitor clinic activity

**Medicine Inventory (Botike Management)**
- View and update medicine inventory
- Track stock levels and monitor medicine availability

---

### Chat System

- Patient-to-provider messaging
- Conversation tracking per authenticated user

---

## Project Structure

```
/components
/modules
  /chat
  /inventory
  /queue
  /records
/doctor
/staff
/auth
/navigation
```

---

## Tech Stack

- **Frontend:** React / React Native
- **Language:** JavaScript / TypeScript
- **Backend:** Node.js, REST APIs
- **Database:** Database storage (TBD)

---

## Getting Started

### Prerequisites

- Node.js installed
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/coderenjoyer/MedProtRuralHealthPro-Web.git

# Navigate into the project
cd MedProtRuralHealthPro-Web

# Install dependencies
npm install

# Start the development server
npm run dev
```

---

## Future Improvements

- [ ] Telemedicine consultations
- [ ] Electronic prescriptions
- [ ] Advanced analytics for clinics
- [ ] Integration with national health systems
- [ ] Offline support for rural environments

---

## License

This project is licensed under the [MIT License](LICENSE).
