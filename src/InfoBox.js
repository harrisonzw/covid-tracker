import React from 'react';
import { Card, CardContent, Typography, Button } from '@material-ui/core';
import './InfoBox.css';

function InfoBox({ title, color, cases, total, active, ...props }) {
  const getColor = () => {
    if (title === 'Cases') return { borderColor: 'rgba(204,16,52, 0.5)' };
    else if (title === 'Recovered') return { borderColor: '#2E8B57' };
    else return { borderColor: 'rgb(105,105,105)' };
  };

  return (
    <Button className={`infoBox`} onClick={props.onClick}>
      <Card
        className={`infoBox ${active && 'infoBox--selected'} }`}
        style={getColor()}
      >
        <CardContent>
          <h3
            color='textSecondary'
            style={{ color: color }}
            className='infoBox__title'
          >
            {title}
          </h3>
          <h2 className='infoBox__cases' style={{ color: color }}>
            {'+' + cases}
          </h2>
          <Typography className='infoBox__total' color='textSecondary'>
            {total} Total
          </Typography>
        </CardContent>
      </Card>
    </Button>
  );
}

export default InfoBox;
