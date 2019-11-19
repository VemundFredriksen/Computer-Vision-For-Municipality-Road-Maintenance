import React from 'react';
import PropTypes from 'prop-types';

import './MarkerColors.css';

const MarkerColors = () => (
  <div className="marker_colors__container">
    <MarkerColor color="red" text="Object has not yet been approved" />
    <MarkerColor color="yellow" text="Object is in work orders" />
    <MarkerColor color="green" text="Object is in work order list" />
    <MarkerColor color="grey" text="Statens vegvesen is responsible" />
    <MarkerColor color="blue" text="Other objects" />
  </div>
);

const MarkerColor = ({ color, text }) => (
  <div className="marker_color__wrapper">
    <div style={{ backgroundColor: color }} className="color_circle" />
    <span>{text}</span>
  </div>
);

MarkerColor.propTypes = {
  color: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

export default MarkerColors;
