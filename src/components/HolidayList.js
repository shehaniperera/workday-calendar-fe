import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCalendarCheck, FaCalendarAlt, FaTrashAlt } from 'react-icons/fa'; // Import trash icon
import './HolidayList.css';
import { Link } from 'react-router-dom';

const HolidayList = () => {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
   const [message, setMessage] = useState('');
   const [isSuccess, setIsSuccess] = useState(false);

  // get holidays
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

  // deleting a holiday
  const deleteHoliday = (holidayId) => {
    axios.delete(`/api/Holiday/DeleteHoliday?id=${holidayId}`)
      .then(() => {
        setHolidays(prevHolidays => {
          if (prevHolidays && Array.isArray(prevHolidays.result)) {
            return {
              ...prevHolidays,
              result: prevHolidays.result.filter(holiday => holiday.id !== holidayId), 
              count: prevHolidays.count - 1 
            };
          }
          return prevHolidays; 
        });
        setMessage('Holiday deleted successfully!');
        setIsSuccess(true);
      })
      .catch(err => {
        setError('Failed to delete holiday');
        setMessage('Failed to delete holiday. Please try again!');
        setIsSuccess(false);
      });
  };

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
            <div className="holiday-delete">
              <button
                className="delete-button"
                onClick={() => deleteHoliday(holiday?.id)}
              >
                <FaTrashAlt size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Display success or error message */}
      {message && (
        <div className={`message ${isSuccess ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

    </div>
  );
};

export default HolidayList;
