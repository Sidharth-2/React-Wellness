// HealthTipDetail.js
import React, { useEffect, useState } from 'react';
import { apiClient } from '../utils/apiClient';

function HealthTipDetail({ tipId }) {
  const [tip, setTip] = useState(null);
  const baseUrl = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {

    const token = localStorage.getItem('token');

    if (tipId) {
    apiClient(`${baseUrl}api/healthtips/${tipId}`)
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