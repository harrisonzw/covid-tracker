import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  CardActionArea,
} from '@material-ui/core';

import './InfoBox.css';

function InfoBox({ title, color, cases, total, active, ...props }) {
  const getColor = () => {
    if (title === 'Cases') return { borderColor: 'rgba(204,16,52, 0.5)' };
    else if (title === 'Recovered')
      return { borderColor: 'rgba(125, 215, 29, 0.5)' };
    else return { borderColor: 'rgb(105,105,105)' };
  };

  return (
    <Card
      waves='light'
      onClick={props.onClick}
      className={`infoBox ${active && 'infoBox--selected'} 
      }`}
      style={getColor()}
    >
      <CardActionArea>
        <CardContent>
          <h2
            color='textSecondary'
            gutterBottom
            style={{ color: color }}
            className='infoBox__title'
          >
            {title}
          </h2>
          <h2 className='infoBox__cases' style={{ color: color }}>
            {cases}
          </h2>

          <Typography className='infoBox__total' color='textSecondary'>
            {total} Total
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default InfoBox;
