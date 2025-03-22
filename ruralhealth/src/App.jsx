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
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/dashboard" element={<Admin />} />
        <Route path="/admin/user-database" element={<UserDatabase />} />
        <Route path="/admin/patient-database" element={<PatientDatabase />} />
        <Route path="/admin/medicine-inventory" element={<MedicineInventory />} />

        
        {/* Other Routes */}
        <Route path="/doctor" element={<Doctor />} />
        <Route path="/front" element={<Front />} />
        <Route path="/spec" element={<Specialist />} />
        <Route path="/Appo" element={<Appointment />} />
      </Routes>
    </Router>
  );
}

export default App;