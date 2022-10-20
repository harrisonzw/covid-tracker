import React, { useState, useEffect } from 'react';
import { Map as LeafletMap, TileLayer } from 'react-leaflet';
import './Map.css';
import { showDataOnMap } from './helper';
import { useMediaQuery } from '@material-ui/core';

export default function Map({ countries, casesType }) {
  const isMobile = useMediaQuery('(max-width:600px)');
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });

  useEffect(() => {
    if (isMobile) {
      setMapCenter({ lat: 39, lng: -98 });
    }
  }, [isMobile]);

  return (
    <div className='map'>
      <LeafletMap center={mapCenter} zoom={2.5}>
        <TileLayer
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {showDataOnMap(countries, casesType)}
      </LeafletMap>
      <h5 className='tip'> Click on each circle to view country details </h5>
    </div>
  );
}
