import React from 'react';


const tips = [
  "Drink 8 glasses of water",
  "Stretch for 5 minutes every hour",
  "Avoid screens 30 mins before bed",
];

const WellnessTips = () => (
  <ul className="list-disc ml-10 mt-6 space-y-2">
    {tips.map((tip, idx) => <li key={idx}>{tip}</li>)}
  </ul>
);

export default WellnessTips;