import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

function MyHistogram({ data }) {
    // Ensure all numbers from 0 to 10 are in the data
    const completeData = [];
    for (let i = 0; i <= 10; i++) {
      const dataItem = data.find(item => item.name === String(i));
      if (dataItem) {
        completeData.push(dataItem);
      } else {
        completeData.push({ name: String(i), value: 0 });
      }
    }
  
    return (
      <BarChart width={600} height={300} data={completeData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#82ca9d" />
      </BarChart>
    );
  }
  

export default MyHistogram;
