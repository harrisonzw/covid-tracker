import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import numeral from 'numeral';

const options = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: 'index',
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format('+0,0');
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: 'time',
        time: {
          displayFormats: {
            quarter: 'MM/DD/YY',
          },
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          // Include a dollar sign in the ticks
          callback: function (value, index, values) {
            return numeral(value).format('0a');
          },
        },
      },
    ],
  },
};

const buildChartData = (data, casesType) => {
  let chartData = [];
  let lastDataPoint;
  for (let date in data.cases) {
    if (lastDataPoint) {
      let newDataPoint = {
        x: date,
        y: data[casesType][date] - lastDataPoint,
      };
      chartData.push(newDataPoint);
    }
    lastDataPoint = data[casesType][date];
  }
  return chartData;
};

const buildChartVaccineData = (data, casesType) => {
  let chartData = [];
  let lastDataPoint;
  for (let date in data.vaccinated) {
    if (lastDataPoint) {
      let newDataPoint = {
        x: date,
        y: data[casesType][date] - lastDataPoint,
      };
      chartData.push(newDataPoint);
    }
    lastDataPoint = data[casesType][date];
  }
  return chartData;
};

export default function LineGraph({ casesType }) {
  const [data, setData] = useState({});
  const [vaccineData, setVaccineData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      await fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=365')
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          let chartData = buildChartData(data, casesType);
          setData(chartData);
        });
    };
    if (casesType !== 'vaccinated') fetchData();
  }, [casesType]);

  useEffect(() => {
    const fetchVaccineData = async () => {
      await fetch(
        'https://disease.sh/v3/covid-19/vaccine/coverage?lastdays=365&fullData=false'
      )
        .then((response) => {
          return response.json();
        })
        .then((vaccineData) => {
          let newData = { vaccinated: vaccineData };
          let chartData = buildChartVaccineData(newData, 'vaccinated');
          setVaccineData(chartData);
        });
    };

    fetchVaccineData();
  }, [casesType]);

  const getBackgroundColor = (casesType) => {
    if (casesType === 'cases') return 'rgba(204,16,52, 0.5)';
    else if (casesType === 'deaths') return 'rgba(125, 125, 125, 0.5)';
    else if (casesType === 'recovered') return 'rgba(125, 215, 29, 0.5)';
    else if (casesType === 'vaccinated') return 'rgba(125, 215, 29, 0.5)';
  };

  if (casesType === 'vaccinated') {
    return (
      <>
        <h3>Worldwide vaccinated by month</h3>
        <div>
          {vaccineData.length > 0 && (
            <Line
              data={{
                datasets: [
                  {
                    backgroundColor: getBackgroundColor('vaccinated'),
                    borderColor: getBackgroundColor('vaccinated'),
                    data: vaccineData,
                  },
                ],
              }}
              options={options}
            />
          )}
        </div>
      </>
    );
  } else
    return (
      <>
        <h3>Worldwide {casesType} by month</h3>
        <div>
          {casesType === 'recovered' && (
            <h5 style={{ textAlign: 'center' }}>Data not available</h5>
          )}
          {data?.length > 0 && casesType !== 'recovered' && (
            <Line
              data={{
                datasets: [
                  {
                    backgroundColor: getBackgroundColor(casesType),
                    borderColor: getBackgroundColor(casesType),
                    data: data,
                  },
                ],
              }}
              options={options}
            />
          )}
        </div>
      </>
    );
}
