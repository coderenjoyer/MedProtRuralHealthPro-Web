import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Admin from "./Pages/AdminPages/Admin"; 
import Login from "./Pages/Features/Login"; 
import Doctor from "./Pages/DoctorPages/Doctor";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/doctor" element={<Doctor />} />
      </Routes>
    </Router>
  );
}

export default App;