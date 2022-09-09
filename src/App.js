import React, { useState, useEffect } from 'react';
import './App.css';
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
  Typography,
} from '@material-ui/core';
import InfoBox from './InfoBox';
import LineGraph from './LineGraph';
import Table from './Table';
import { sortData, prettyPrintStat } from './helper';
import numeral from 'numeral';
import Map from './Map';
import 'leaflet/dist/leaflet.css';

const App = () => {
  const [country, setInputCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [countries, setCountries] = useState([]);
  const [mapCountries, setMapCountries] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState('cases');
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);

  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      fetch('https://disease.sh/v3/covid-19/countries')
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          let sortedData = sortData(data);
          setCountries(countries);
          setMapCountries(data);
          setTableData(sortedData);
        });
    };

    getCountriesData();
  }, []);

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;

    const url =
      countryCode === 'worldwide'
        ? 'https://disease.sh/v3/covid-19/all'
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setInputCountry(countryCode);
        setCountryInfo(data);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });
  };

  return (
    <div className='app'>
      <div className='app__left'>
        {' '}
        <Card>
          <div className='app__header'>
            <Typography variant='h1'>
              <i className='fas fa-virus'></i> {'  '}
              Worldwide COVID-19 Tracker
            </Typography>
            <FormControl className='app__dropdown'>
              <Select
                variant='outlined'
                value={country}
                onChange={onCountryChange}
              >
                <MenuItem value='worldwide'>Worldwide</MenuItem>
                {countries.map((country, index) => (
                  <MenuItem key={index} value={country.value}>
                    {country.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>{' '}
        </Card>
        <div className='app__stats'>
          <InfoBox
            onClick={() => setCasesType('cases')}
            title='Cases'
            color={'red'}
            active={casesType === 'cases'}
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={numeral(countryInfo.cases).format('0.0a')}
          />
          <InfoBox
            onClick={() => setCasesType('recovered')}
            title='Recovered'
            color={'yellowgreen'}
            active={casesType === 'recovered'}
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={numeral(countryInfo.recovered).format('0.0a')}
          />
          <InfoBox
            onClick={(e) => setCasesType('deaths')}
            title='Deaths'
            color={'dimgray'}
            active={casesType === 'deaths'}
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={numeral(countryInfo.deaths).format('0.0a')}
          />
        </div>
        <Map
          countries={mapCountries}
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>
      <Card className='app__right'>
        <CardContent>
          <div className='app__information'>
            <h3>Total Cases by Country</h3>
            <Table countries={tableData} />

            <h3>Worldwide recent {casesType} by month</h3>
            {casesType === 'recovered' ? (
              <h4>data not available</h4>
            ) : (
              <LineGraph casesType={casesType} />
            )}

            <div className='source'>
              Data from:{' '}
              <a
                href='https://disease.sh/'
                target='_blank'
                rel='noopener noreferrer'
              >
                Open Disease Data API
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default App;
