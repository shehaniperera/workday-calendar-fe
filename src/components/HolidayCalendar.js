import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import axios from 'axios';
import './HolidayCalendar.css';
import { Link } from 'react-router-dom';

const HolidayCalendar = () => {
  // States to store holidays, loading, and error status
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch holidays from the API on component mount
  useEffect(() => {
    axios
      .get('/api/Holiday/GetHolidays')
      .then(response => {
        setHolidays(response?.data?.result); // Assuming API returns an array of holidays
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch holidays');
        setLoading(false);
      });
  }, []);

  // Function to assign classes to tiles based on whether the date is a holiday
  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const holiday = holidays.find((holiday) => {
        const holidayDate = new Date(holiday.date); // Convert string to Date
        return (
          holidayDate.getDate() === date.getDate() &&
          holidayDate.getMonth() === date.getMonth() &&
          holidayDate.getFullYear() === date.getFullYear()
        );
      });
      if (holiday) {
        return holiday.isRecurring ? 'recurring-holiday' : 'fixed-holiday';
      }
    }
    return null;
  };

  // Add content to each tile to show holiday names
  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const holiday = holidays.find((holiday) => {
        const holidayDate = new Date(holiday.date); // Convert string to Date
        return (
          holidayDate.getDate() === date.getDate() &&
          holidayDate.getMonth() === date.getMonth() &&
          holidayDate.getFullYear() === date.getFullYear()
        );
      });

      if (holiday) {
        return <span className="holiday-name">{holiday.name}</span>; // Display holiday name
      }
    }
    return null;
  }

  // Show loading or error states if applicable
  if (loading) {
    return <div>Loading holidays...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="calendar-container">
      <h2>Holiday Calendar</h2>
      <div className="calendar-wrapper">
        <Calendar
          tileClassName={tileClassName} // Apply different classes for recurring and fixed holidays
          tileContent={tileContent} // Show holiday names on the calendar tiles
        />
      </div>
      
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

export default HolidayCalendar;
