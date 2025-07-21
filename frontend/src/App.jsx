import React from "react";
import { Routes, Route } from 'react-router-dom';
import LandingPage from "./pages/LandingPage.jsx";
import RegistrationPage from "./components/RegistrationPage.jsx";
import DailyEntry from './components/DailyEntry.jsx'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/register' element={<RegistrationPage />} />
        <Route path='/daily-entry' element={<DailyEntry />} />
      </Routes>
    </div>
  );
};

export default App;