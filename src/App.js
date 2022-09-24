import React, { useState, useEffect } from 'react';
import './App.css';
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
  Typography,
  useMediaQuery,
} from '@material-ui/core';
import InfoBox from './InfoBox';
import LineGraph from './LineGraph';
import Table from './Table';
import { prettyPrintStat } from './helper';
import numeral from 'numeral';
import Map from './Map';
import 'leaflet/dist/leaflet.css';

const App = () => {
  const [country, setInputCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [countries, setCountries] = useState([]);
  const [mapCountries, setMapCountries] = useState([]);
  const [caseTableData, setCaseTableData] = useState([]);
  const [vaccineTableData, setVaccineTableData] = useState([]);
  const [casesType, setCasesType] = useState('cases');
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(2.5);
  let countryVaccinated = {};

  const isMobile = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch('https://disease.sh/v3/covid-19/countries')
        .then((response) => response.json())
        .then((data) => {
          fetch(
            'https://disease.sh/v3/covid-19/vaccine/coverage/countries?lastdays=1&fullData=false'
          )
            .then((response) => response.json())
            .then((vaccineData) => {
              // map of country: vaccinated
              vaccineData.forEach((country) => {
                countryVaccinated[country.country] = Object.values(
                  country.timeline
                )[0];
              });
              // add vaccinated number to each country
              data.forEach((country) => {
                const countryName = country.country;
                country['vaccinated'] = countryVaccinated[countryName];
              });
              setMapCountries(data);
              let countries = [];
              let caseData = [];
              let vaccinatedData = [];
              data.map((country) => {
                countries.push({
                  name: country.country,
                  value: country.countryInfo.iso2,
                });
                caseData.push({
                  country: country.country,
                  value: country.cases,
                });
                if (country.vaccinated) {
                  vaccinatedData.push({
                    country: country.country,
                    value: country.vaccinated,
                  });
                }
              });
              setCountries(countries);
              setCaseTableData(caseData);
              setVaccineTableData(vaccinatedData);
            });
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
    <>
      <div className='app'>
        <div className='app__left'>
          <Card>
            <div className='app__header'>
              <Typography variant='h1'>
                C<i className='fas fa-virus'></i>VID-19 Tracker
              </Typography>
              {!isMobile && (
                <FormControl
                  query='(min-device-width: 600px)'
                  className='app__dropdown'
                >
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
              )}
            </div>
          </Card>
          {isMobile && (
            <Card className='mobile__dropdown'>
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
            </Card>
          )}
          <div className='app__stats'>
            <InfoBox
              onClick={() => setCasesType('cases')}
              title='Cases'
              color={'red'}
              active={casesType === 'cases'}
              cases={prettyPrintStat(countryInfo.todayCases)}
              total={
                countryInfo.cases < 1000
                  ? setCountryInfo.cases
                  : numeral(countryInfo.cases).format('0.0a')
              }
            />
            <InfoBox
              onClick={() => setCasesType('recovered')}
              title='Recovered'
              color={'seagreen'}
              active={casesType === 'recovered'}
              cases={prettyPrintStat(countryInfo.todayRecovered)}
              total={
                countryInfo.cases < 1000
                  ? setCountryInfo.recovered
                  : numeral(countryInfo.recovered).format('0.0a')
              }
            />
            <InfoBox
              onClick={(e) => setCasesType('deaths')}
              title='Deaths'
              color={'dimgray'}
              active={casesType === 'deaths'}
              cases={prettyPrintStat(countryInfo.todayDeaths)}
              total={
                countryInfo.cases < 1000
                  ? setCountryInfo.deaths
                  : numeral(countryInfo.deaths).format('0.0a')
              }
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
              <Table data={caseTableData} />
              <LineGraph casesType={casesType} />
            </div>
          </CardContent>
        </Card>
        <Card className='app__right'>
          <CardContent>
            <div className='app__information'>
              <h3>Vaccination by Country</h3>
              <Table className='vaccineTable' data={vaccineTableData} />
              <LineGraph className='lineGraph' casesType={'vaccinated'} />
              <div className='source'>
                Data from:{' '}
                <a
                  href='https://disease.sh/docs/'
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
    </>
  );
};

export default App;
