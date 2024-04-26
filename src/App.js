import React from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import './App.css';

const App = () => {
  return (
    <Router>
      <div>
        <nav>
          <a>Tony's Currency Exchange</a>
        </nav>
        <div className="container">
          <h1>Currency Converter</h1>
          <label htmlFor="fromCurrency">Current Currency:</label>
          <select id="fromCurrency"></select>
          <input type="number" id="fromAmount" placeholder="Amount" />
          <br />
          <label htmlFor="toCurrency">Compared Currency:</label>
          <select id="toCurrency"></select>
          <input type="number" id="toAmount" placeholder="Amount" disabled />
          <br />
          <button id="convertButton">Convert</button>
        </div>
        <div className="container">
          <h1>Exchange Rates</h1>
          <ul id="exchangeRates"></ul>
        </div>
        <footer>
          <p>&copy; 2024 Tony's Currency Exchange</p>
          <a href="https://www.linkedin.com/feed/">LinkedIn</a>
        </footer>
      </div>
    </Router>
  );
}

export default App;
