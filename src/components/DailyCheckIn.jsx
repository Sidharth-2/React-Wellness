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
  const [progress, setProgress] = useState(65);
  const [status, setStatus] = useState(null);
  const [jobId, setJobId] = useState(null);
  const [downloading, setDownloading] = useState(false);

  const baseUrl = process.env.REACT_APP_API_BASE_URL;

const fetchCheckins = useCallback(() => {

    apiClient(`${baseUrl}api/checkin/checkins`)
      .then(data =>  {

        if (data !== null && typeof data === 'object' && data.status === 200)
        if (data.success===true){

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

  const hideStatus = async () => {

    if (status === 'Download complete') {
      const timer = setTimeout(() => {
        setStatus('')
      }, 3000)

      return () => clearTimeout(timer) 
    }

  }

   useEffect(() => {          
      fetchCheckins();      
  },  [fetchCheckins]);


     useEffect(() => {          
       hideStatus();
  },  [hideStatus]);


  const generateReport = async () => {
    setStatus('Starting...');
    setDownloading(true);

    const token = localStorage.getItem('token'); 
    const userId = localStorage.getItem('userId'); 

    console.log(token);
    console.log(userId);

    try {
      // Step 1: Start the report generation
      const res = await fetch(`${baseUrl}api/reports/checkins/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId })
      });

      const data = await res.json();
      console.log(data);
      setJobId(data.jobId);
      setStatus('Report generation started. Waiting...');

      console.log(token);

      // Step 2: Poll for status every 3 seconds
      const interval = setInterval(async () => {
        const statusRes = await fetch(`${baseUrl}api/reports/checkins/status?jobId=${data.jobId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        });

        const statusData = await statusRes.json();
        setStatus(`Status: ${statusData.status}`);

        if (statusData.status === 'COMPLETED') {
          downloadReport(data.jobId);
          clearInterval(interval);
        } else if (statusData.status === 'FAILED') {
          clearInterval(interval);
          setStatus('Report generation failed.');
          setDownloading(false);
        }
      }, 3000);

    } catch (err) {
      console.error(err);
      //clearInterval(interval);
      setStatus('Error starting report');
      setDownloading(false);
    }
  };

  const downloadReport = async (jobId) => {

    const token = localStorage.getItem('token'); 

    setStatus('Downloading...');
    try {
      const res = await fetch(`${baseUrl}api/reports/checkins/download/${jobId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error("Download failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${jobId}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      setStatus('Download complete');
    } catch (err) {
      console.error(err);
      setStatus('Failed to download');
    } finally {
      setDownloading(false);
    }
  };

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
        `${baseUrl}api/checkin`,
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

<div className="flex items-center justify-between mt-8 mb-4 ml-5">
     <h2 className="text-2xl font-bold mt-8 mb-4 ml-5">
      Check-In History {average !== null && <span className="text-sm text-gray-600 ml-2">(Last 10 Days Avg: {average}%)</span>}
      </h2>

      <div style={{ padding: '20px' }}>
      <button onClick={generateReport} disabled={downloading}>
        {downloading ? 'Please wait...' : 'Download Report'} 
      </button>
      {status && <p className="text-blue-400 text-base">{status}</p>}
    </div>
</div>
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