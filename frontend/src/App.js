import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import SignUp from "./page/signup/Signup";
import Login from "./page/login/Login";
import Home from "./page/Home";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;

