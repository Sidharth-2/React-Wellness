import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { apiClient } from '../utils/apiClient';

const DailyCheckIn = () => {
  const [mood, setMood] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [checkins, setCheckins] = useState([]);
  const [average, setAverage] = useState(null);
  const [progress, setProgress] = useState(65); // you can dynamically update this

const fetchCheckins = useCallback(() => {

    const token = localStorage.getItem('token'); 

    apiClient('http://localhost:8081/api/checkin/checkins')
      .then(data =>  {

        if (data.success){

        const sorted = data.data.sort((a, b) => b.id - a.id);
        const last10 = sorted.slice(0, 10);
        const avg = last10.reduce((sum, item) => sum + item.progress, 0) / last10.length;

        setCheckins(sorted);
        setAverage(Math.round(avg));

        }
      }

      )
      .catch(error => console.error('Error fetching check-ins:', error));
  }, []);

   useEffect(() => {      
      fetchCheckins();
  },  [fetchCheckins]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

        const token = localStorage.getItem('token'); 

     if (!mood.trim()) {
      setError('Mood is required.');
      return;
    }

    if (!notes.trim()) {
      setError('Notes are required.');
      return;
    }

    if (progress<10) {
      setError('progress are required more than 10.');
      return;
    }

    try {

      const response = await axios.post(
        'http://localhost:8081/api/checkin',
        {
          mood: mood.trim(),
          notes: notes.trim(),
          progress
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log('✅ Check-in successful:', response.data);
      toast.success('Check-in submitted successfully!');  // Toast success message
      setMood('');
      setNotes('');
      fetchCheckins();
    } catch (error) {
      console.error('❌ Error in check-in:', error.message);
      toast.error('Failed to submit. Please try again.');
    }

  };

  return (

  <div className="p-6">
    <ToastContainer position="top-right" autoClose={3000} />
    <form onSubmit={handleSubmit} className="space-y-4 mt-6">

      {error && (
        <div className="text-red-600 font-semibold ml-5">{error}</div>
      )}

      <label className="block text-lg font-semibold ml-5">How are you feeling today?</label>
      <div className="flex items-center gap-4 ml-5 mt-4">
      
      <input
        type="text"
        value={mood}
        onChange={(e) => setMood(e.target.value)}
        className="border p-2 w-50 ml-5"
        placeholder="e.g., Energetic, Stressed"
      />

     <div className="ml-5 flex items-center gap-4">
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={(e) => setProgress(e.target.value)}
          className="w-full accent-yellow-400"
          style={{ width: '200px' }}
        />
        <div className="text-green-600 font-semibold mt-1 text-right">
          {progress}%
        </div>
      </div>
      <input
        type="text"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="border p-2 w-80 ml-5"
        placeholder="Any Notes?"
      />

      <button className="bg-blue-600 text-white px-4 py-2 rounded ml-5">Submit</button>

      </div>

    </form>

     <h2 className="text-2xl font-bold mt-8 mb-4 ml-5">
      Check-In History {average !== null && <span className="text-sm text-gray-600 ml-2">(Last 10 Days Avg: {average}%)</span>}
      </h2>
      <table className="min-w-full border-collapse border border-gray-300 ml-5">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2">ID</th>
            <th className="border border-gray-300 px-4 py-2">Date</th>
            <th className="border border-gray-300 px-4 py-2">Mood</th>
            <th className="border border-gray-300 px-4 py-2">Percent</th>
            <th className="border border-gray-300 px-4 py-2">Notes</th>
          </tr>
        </thead>
        <tbody>
          {checkins.map(checkin => (
            <tr key={checkin.id}>
              <td className="border border-gray-300 px-4 py-2 text-center">{checkin.id}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">{checkin.date}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">{checkin.mood}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">{checkin.progress}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">{checkin.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    
  );
};

export default DailyCheckIn;