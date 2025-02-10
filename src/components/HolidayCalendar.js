import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import axios from 'axios';
import './HolidayCalendar.css';
import { Link } from 'react-router-dom';

const HolidayCalendar = () => {
 
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // get holidays
  useEffect(() => {
    axios
      .get('/api/Holiday/GetHolidays')
      .then(response => {
        setHolidays(response?.data?.result); 
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch holidays');
        setLoading(false);
      });
  }, []);

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const holiday = holidays.find((holiday) => {
        const holidayDate = new Date(holiday.date);
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

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const holiday = holidays.find((holiday) => {
        const holidayDate = new Date(holiday.date); 
        return (
          holidayDate.getDate() === date.getDate() &&
          holidayDate.getMonth() === date.getMonth() &&
          holidayDate.getFullYear() === date.getFullYear()
        );
      });

      if (holiday) {
        return <span className="holiday-name">{holiday.name}</span>; 
      }
    }
    return null;
  }

  // loading or error
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
          tileClassName={tileClassName} 
          tileContent={tileContent} 
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
