import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Admin from "./Pages/Admin"; // Create this component for the /admin route
import Login from "./Pages/Login"; // Create this component for the / route

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;