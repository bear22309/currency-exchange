import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';


const ChartComponent = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const generateDateLabels = () => {
      const labels = [];
      for (let i = 30; i > 0; i--) {
        const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
        labels.push(date.toISOString().split('T')[0]);
      }
      return labels;
    };

    const labels = generateDateLabels();

    const data = {
      labels: labels,
      datasets: [
        {
          label: 'Dataset 1',
          data: [65, 59, 80, 81, 56, 55, 40],
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
          label: 'Dataset 2',
          data: [28, 48, 40, 19, 86, 27, 90],
          borderColor: 'rgb(54, 162, 235)',
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
        },
      ],
    };

    const config = {
      type: 'line',
      data: data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Chart.js Line Chart',
          },
        },
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day',
            },
          },
        },
      },
    };

    const chartInstance = new Chart(chartRef.current, config);

    return () => chartInstance.destroy();
  }, []);

  return <canvas ref={chartRef} />;
};

export default ChartComponent;
