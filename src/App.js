import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import './App.css';

const Home = () => {
  return <h2>Currency</h2>;
}

const About = () => {
  return <h2>Currency</h2>;
}

const Contact = () => {
  return <h2>Currency</h2>;
}

const App = () => {
  return (
    <Router>
      <div className="container">
        <h2>Currency Exchange</h2>
        <nav>
          <ul>
            <li>
              <Link to="/">Currency</Link>
            </li>
            <li>
              <Link to="/about/">Currency</Link>
            </li>
            <li>
              <Link to="/contact/">Currency</Link>
            </li>
          </ul>
        </nav>
        <Route path="/" exact component={Home} />
        <Route path="/about/" component={About} />
        <Route path="/contact/" component={Contact} />
      </div>
    </Router>
  );
}

export default App;
