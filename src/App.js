// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HolidayCalendar from './components/HolidayCalendar';
import HolidayCards from './components/HolidayCards';
import HolidayList from './components/HolidayList';
import CalculateDates from './components/CalculateDates';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <h1>WorkDay Pro</h1>
        <Routes>
          <Route path="/calendar" element={<HolidayCalendar />} />
          <Route path="/add-holiday" element={<HolidayCards />} />
          <Route path="/" element={<HolidayList />} />
          <Route path="/calculate" element={<CalculateDates />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
