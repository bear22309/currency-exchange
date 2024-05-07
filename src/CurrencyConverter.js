import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { checkStatus, json } from './utils/fetchUtils';
import currencies from './utils/currencies';

const CurrencyConverter = () => {
  const [rate, setRate] = useState(0);
  const [baseAcronym, setBaseAcronym] = useState('USD');
  const [baseValue, setBaseValue] = useState(0);
  const [quoteAcronym, setQuoteAcronym] = useState('JPY');
  const [quoteValue, setQuoteValue] = useState(0);
  const [loading, setLoading] = useState(false);

  const chartRef = useRef();

  const getHistoricalRates = (base, quote) => {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = '2024-04-02';

    fetch(`https://api.frankfurter.app/${startDate}..${endDate}?from=${base}&to=${quote}`)
      .then(checkStatus)
      .then(json)
      .then(data => {
        if (data.error) {
          throw new Error(data.error);
        }

        const chartData = [];
        const chartLabels = [];
        for (const date in data.rates) {
          if (data.rates.hasOwnProperty(date)) {
            chartLabels.push(date);
            chartData.push(data.rates[date][quote]);
          }
        }
        const chartLabel = `${base}/${quote}`;
        buildChart(chartLabels, chartData, chartLabel);
      })
      .catch(error => console.error(error.message));
  };

  const buildChart = (labels, data, label) => {
    const existingChart = Chart.getChart(chartRef.current);
    if (existingChart) {
      existingChart.destroy();
    }
    // @ts-ignore
    const chart = new Chart(chartRef.current.getContext("2d"), {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: label,
            data,
            fill: false,
            tension: 0,
          }
        ]
      },
      options: {
        responsive: true,
      }
    });
  };

  useEffect(() => {
    const getRate = (base, quote) => {
      setLoading(true);
      fetch(`https://api.frankfurter.app/currencies`)
        .then(checkStatus)
        .then(json)
        .then(data => {
          console.log('API Response:', data); 
          console.log('Rates data:', data.rates); 
          if (data.error) {
            throw new Error(data.error);
          }
  
          const rate = data.rates[quote];
          setRate(rate);
          setBaseValue(1);
          setQuoteValue(Number((1 * rate).toFixed(3)));
          setLoading(false);
        })
        .catch(error => console.error(error.message));
    };
  
    getRate(baseAcronym, quoteAcronym);
    getHistoricalRates(baseAcronym, quoteAcronym);
  }, [baseAcronym, quoteAcronym]); 
  

  const toBase = (amount, rate) => amount * (1 / rate);
  // @ts-ignore
  const toQuote = (amount, rate) => amount * rate;

  const convert = (amount, rate, equation) => {
    const input = parseFloat(amount);
    if (Number.isNaN(input)) {
      return '';
    }
    return equation(input, rate).toFixed(3);
  };

  const changeBaseAcronym = event => {
    const baseAcronym = event.target.value;
    setBaseAcronym(baseAcronym);
    getHistoricalRates(baseAcronym, quoteAcronym); 
  };
  
  const changeQuoteAcronym = event => {
    const newQuoteAcronym = event.target.value;
    setQuoteAcronym(newQuoteAcronym);
    getHistoricalRates(baseAcronym, newQuoteAcronym);
  };
  
  const changeBaseValue = event => {
    const newValue = event.target.value; 
    setBaseValue(newValue); 
  };
  

  const changeQuoteValue = event => {
    const baseValue = convert(event.target.value, rate, toBase);
    setQuoteValue(event.target.value);
    setBaseValue(baseValue);
  };

  const currencyOptions = Object.keys(currencies).map(currencyAcronym => (
    <option key={currencyAcronym} value={currencyAcronym}>
      {currencyAcronym} ({currencies[currencyAcronym].name})
    </option>
  ));

  return (
    <React.Fragment>
      <div className="text-center p-3">
        <h2 className="mb-2">Currency Converter</h2>
        <h4>
          1 {baseAcronym} to 1 {quoteAcronym} = {rate.toFixed(4)}{' '}
          {currencies[quoteAcronym].name}
        </h4>
      </div>
      <form className="form-row p-3 mb-4 bg-light justify-content-center">
        <div className="form-group col-md-5 mb-0">
          <select
            value={baseAcronym}
            onChange={changeBaseAcronym}
            className="form-control form-control-lg mb-2"
            disabled={loading}
          >
            {currencyOptions}
          </select>
          <div className="input-group">
            <div className="input-group-prepend">
              <div className="input-group-text">
                {currencies[baseAcronym].symbol}
              </div>
            </div>
            <input
              id="baseInput"
              className="form-control form-control-lg"
              value={baseValue}
              onChange={changeBaseValue}
              type="number"
              />
          </div>
          <small className="text-secondary">
            {currencies[baseAcronym].name}
          </small>
        </div>
        <div className="col-md-2 py-3 d-flex justify-content-center align-items-center">
          <h3>=</h3>
        </div>
        <div className="form-group col-md-5 mb-0">
          <select
            value={quoteAcronym}
            onChange={changeQuoteAcronym}
            className="form-control form-control-lg mb-2"
            disabled={loading}
          >
            {currencyOptions}
          </select>
          <div className="input-group">
            <div className="input-group-prepend">
              <div className="input-group-text">
                {currencies[quoteAcronym].symbol}
              </div>
            </div>
            <input
              id="quote"
              className="form-control form-control-lg"
              value={quoteValue}
              onChange={changeQuoteValue}
              type="number"
            />
          </div>
          <small className="text-secondary">
            {currencies[quoteAcronym].name}
          </small>
        </div>
      </form>
      <canvas ref={chartRef} />
    </React.Fragment>
  );
};

export default CurrencyConverter;