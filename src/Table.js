import React from 'react';
import './Table.css';
import numeral from 'numeral';

function Table({ data }) {
  // sort the data by descending order
  let sortedData = data.sort((a, b) => b.value - a.value);
  return (
    <div className='table'>
      {sortedData.map((country, index) => (
        <tr key={index}>
          <td>{country.country}</td>
          <td>
            <strong>
              {country.value < 1000
                ? country.value
                : numeral(country.value).format('0.0a')}
            </strong>
          </td>
        </tr>
      ))}
    </div>
  );
}

export default Table;
