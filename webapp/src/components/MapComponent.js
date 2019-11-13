import React from 'react';
import { Map, TileLayer, Marker } from 'react-leaflet';
import { Icon } from 'leaflet';
import PropTypes from 'prop-types';
import isSubset from 'is-subset';

import './MapComponent.css';

const redIcon = new Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const blueIcon = new Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const greenIcon = new Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const yellowIcon = new Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function findCorrectMarker(object, workOrders) {
  const obj = workOrders.filter((item) => isSubset(object, item));
  if (obj.length !== 0) {
    return greenIcon;
  }
  if (object.work_order) {
    return yellowIcon;
  }
  if (object.approved) {
    return blueIcon;
  }
  return redIcon;
}


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
