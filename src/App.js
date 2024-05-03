import React, { useState } from 'react';
import './App.css';
import CurrencyConverter from './CurrencyConverter'; // Import CurrencyConverter component

const App = () => {
  // State variables to hold base and compared currencies
  const [baseCurrency] = useState('USD');
  const [comparedCurrency] = useState('EUR');

  return (
    <div>
      {/* Your existing JSX */}
      <CurrencyConverter baseCurrency={baseCurrency} comparedCurrency={comparedCurrency} /> {/* Pass state variables as props */}
      {/* Your existing JSX */}
    </div>
  );
}

export default App;
