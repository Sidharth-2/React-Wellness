import { Line } from 'react-chartjs-2';
import React, { useState, useEffect, useCallback } from 'react';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../utils/apiClient';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement);

const Reports = () => {

  const [chartData, setChartData] = useState(null);
  const navigate = useNavigate();
  const baseUrl = process.env.REACT_APP_API_BASE_URL;

  const fetchReports = useCallback(() => {

     try {

    apiClient(`${baseUrl}api/checkin/checkins/reports`)
    .then(data => {

    if (data !== null && typeof data === 'object' && data.status === 200) {
        data.data.sort((a, b) => new Date(a.date) - new Date(b.date));
        // Extract X and Y values
        const labels = data.data.map(item => {
          const date = new Date(item.date);
          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); // e.g., Jun 01
        });

        const progressValues = data.data.map(item => item.progress);

        setChartData({
          labels: labels,
          datasets: [{
            label: 'Progress',
            data: progressValues,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.3,
          }]
        });
        }       
      });
            
      } catch (error) {
            console.error('❌ Error in Fetching Data:', error.message);           
      }

  }, []);

    useEffect(() => {
  fetchReports();
  }, [fetchReports]);


  return (
      <div className="p-4 bg-white shadow rounded-xl">
      <ToastContainer position="top-right" autoClose={3000} />
      {chartData ? (
        <Line data={chartData} />
      ) : (
        <p className="text-gray-500">Loading chart...</p>
      )}
    </div>
  );
};

export default Reports;