import React, { useState } from 'react';
import HealthTipList from './HealthTipList';
import HealthTipDetail from './HealthTipDetail';

const HealthTip = () => {

  const [selectedId, setSelectedId] = useState(null);

  return (
    <div style={{ display: 'flex', gap: '2rem' }}>
      <HealthTipList onSelect={setSelectedId} />
      <HealthTipDetail tipId={selectedId} />
    </div>
  );

}

export default HealthTip;