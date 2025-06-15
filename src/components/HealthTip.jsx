import React, { useState } from 'react';
import HealthTipList from './HealthTipList';
import HealthTipDetail from './HealthTipDetail';
import { ToastContainer, toast } from 'react-toastify';

const HealthTip = () => {

  const [selectedId, setSelectedId] = useState(null);

  return (
    <div style={{ display: 'flex', gap: '2rem' }}>
      <ToastContainer position="top-right" autoClose={3000} />
      <HealthTipList onSelect={setSelectedId} />
      <HealthTipDetail tipId={selectedId} />
    </div>
  );

}

export default HealthTip;