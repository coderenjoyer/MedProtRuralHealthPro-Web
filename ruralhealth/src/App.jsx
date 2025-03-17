import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Admin from "./Pages/AdminPages/Admin"; 
import Login from "./Pages/Features/Login"; 
import Doctor from "./Pages/DoctorPages/Doctor";
import Front from "./Pages/PatregisPages/Patregis"
import Specialist from "./Pages/SpecialistPages/Specialist"
import Appointment from "./Components/PatRegisComp/PatAppo"


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/doctor" element={<Doctor />} />
        <Route path="/front" element={<Front />} />
        <Route path="/spec" element={<Specialist />} />
        <Route path="/Appo" element={<Appointment />} />
      </Routes>
    </Router>
  );
}

export default App;