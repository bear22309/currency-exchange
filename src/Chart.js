import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import axios from 'axios';

const API_URL = 'https://api.frankfurter.app';

const fetchExchangeRates = async (baseCurrency, comparedCurrency) => {
  try {
    const response = await axios.get(`${API_URL}/latest?from=${baseCurrency}&to=${comparedCurrency}`);
    return response.data.rates;
  } catch (error) {
    console.error('Error fetching exchange rates:', error.message);
    throw error;
  }
};

const ExchangeRateComponent = () => {
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [comparedCurrency, setComparedCurrency] = useState('EUR');
  const [exchangeRate, setExchangeRate] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        setLoading(true);
        const rates = await fetchExchangeRates(baseCurrency, comparedCurrency);
        setExchangeRate(rates[comparedCurrency]);
        setLoading(false);
      } catch (error) {
        // Handle error
        setLoading(false);
      }
    };

    fetchRates();
  }, [baseCurrency, comparedCurrency]);

  const handleBaseCurrencyChange = (event) => {
    setBaseCurrency(event.target.value);
  };

  const handleComparedCurrencyChange = (event) => {
    setComparedCurrency(event.target.value);
  };

  return (
    <div>
      <label htmlFor="baseCurrency">Base Currency:</label>
      <select id="baseCurrency" value={baseCurrency} onChange={handleBaseCurrencyChange}>
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        {/* Add more currency options as needed */}
      </select>

      <label htmlFor="comparedCurrency">Compared Currency:</label>
      <select id="comparedCurrency" value={comparedCurrency} onChange={handleComparedCurrencyChange}>
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        {/* Add more currency options as needed */}
      </select>

      {/* Display exchange rate or loading indicator */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <p>Exchange Rate: {exchangeRate}</p>
      )}
    </div>
  );
};

const ChartComponent = ({ baseCurrency, comparedCurrency }) => {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/latest?from=${baseCurrency}&to=${comparedCurrency}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        const data = await response.json();
        setChartData(data.rates);
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

export { ExchangeRateComponent, ChartComponent };