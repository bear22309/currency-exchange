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

function fetchExchangeRates(fromCurrency, toCurrency) {
  const host = 'api.frankfurter.app';
  const exchangeRatesList = document.getElementById("exchangeRates");
  fetch('https://api.frankfurter.app/currencies')
  .then(response => response.json())
  .then(data => {
    console.log('API Response:', data);
    const currencies = data;

    // Update the first set of drop-down menus
    const fromCurrencySelect = document.getElementById("fromCurrency");
    const toCurrencySelect = document.getElementById("toCurrency");

    // Clear existing options
    fromCurrencySelect.innerHTML = '';
    toCurrencySelect.innerHTML = '';

    // Add options for each currency
    for (const currency in currencies) {
      const option = document.createElement('option');
      option.value = currency;
      option.textContent = `${currency} (${currencies[currency]})`;
      fromCurrencySelect.appendChild(option.cloneNode(true));
      toCurrencySelect.appendChild(option.cloneNode(true));
    }

    // Trigger event listeners if needed
    // ...
  })
  .catch(error => {
    console.error('Error fetching currencies:', error);
  });

  // Add null check
  if (!exchangeRatesList) {
    console.error('Exchange rates list element not found');
    return Promise.reject('Exchange rates list element not found');
  }

  return fetch(`https://${host}/latest?from=${fromCurrency}&to=${toCurrency}`)
    .then(response => response.json())
    .then(data => {
      exchangeRatesList.innerHTML = ''; 
      for (const currency in data.rates) {
        const listItem = document.createElement("li");
        listItem.textContent = `${currency}: ${data.rates[currency]}`;
        exchangeRatesList.appendChild(listItem);
      }
      return data.rates[toCurrency]; 
    })
    .catch(error => {
      console.error('Error fetching exchange rates:', error);
      exchangeRatesList.textContent = 'Error fetching exchange rates. Please try again later.';
    });
}

// Export the fetchExchangeRates function if needed in other modules
export { fetchExchangeRates };

reportWebVitals();