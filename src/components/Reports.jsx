import { Line } from 'react-chartjs-2';
import React, { useState, useEffect } from 'react';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement);

const Reports = () => {

  const [chartData, setChartData] = useState(null);

  useEffect(() => {

        const token = localStorage.getItem('token');

    fetch('http://localhost:8081/api/checkin/checkins/reports', {
    method: 'GET',
    headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
    }
  })
      .then(res => res.json())
      .then(data => {

        console.log(data);

        data.sort((a, b) => new Date(a.date) - new Date(b.date));

        // Extract X and Y values
        const labels = data.map(item => {
          const date = new Date(item.date);
          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); // e.g., Jun 01
        });

        const progressValues = data.map(item => item.progress);

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
      });
  }, []);

  return (
    <div className="p-4 bg-white shadow rounded-xl">
      {chartData ? (
        <Line data={chartData} />
      ) : (
        <p className="text-gray-500">Loading chart...</p>
      )}
    </div>
  );
};

export default Reports;