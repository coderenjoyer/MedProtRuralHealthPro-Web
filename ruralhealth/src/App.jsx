import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Admin from "./Pages/AdminPages/Admin"; 
import Login from "./Pages/Features/Login"; 
import Doctor from "./Pages/DoctorPages/Doctor";
import Front from "./Pages/PatregisPages/Patregis"
import Specialist from "./Pages/SpecialistPages/Specialist"
import Appointment from "./Components/PatRegisComp/PatAppo"
import UserDatabase from "./Pages/AdminPages/Userdatabase"
import PatientDatabase from "./Pages/AdminPages/PatientDatabase"
import MedicineInventory from "./Pages/Features/MedInven"
import AdminAppointments from "./Pages/AdminPages/AdminAppointments"
import ProtectedRoute from "./Components/ProtectedRoute"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedUserTypes={["Staff-Admin"]}>
            <Admin />
          </ProtectedRoute>
        } />
        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedUserTypes={["Staff-Admin"]}>
            <Admin />
          </ProtectedRoute>
        } />
        <Route path="/admin/user-database" element={
          <ProtectedRoute allowedUserTypes={["Staff-Admin"]}>
            <UserDatabase />
          </ProtectedRoute>
        } />
        <Route path="/admin/patient-database" element={
          <ProtectedRoute allowedUserTypes={["Staff-Admin"]}>
            <PatientDatabase />
          </ProtectedRoute>
        } />
        <Route path="/admin/medicine-inventory" element={
          <ProtectedRoute allowedUserTypes={["Staff-Admin"]}>
            <MedicineInventory />
          </ProtectedRoute>
        } />
        <Route path="/admin/appointments" element={
          <ProtectedRoute allowedUserTypes={["Staff-Admin"]}>
            <AdminAppointments />
          </ProtectedRoute>
        } />
        
        {/* Other Routes */}
        <Route path="/doctor" element={
          <ProtectedRoute allowedUserTypes={["Doctor-Physician"]}>
            <Doctor />
          </ProtectedRoute>
        } />
        <Route path="/front" element={
          <ProtectedRoute allowedUserTypes={["Staff-FrontDesk"]}>
            <Front />
          </ProtectedRoute>
        } />
        <Route path="/spec" element={
          <ProtectedRoute allowedUserTypes={["Specialist-Dentist"]}>
            <Specialist />
          </ProtectedRoute>
        } />
        <Route path="/Appo" element={
          <ProtectedRoute allowedUserTypes={["Staff-FrontDesk"]}>
            <Appointment />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;