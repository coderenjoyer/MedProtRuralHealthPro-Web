import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Admin from "./Pages/AdminPages/Admin"; 
import Login from "./Pages/Features/Login"; 
import Doctor from "./Pages/DoctorPages/Doctor";
import Regis from "./Pages/PatregisPages/Patregis"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/doctor" element={<Doctor />} />
        <Route path="/registration" element={<Regis />} />
      </Routes>
    </Router>
  );
}

export default App;