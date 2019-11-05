import React from 'react';
import { Map, TileLayer, Marker } from 'react-leaflet';
import PropTypes from 'prop-types';

import './MapComponent.css';

const redIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const blueIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});


const MapComponent = ({ objects, onMarkerClick }) => {
  return (
    <Map className="map" center={[63.42, 10.39]} zoom={12}>
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {objects.map((object) => (
        <Marker
          key={object._id}
          position={object.coordinates}
          icon={object.approved ? blueIcon : redIcon}
          onClick={() => {
            onMarkerClick(object._id);
          }}
        />
      ))}
    </Map>
  );
};

MapComponent.propTypes = {
  objects: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      coordinates: PropTypes.array,
      type: PropTypes.string,
      priority: PropTypes.number,
      __v: PropTypes.number,
    }),
  ),
  onMarkerClick: PropTypes.func,
};

MapComponent.defaultProps = {
  objects: [],
  onMarkerClick: null,
};

export default MapComponent;
