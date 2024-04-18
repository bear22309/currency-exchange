import React from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="container">
        <h2>Currency Exchange</h2>
        <nav>
          <ul>
            <li>
              <button onClick={() => alert('Button clicked!')}>Current currency</button>
            </li>
            <li>
              <button onClick={() => alert('Button clicked!')}>Current currency</button>
            </li>
          </ul>
        </nav>
      </div>
    </Router>
  );
}

export default App;
