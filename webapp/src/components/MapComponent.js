import React from 'react';
import { Map, TileLayer, Marker } from 'react-leaflet';
import PropTypes from 'prop-types';

const MapComponent = ({ objects }) => (
  <div style={{ display: 'flex', justifyContent: 'center' }}>
    <Map style={{ height: '600px', width: '700px', position: 'relative' }} center={[63.42, 10.39]} zoom={12}>
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {objects.map((object) => (
        <Marker key={object._id} position={object.coordinates} />))}
    </Map>
  </div>
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
};

MapComponent.defaultProps = {
  objects: [],
};

export default MapComponent;
