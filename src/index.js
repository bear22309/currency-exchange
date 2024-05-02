import React from 'react';
import { createRoot } from 'react-dom/client'; 
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns'; 
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


fetch('https://api.frankfurter.app/currencies')
  .then(response => response.json())
  .then(data => {
    console.log('API Response:', data);
    const currencies = data;

    const fromCurrencySelect = document.getElementById("fromCurrency");
    const toCurrencySelect = document.getElementById("toCurrency");
    const convertButton = document.getElementById("convertButton");

    
    fromCurrencySelect.innerHTML = '';
    toCurrencySelect.innerHTML = '';

    for (const currency in currencies) {
      const option = document.createElement('option');
      option.value = currency;
      option.textContent = `${currency} (${currencies[currency]})`;
      fromCurrencySelect.appendChild(option.cloneNode(true));
      toCurrencySelect.appendChild(option.cloneNode(true));
    }

    
    fromCurrencySelect.addEventListener('change', () => {
      const fromCurrency = fromCurrencySelect.value;
      const toCurrency = toCurrencySelect.value;
      fetchExchangeRates(fromCurrency, toCurrency);
    });

    toCurrencySelect.addEventListener('change', () => {
      const fromCurrency = fromCurrencySelect.value;
      const toCurrency = toCurrencySelect.value;
      fetchExchangeRates(fromCurrency, toCurrency);
    });

    convertButton.addEventListener('click', () => {
      const fromAmount = parseFloat(document.getElementById("fromAmount").value);
      if (isNaN(fromAmount)) {
        console.error('Invalid input for amount');
        return;
      }
      
      const fromCurrency = fromCurrencySelect.value;
      const toCurrency = toCurrencySelect.value;
    
      fetchExchangeRates(fromCurrency, toCurrency)
        .then(rate => {
          if (rate === undefined || isNaN(rate)) {
            console.error('Exchange rate not available for selected currencies');
            document.getElementById("toAmount").value = 'Exchange rate not available';
            return;
          }
          
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
  

reportWebVitals();