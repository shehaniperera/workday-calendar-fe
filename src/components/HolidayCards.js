// components/HolidayCards.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './HolidayCards.css';

const HolidayCards = () => {
  const [holidayName, setHolidayName] = useState('');
  const [holidayDate, setHolidayDate] = useState('');
  const [recurringHoliday, setRecurringHoliday] = useState(false);
  const [holidays, setHolidays] = useState([]);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleAddHoliday = async () => {
    if (holidayName && holidayDate) {
      const newHoliday = {
        name: holidayName,
        date: new Date(holidayDate),
        recurring: recurringHoliday,
      };

      try {
        // Sending the holiday data to the backend API
        const response = await axios.post('api/Holiday/AddHoliday', newHoliday);
        if (response.status === 200) {
          // If the request is successful, add the holiday to the local state
          setHolidays([...holidays, newHoliday]);
          setMessage('Holiday added successfully!');
          setIsSuccess(true);
          // Reset form fields
          setHolidayName('');
          setHolidayDate('');
          setRecurringHoliday(false);
        }
      } catch (error) {
        // If there’s an error, display an error message
        setMessage('Failed to add holiday. Please try again!');
        setIsSuccess(false);
      }
    }
  };


  return (
    <div className="holiday-cards">
      <div className="holiday-form">
        <h4>Holiday Name</h4>
        <input
          type="text"
          value={holidayName}
          onChange={(e) => setHolidayName(e.target.value)}
          placeholder="Enter holiday name"
        />
        <h4>Holiday Date</h4>
        <input
          type="date"
          value={holidayDate}
          onChange={(e) => setHolidayDate(e.target.value)}
        />
        <h5>
          <input
            type="checkbox"
            checked={recurringHoliday}
            onChange={(e) => setRecurringHoliday(e.target.checked)}
          />
          Recurring Holiday (same date every year)
        </h5>

        <button onClick={handleAddHoliday} className="add-btn">Add Holiday</button>
      </div>

      {/* Display success or error message */}
      {message && (
        <div className={`message ${isSuccess ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <div className="cards-container">
        <div className="fixed-holidays">
           <Link to="/">
             Holiday List
           </Link>
        </div>

        <div className="recurring-holidays">
           <Link to="/calculate">
            Calculate Dates
           </Link>
        </div>
      </div>
    </div>
  );
};

export default HolidayCards;
