import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';


ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);


fetch('https://api.frankfurter.app/latest?from=USD')
  .then(response => response.json())
  .then(data => {
    const exchangeRates = data.rates;
    const currencies = {
      AUD: "Australian Dollar",
      BGN: "Bulgarian Lev",
      BRL: "Brazilian Real",
      CAD: "Canadian Dollar",
      CHF: "Swiss Franc",
      CNY: "Chinese Renminbi Yuan",
      CZK: "Czech Koruna",
      DKK: "Danish Krone",
      EUR: "Euro",
      GBP: "British Pound",
      HKD: "Hong Kong Dollar",
      HUF: "Hungarian Forint",
      IDR: "Indonesian Rupiah",
      ILS: "Israeli New Sheqel",
      INR: "Indian Rupee",
      ISK: "Icelandic Króna",
      JPY: "Japanese Yen",
      KRW: "South Korean Won",
      MXN: "Mexican Peso",
      MYR: "Malaysian Ringgit",
      NOK: "Norwegian Krone",
      NZD: "New Zealand Dollar",
      PHP: "Philippine Peso",
      PLN: "Polish Złoty",
      RON: "Romanian Leu",
      SEK: "Swedish Krona",
      SGD: "Singapore Dollar",
      THB: "Thai Baht",
      TRY: "Turkish Lira",
      USD: "United States Dollar",
      ZAR: "South African Rand",
    };

   
    const exchangeRatesList = document.getElementById("exchangeRates");
    for (const currency in currencies) {
      const listItem = document.createElement("li");
      listItem.textContent = `${currencies[currency]} (${currency}): ${exchangeRates[currency]}`;
      exchangeRatesList.appendChild(listItem);
    }

    
    const baseCurrencySelect = document.getElementById("baseCurrency");
    for (const currency in currencies) {
      const option = document.createElement('option');
      option.value = currency;
      option.textContent = `${currency} (${currencies[currency]})`;
      baseCurrencySelect.appendChild(option);
    }    
  })
  .catch(error => {
    console.error('Error fetching exchange rates:', error);
    const exchangeRatesList = document.getElementById('exchangeRates');
    exchangeRatesList.textContent = 'Error fetching exchange rates. Please try again later.';
  });

reportWebVitals();