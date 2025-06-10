// HealthTipDetail.js
import React, { useEffect, useState } from 'react';

function HealthTipDetail({ tipId }) {
  const [tip, setTip] = useState(null);

  useEffect(() => {

    const token = localStorage.getItem('token');

    if (tipId) {
    fetch(`http://localhost:8081/api/healthtips/${tipId}`, {
    method: 'GET',
    headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
}).then(res => res.json())
        .then(data => setTip(data));
    }
  }, [tipId]);

  if (!tip) return <p>Select a tip to view details</p>;

  return (
    <div>
      <h2>{tip.title}</h2>
      <p>{tip.detailedDescription}</p>
    </div>
  );
}


export default HealthTipDetail;