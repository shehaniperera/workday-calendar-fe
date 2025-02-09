import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCalendarCheck, FaCalendarAlt } from 'react-icons/fa'; // Import icons
import './HolidayList.css';
import { Link } from 'react-router-dom'; // Import Link for navigation

const HolidayList = () => {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch holidays from the API on component mount
  useEffect(() => {
    axios.get('/api/Holiday/GetHolidays')
      .then(response => {
        setHolidays(response?.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch holidays');
        setLoading(false);
      });
  }, []);

  // Loading and error handling
  if (loading) {
    return <div className="loading-text">Loading holidays...</div>;
  }

  if (error) {
    return <div className="error-text">{error}</div>;
  }

  return (
    <div className="holiday-cards-container">

      <div className="cards-container">
        <div className="fixed-holidays">
          <Link to="/add-holiday">
          <button className="action-button">Add Holiday</button>
        </Link>
        </div>

        <div className="recurring-holidays">
          <Link to="/calendar">
          <button className="action-button">Holiday Calendar</button>
          </Link>
        </div>

        <div className="recurring-holidays">
          <Link to="/calculate">
          <button className="action-button">Calculate Dates</button>
          </Link>
        </div>

      </div>

      <div className="holiday-list-header">
        <h2 className="holiday-list-title">Holiday List</h2>
        <div className="holiday-count-container">
          <span className="holiday-count-label">Total Holidays:</span>
          <span className="holiday-count">{holidays.count}</span>
        </div>
      </div>

      <div className="holiday-list">
        {holidays?.result?.map((holiday, index) => (
          <div
            key={index}
            className={`holiday-card ${holiday?.isRecurring ? 'recurring-holiday' : 'fixed-holiday'}`}
          >
            <div className="holiday-icon">
              {holiday?.isRecurring ? (
                <FaCalendarCheck size={24} />
              ) : (
                <FaCalendarAlt size={24} />
              )}
            </div>
            <div className="holiday-details">
              <span className={`holiday-type ${holiday?.isRecurring ? 'recurring' : 'fixed'}`}>
                {holiday?.isRecurring ? 'Recurring' : 'Fixed'}
              </span>
              <p className="holiday-name">{holiday?.name}</p>
              <p className="holiday-date">{new Date(holiday?.date)?.toDateString()}</p>
              
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HolidayList;
