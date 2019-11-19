import React from 'react';
import { Map, TileLayer, Marker } from 'react-leaflet';
import PropTypes from 'prop-types';
import findCorrectMarker from '../../utils/markers';

import './MapComponent.css';

const MapComponent = ({ objects, onMarkerClick, workOrders }) => (
  <Map className="map" center={[63.42, 10.39]} zoom={12}>
    <TileLayer
      attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    {objects.map((object) => (
      <Marker
        key={object._id}
        position={object.coordinates}
        icon={findCorrectMarker(object, workOrders)}
        onClick={() => {
          onMarkerClick(object._id);
        }}
      />
    ))}
  </Map>
);

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
  workOrders: PropTypes.arrayOf(PropTypes.object),
};

MapComponent.defaultProps = {
  objects: [],
  onMarkerClick: null,
  workOrders: [],
};

export default MapComponent;
