import React from 'react';
import numeral from 'numeral';
import { Circle, Popup } from 'react-leaflet';

const casesTypeColors = {
  cases: {
    hex: '#CC1034',
    rgb: 'rgb(204, 16, 52)',
    half_op: 'rgba(204, 16, 52, 0.5)',
    multiplier: 50,
  },
  recovered: {
    hex: '#2E8B57',
    rgb: 'rgb( 46, 139, 87)',
    half_op: 'rgba( 46, 139, 87, 0.5)',
    multiplier: 50,
  },
  deaths: {
    hex: 'dimgray',
    rgb: 'rgb(251, 68, 67)',
    half_op: 'rgba(251, 68, 67, 0.5)',
    multiplier: 200,
  },
};

export const sortData = (data) => {
  let sortedData = [...data];
  sortedData.sort((a, b) => {
    if (a.cases > b.cases) {
      return -1;
    } else {
      return 1;
    }
  });
  return sortedData;
};

export const sortVaccineData = (data) => {
  let sortedData = [...data];
  sortedData.sort((a, b) => {
    if (a.vaccinated > b.vaccinated) {
      return -1;
    } else {
      return 1;
    }
  });
  return sortedData;
};

export const prettyPrintStat = (stat) => {
  if (!stat) return '0';
  else if (stat < 10000) return stat;
  else return `${numeral(stat).format('0.0a')}`;
};

export const showDataOnMap = (data, casesType = 'cases') =>
  data.map((country, index) => (
    <Circle
      key={index}
      center={[country.countryInfo.lat, country.countryInfo.long]}
      color={casesTypeColors[casesType].hex}
      fillColor={casesTypeColors[casesType].hex}
      fillOpacity={0.4}
      radius={
        Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
      }
    >
      <Popup>
        <div className='info-container'>
          <div
            className='info-flag'
            style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
          ></div>
          <div className='info-name'>{country.country}</div>
          <div className='info-confirmed'>
            Cases: {numeral(country.cases).format('0,0')}
          </div>
          <div className='info-recovered'>
            Recovered: {numeral(country.recovered).format('0,0')}
          </div>
          <div className='info-deaths'>
            Deaths: {numeral(country.deaths).format('0,0')}
          </div>
          <div className='info-vaccinated'>
            Vaccinated: {numeral(country.vaccinated).format('0,0')}
          </div>
        </div>
      </Popup>
    </Circle>
  ));
