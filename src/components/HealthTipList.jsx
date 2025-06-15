// HealthTipList.js
import React, { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../utils/apiClient';

function HealthTipList({ onSelect }) {
  const [tips, setTips] = useState([]);


  const fetchHealthTips = useCallback ( () => {
  
   const token = localStorage.getItem('token');

    apiClient('http://localhost:8081/api/healthtips')
      .then(data => {
        
        if (data !== null && typeof data === 'object' && data.status === 200) {
        setTips(data.data);
        }
      }
      )
  }, []);

  useEffect(() => {
    fetchHealthTips();
  }, [fetchHealthTips]);

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