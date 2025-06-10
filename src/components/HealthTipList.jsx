// HealthTipList.js
import React, { useState, useEffect } from 'react';

function HealthTipList({ onSelect }) {
  const [tips, setTips] = useState([]);

  useEffect(() => {

    const token = localStorage.getItem('token');

  fetch('http://localhost:8081/api/healthtips', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
})
      .then(res => res.json())
      .then(data => setTips(data));
  }, []);

  return (
   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
  {tips.map(tip => (
    <div
      key={tip.id}
      className="bg-white shadow-md rounded-xl p-4 hover:shadow-xl cursor-pointer"
      onClick={() => onSelect(tip.id)}
    >
      <h3 className="text-lg font-semibold text-gray-800">{tip.title}</h3>
      <p className="text-sm text-gray-600">{tip.shortDescription}</p>
    </div>
  ))}
</div>
  );
}

export default HealthTipList;