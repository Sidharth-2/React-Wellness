// HealthTipDetail.js
import React, { useEffect, useState } from 'react';
import { apiClient } from '../utils/apiClient';

function HealthTipDetail({ tipId }) {
  const [tip, setTip] = useState(null);

  useEffect(() => {

    const token = localStorage.getItem('token');

    if (tipId) {
    apiClient(`http://localhost:8081/api/healthtips/${tipId}`)
    .then(data => setTip(data.data));
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