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
  const [chartReady, setChartReady] = useState(false);
  const chartRef = useRef();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const currentDate = new Date();
    const previousDate = new Date();
    previousDate.setDate(currentDate.getDate() - 30); 
    setStartDate(previousDate.toISOString().split("T")[0]);
    setEndDate(currentDate.toISOString().split("T")[0]); 
  }, []);

  const getHistoricalRates = (base, quote) => {
    const apiUrl = `https://api.frankfurter.app/${startDate}..${endDate}?from=${base}&to=${quote}`;

    fetch(apiUrl)
      .then(checkStatus)
      .then(json)
      .then(data => {
        console.log(data);
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
        setChartReady(true);
      })
      .catch(error => console.error(error.message));
  };

  const buildChart = (labels, data, label) => {
    if (!chartRef.current) return;
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
      fetch(`https://api.frankfurter.app/${startDate}..${endDate}?from=${base}&to=${quote}`)
        .then(checkStatus)
        .then(json)
        .then(data => {
          console.log("API Response:", data);
          if (data.error) {
            throw new Error(data.error);
          }

          let closestDate = null;
          let closestRate = null;

          for (const date in data.rates) {
            const rateDate = new Date(date);
            if (!closestDate || rateDate > closestDate) {
              closestDate = rateDate;
              closestRate = data.rates[date][quote];
            }
          }

          if (closestRate === null) {
            throw new Error(`Rate for ${base}/${quote} not found.`);
          }

          setRate(closestRate);
          setBaseValue(1);
          setQuoteValue(Number((1 * closestRate).toFixed(3)));
          setLoading(false);
        })
        .catch(error => console.error(error.message));
    };

    getRate(baseAcronym, quoteAcronym);
    getHistoricalRates(baseAcronym, quoteAcronym);

  }, [baseAcronym, quoteAcronym, startDate, endDate]);

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
    const newValue = parseFloat(event.target.value);
    setBaseValue(newValue);
    const newQuoteValue = newValue * rate;
    setQuoteValue(newQuoteValue);
  };

  const changeQuoteValue = event => {
    const newQuoteValue = parseFloat(event.target.value);
    setQuoteValue(newQuoteValue);
    const newBaseValue = newQuoteValue / rate;
    setBaseValue(newBaseValue);
  };

  const currencyOptions = Object.keys(currencies).map(currencyAcronym => {
    let id = '';
    if (currencyAcronym === ' ') {
      id = 'fromCurrency';
    } else if (currencyAcronym === ' ') {
      id = 'toCurrency';
    }
    return (
      <option key={currencyAcronym} value={currencyAcronym} id={id}>
        {currencyAcronym} ({currencies[currencyAcronym].name})
      </option>
    );
  });

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
