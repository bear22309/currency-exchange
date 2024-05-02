import React, { useState } from 'react';
import './App.css';
import CurrencyConverter from './CurrencyConverter'; // Import CurrencyConverter component

const App = () => {
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [comparedCurrency, setComparedCurrency] = useState('EUR');

  const handleBaseCurrencyChange = (event) => {
    setBaseCurrency(event.target.value);
  };

  const handleComparedCurrencyChange = (event) => {
    setComparedCurrency(event.target.value);
  };

  return (
    <div>
      {/* Your existing JSX */}
      <CurrencyConverter /> {/* Use CurrencyConverter component here */}
      {/* Your existing JSX */}
    </div>
  );
}

export default App;

