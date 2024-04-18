import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
// Put our custom imports below

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

export default currencies;

fetch('https://api.frankfurter.app/latest?from=USD')
    .then(response => response.json())
    .then(data => {
        const exchangeRates = data.rates;
        console.log(exchangeRates);
        
        // Now you can use the exchange rates object to access individual rates
        // For example, to get the exchange rate for EUR:
        const eurRate = exchangeRates['EUR'];
        console.log('Exchange rate for EUR:', eurRate);
        
        // You can also loop through all currency codes and their corresponding rates
        for (const currencyCode in exchangeRates) {
            const rate = exchangeRates[currencyCode];
            console.log(`${currencyCode}: ${rate}`);
            
            // Here, you can display the exchange rates on the webpage or perform any other operations
        }
    })
    .catch(error => {
        console.error('Error fetching exchange rates:', error);
    });
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

    const selectElement = document.getElementById("toCurrency");

    
    for (const currencyCode in currencies) {
      const currencyName = currencies[currencyCode];
      const optionElement = document.createElement("option");
      optionElement.value = currencyCode;
      optionElement.textContent = `${currencyCode} - ${currencyName}`;
      selectElement.appendChild(optionElement);
    }

    document
      .getElementById("convertButton")
      .addEventListener("click", function () {
        const amount = parseFloat(document.getElementById("amount").value);
        const toCurrency = document.getElementById("toCurrency").value;

        fetch(
          `https://api.frankfurter.app/latest?amount=${amount}&from=USD&to=${toCurrency}`
        )
          .then((response) => response.json())
          .then((data) => {
            const convertedAmount = data.rates[toCurrency];
            document.getElementById(
              "result"
            ).innerHTML = `${amount} USD is approximately ${convertedAmount} ${toCurrency}`;
          })
          .catch((error) => {
            console.error("Error fetching exchange rate:", error);
            document.getElementById("result").innerHTML =
              "Error fetching exchange rate. Please try again later.";
          });
      });
    fetch("https://api.frankfurter.app/latest?from=USD")
      .then((response) => response.json())
      .then((data) => {
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
      })

      .catch((error) => {
        console.error("Error fetching exchange rates:", error);
        const exchangeRatesList = document.getElementById("exchangeRates");
        exchangeRatesList.textContent =
          "Error fetching exchange rates. Please try again later.";
      });
      for (const currency in currencies) {
          const option = document.createElement('option');
          option.value = currency;
          option.textContent = `${currency} (${currencies[currency]})`;
          baseCurrencySelect.appendChild(option);
      }