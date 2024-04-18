import React from 'react';
import { createRoot } from 'react-dom/client'; 
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

fetch('https://api.frankfurter.app/currencies')
  .then(response => response.json())
  .then(data => {
    console.log('API Response:', data);
    const currencies = data;

    const fromCurrencySelect = document.getElementById("fromCurrency");
    const toCurrencySelect = document.getElementById("toCurrency");

    // Populate currency dropdowns
    for (const currency in currencies) {
      const option = document.createElement('option');
      option.value = currency;
      option.textContent = `${currency} (${currencies[currency]})`;
      fromCurrencySelect.appendChild(option.cloneNode(true));
      toCurrencySelect.appendChild(option);
    }

    fromCurrencySelect.addEventListener('change', () => {
      convertButton.disabled = false;
    });
    toCurrencySelect.addEventListener('change', () => {
      convertButton.disabled = false;
    });

    const convertButton = document.getElementById("convertButton");
    convertButton.addEventListener('click', () => {
      const fromCurrency = fromCurrencySelect.value;
      const toCurrency = toCurrencySelect.value;

      fetchExchangeRates(fromCurrency, toCurrency)
        .then(rate => {
          const fromAmount = document.getElementById("fromAmount").value;
          const toAmount = fromAmount * rate;
          document.getElementById("toAmount").value = toAmount.toFixed(2);
        })
        .catch(error => {
          console.error('Error fetching exchange rates:', error);
          const exchangeRatesList = document.getElementById('exchangeRates');
          exchangeRatesList.textContent = 'Error fetching exchange rates. Please try again later.';
        });
    });
  })
  .catch(error => {
    console.error('Error fetching currencies:', error);
  });

function fetchExchangeRates(fromCurrency, toCurrency) {
  const host = 'api.frankfurter.app';
  return fetch(`https://${host}/latest?from=${fromCurrency}&to=${toCurrency}`)
    .then(response => response.json())
    .then(data => {
      return data.rates[toCurrency];
    })
    .catch(error => {
      console.error('Error fetching exchange rates:', error);
      throw error; 
    });
}

reportWebVitals();

