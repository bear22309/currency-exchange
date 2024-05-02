import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import axios from 'axios';

const API_URL = 'https://api.frankfurter.app';

const ChartComponent = ({ baseCurrency, comparedCurrency }) => {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/latest?from=${baseCurrency}&to=${comparedCurrency}`);
        if (!response.data || !response.data.rates) {
          throw new Error('No data available');
        }
        setChartData(response.data.rates);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchData();
  }, [baseCurrency, comparedCurrency]);

  useEffect(() => {
    if (chartData) {
      const labels = Object.keys(chartData);
      const data = Object.values(chartData);

      const config = {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Currency Data',
              data: data,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1,
            },
          ],
        },
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
            y: {
              title: {
                display: true,
                text: `1 ${baseCurrency} to ${comparedCurrency}`,
              },
            },
          },
        },
      };

      const chartInstance = new Chart(chartRef.current, config);

      return () => chartInstance.destroy();
    }
  }, [chartData, baseCurrency, comparedCurrency]);

  return <canvas ref={chartRef} />;
};

export default ChartComponent;