import React from 'react';
import { createRoot } from 'react-dom/client'; 
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns'; 
import { fetchExchangeRates } from './fetchExchangeRates';
Chart.register(...registerables);

const rootElement = document.getElementById('root');

createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


fetchExchangeRates('USD', 'JPY')
  .then(rate => {
    console.log('Exchange rate:', rate);
  })
  .catch(error => {
    console.error('Error fetching exchange rates:', error);
  });

reportWebVitals();