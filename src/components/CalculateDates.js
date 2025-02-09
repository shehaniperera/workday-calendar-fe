import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './HolidayCards.css';
import Select from 'react-select';

const HolidayCards = () => {
  const [startDateTime, setStartDateTime] = useState('');
  const [workingDays, setWorkingDays] = useState('');
  const [holidays, setHolidays] = useState([]);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedHolidays, setSelectedHolidays] = useState([]);
  const [result, setResult] = useState('');


  // Fetch holidays from the API on component mount
  useEffect(() => {
    axios.get('/api/Holiday/GetHolidays')
      .then(response => {
        setHolidays(response?.data); // Assuming API returns an array of holidays
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch holidays');
        setLoading(false);
      });
  }, []);


  const handleAddHoliday = async () => {

    const calculatedWorkDay = {
      startDateTime,
      workingDays: parseFloat(workingDays),
      holidays: selectedHolidays
    };

    try {
      // Sending the holiday data to the backend API
      const response = await axios.post('/api/Workday/CalculateWorkDay', calculatedWorkDay);
      if (response?.status === 200) {
        setResult(response?.data?.result);
        setIsSuccess(true);
      }
    } catch (error) {
      // If there’s an error, display an error message
      setMessage('Failed to add holiday. Please try again!');
      setIsSuccess(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const handleChange = (selected) => {

    const updatedSelectedOptions = selected.map(event => ({
      date: event.date,
      isRecurring: event.isRecurring
    }));

    setSelectedHolidays(updatedSelectedOptions);

  };

  const formattedOptions = holidays?.result?.map(event => ({
    value: event.id,
    label: `${event.name} (${new Date(event.date).toLocaleDateString()})`,
    date: event.date,
    isRecurring: event.isRecurring
  }));

  return (

    <div className="holiday-cards">

      <div className="holiday-form">
        <h4>Start Date and Time</h4>
        <input
          type="datetime-local"
          value={startDateTime}
          onChange={(e) => setStartDateTime(e.target.value)}
        />
        <h4>Working Days (as decimal)</h4>
        <input
          type="number"
          value={workingDays}
          onChange={(e) => setWorkingDays(e.target.value)}
          placeholder="Enter working days"
        />
        <h4>Select Holidays</h4>
        <Select
          isMulti
          options={formattedOptions}
          value={selectedHolidays}
          onChange={handleChange}
          isSearchable
        />

        <button onClick={handleAddHoliday} className="add-btn">
          Calculate WorkDay
        </button>
      </div>

      {/* Display success or error message */}
      {message && (
        <div className={`message ${isSuccess ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      {
        result && (
          <div className="resultContainer">
            <p className="resultText" dangerouslySetInnerHTML={{ __html: result }} />
          </div>
        )
      }


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
