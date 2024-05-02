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

  useEffect(() => {
    const getRate = (base, quote) => {
      setLoading(true);
      fetch(`https://api.frankfurter.app/latest?from=${base}&to=${quote}`)
        .then(checkStatus)
        .then(json)
        .then(data => {
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

    const getHistoricalRates = (base, quote) => {
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(new Date().getTime() - (30 * 24 * 60 * 60 * 1000));

      const labels = [];
      for (let date = startDate; date <= new Date(); date.setDate(date.getDate() + 1)) {
        labels.push(date.toISOString().split('T')[0]);
      }

      fetch(`https://api.frankfurter.app/${startDate.toISOString().split('T')[0]}..${endDate}?from=${base}&to=${quote}`)
        .then(checkStatus)
        .then(json)
        .then(data => {
          if (data.error) {
            throw new Error(data.error);
          }

          const chartData = labels.map(label => data.rates[label]?.[quote] || null);
          const chartLabel = `${base}/${quote}`;
          buildChart(labels, chartData, chartLabel);
        })
        .catch(error => console.error(error.message));
    };

    getRate(baseAcronym, quoteAcronym);
    getHistoricalRates(baseAcronym, quoteAcronym);
  }, [baseAcronym, quoteAcronym]);

  const buildChart = (labels, data, label) => {
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

  const toBase = (amount, rate) => amount * (1 / rate);

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
  };

  const changeBaseValue = event => {
    const quoteValue = convert(event.target.value, rate, toQuote);
    setBaseValue(event.target.value);
    setQuoteValue(quoteValue);
  };

  const changeQuoteAcronym = event => {
    const quoteAcronym = event.target.value;
    setQuoteAcronym(quoteAcronym);
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
              id="base"
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