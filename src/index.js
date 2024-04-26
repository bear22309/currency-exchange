import React from 'react';
import { createRoot } from 'react-dom/client'; 
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

let convertButton;

// Define fetchExchangeRates function here
function fetchExchangeRates(fromCurrency, toCurrency) {
  const host = 'api.frankfurter.app';
  const exchangeRatesList = document.getElementById("exchangeRates"); // Move inside the function
  return fetch(`https://${host}/latest?from=${fromCurrency}&to=${toCurrency}`)
    .then(response => response.json())
    .then(data => {
      exchangeRatesList.innerHTML = ''; // Clear existing content
      for (const currency in data.rates) {
        const listItem = document.createElement("li");
        listItem.textContent = `${currency}: ${data.rates[currency]}`;
        exchangeRatesList.appendChild(listItem);
      }
    })
    .catch(error => {
      console.error('Error fetching exchange rates:', error);
      exchangeRatesList.textContent = 'Error fetching exchange rates. Please try again later.';
    });
}

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

    convertButton = document.getElementById("convertButton");

    convertButton.addEventListener('click', () => {
      const fromAmount = parseFloat(document.getElementById("fromAmount").value);
      if (isNaN(fromAmount)) {
        // Handle invalid input
        console.error('Invalid input for amount');
        return;
      }
      
      const fromCurrency = fromCurrencySelect.value;
      const toCurrency = toCurrencySelect.value;
    
      fetchExchangeRates(fromCurrency, toCurrency)
        .then(rate => {
          if (rate === undefined || isNaN(rate)) {
            // Handle invalid exchange rate
            console.error('Invalid exchange rate:', rate);
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

const fromCurrencySelect = document.getElementById("fromCurrency");
const toCurrencySelect = document.getElementById("toCurrency");

// Call the fetchExchangeRates function when the base currency changes
fromCurrencySelect.addEventListener('change', () => {
  convertButton.disabled = false;
  const fromCurrency = fromCurrencySelect.value;
  const toCurrency = toCurrencySelect.value;
  fetchExchangeRates(fromCurrency, toCurrency);
});

reportWebVitals();