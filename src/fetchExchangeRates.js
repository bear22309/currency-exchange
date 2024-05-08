function fetchExchangeRates(fromCurrency, toCurrency) {
  const host = 'api.frankfurter.app';
  const exchangeRatesList = document.getElementById("exchangeRates");

  // Add null check
  if (!exchangeRatesList) {
    console.error('Exchange rates list element not found');
    return Promise.reject('Exchange rates list element not found');
  }

  return fetch(`https://${host}/latest?from=${fromCurrency}&to=${toCurrency}`)
    .then(response => response.json())
    .then(data => {
      if (exchangeRatesList) { // Check again before updating
        exchangeRatesList.innerHTML = ''; 
        for (const currency in data.rates) {
          const listItem = document.createElement("li");
          listItem.textContent = `${currency}: ${data.rates[currency]}`;
          exchangeRatesList.appendChild(listItem);
        }
      }
      return data.rates[toCurrency]; 
    })
    .catch(error => {
      console.error('Error fetching exchange rates:', error);
      if (exchangeRatesList) { // Check again before updating
        exchangeRatesList.textContent = 'Error fetching exchange rates. Please try again later.';
      }
    });
}

// Export the fetchExchangeRates function
export { fetchExchangeRates };
