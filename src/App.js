import React, { useState, useEffect } from 'react';
import './App.css';
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
} from '@material-ui/core';
import InfoBox from './InfoBox';
import LineGraph from './LineGraph';
import Table from './Table';
import { prettyPrintStat } from './helper';
import Map from './Map';
import 'leaflet/dist/leaflet.css';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [countryInfo, setCountryInfo] = useState({});
  const [mapCountries, setMapCountries] = useState([]);
  const [caseTableData, setCaseTableData] = useState([]);
  const [vaccineTableData, setVaccineTableData] = useState([]);
  const [casesType, setCasesType] = useState('cases');
  let countryVaccinated = {};

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
              data.forEach((countryData) => {
                countries.push({
                  name: countryData.country,
                  value: countryData.countryInfo.iso2,
                });
                caseData.push({
                  country: countryData.country,
                  value: countryData.cases,
                });
                if (countryData.vaccinated) {
                  vaccinatedData.push({
                    country: countryData.country,
                    value: countryData.vaccinated,
                  });
                }
              });

              setCaseTableData(caseData);
              setVaccineTableData(vaccinatedData);
              setTimeout(() => {
                setIsLoading(false);
              }, 1000);
            });
        });
    };
    getCountriesData();
  }, []);

  return (
    <>
      {isLoading ? (
        <CircularProgress className='loading' color='secondary' />
      ) : (
        <div className='app'>
          <div className='app__left'>
            <Card className='app__header'>
              <Typography variant='h1'>
                Worldwide C<i className='fas fa-virus'></i>VID-19 Tracker
              </Typography>
            </Card>

            <div className='app__stats'>
              <InfoBox
                onClick={() => setCasesType('cases')}
                title='Cases'
                color={'red'}
                active={casesType === 'cases'}
                cases={prettyPrintStat(countryInfo.todayCases)}
                total={prettyPrintStat(countryInfo.cases)}
              />
              <InfoBox
                onClick={() => setCasesType('recovered')}
                title='Recovered'
                color={'seagreen'}
                active={casesType === 'recovered'}
                cases={prettyPrintStat(countryInfo.todayRecovered)}
                total={prettyPrintStat(countryInfo.recovered)}
              />
              <InfoBox
                onClick={() => setCasesType('deaths')}
                title='Deaths'
                color={'dimgray'}
                active={casesType === 'deaths'}
                cases={prettyPrintStat(countryInfo.todayDeaths)}
                total={prettyPrintStat(countryInfo.deaths)}
              />
            </div>
            <Map countries={mapCountries} casesType={casesType} />
          </div>
          <div className='app__right'>
            <Card className='lineGraphContainer'>
              <CardContent>
                <div className='app__information'>
                  <h3>Total {casesType} by month</h3>
                  <div className='lineGraph'>
                    <LineGraph casesType={casesType} />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <div className='app__information'>
                  <h3>Total Cases by Country</h3>
                  <Table data={caseTableData} />
                </div>
              </CardContent>
            </Card>
          </div>
          <div className='app__right'>
            <Card className='lineGraphContainer'>
              <CardContent>
                <div className='app__information'>
                  <h3>Total vaccinated by month</h3>
                  <div className='lineGraph'>
                    <LineGraph casesType={'vaccinated'} />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <div className='app__information'>
                  <h3>Vaccination by Country</h3>
                  <Table data={vaccineTableData} />
                </div>
              </CardContent>
            </Card>
            <h5 className='source'>
              Data from:{' '}
              <a
                href='https://disease.sh/docs/'
                target='_blank'
                rel='noopener noreferrer'
              >
                Open Disease Data API
              </a>
            </h5>
          </div>
        </div>
      )}
    </>
  );
};

export default App;
