import React, { useState } from 'react';
import './App.css';
import CurrencyConverter from './CurrencyConverter'; 

const App = () => {
  
  const [baseCurrency] = useState('USD');
  const [comparedCurrency] = useState('EUR');

  return (
    <div>
      
      <CurrencyConverter baseCurrency={baseCurrency} comparedCurrency={comparedCurrency} /> 
      
    </div>
  );
}

export default App;
