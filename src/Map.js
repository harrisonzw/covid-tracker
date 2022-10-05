import React from 'react';
import { Map as LeafletMap, TileLayer } from 'react-leaflet';
import './Map.css';
import { showDataOnMap } from './helper';
import { useMediaQuery } from '@material-ui/core';

export default function Map({ countries, casesType, center, zoom }) {
  const isMobile = useMediaQuery('(max-width:600px)');
  return (
    <div className='map'>
      <LeafletMap
        center={isMobile ? { lat: 39, lng: -98 } : center}
        zoom={zoom}
      >
        <TileLayer
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {showDataOnMap(countries, casesType)}
      </LeafletMap>
      <h5> Click on each circle to view country details </h5>
    </div>
  );
}
