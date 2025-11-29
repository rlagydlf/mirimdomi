import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Main from "./pages/Main";
import LaundryResv from "./pages/laundryResv";
import ProfileDetail from "./pages/ProfileDetail";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/laundryResv" element={<LaundryResv />} />
        <Route path="/profiledetail" element={<ProfileDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
