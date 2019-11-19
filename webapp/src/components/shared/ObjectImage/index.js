import React from 'react';
import PropTypes from 'prop-types';

import './index.css';

const ObjectImage = (
  {
    id,
    src,
    crossOrigin,
    drawBox,
    onClick,
  },
) => (
  <button type="button" className="button_image" onClick={onClick}>
    <img
      id={id}
      crossOrigin={crossOrigin}
      onLoad={drawBox}
      src={src}
      alt="detected road object"
      className="object_image"
    />
  </button>
);

ObjectImage.propTypes = {
  id: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  crossOrigin: PropTypes.string,
  drawBox: PropTypes.func,
  onClick: PropTypes.func,
};
ObjectImage.defaultProps = {
  crossOrigin: null,
  drawBox: null,
  onClick: null,
};

export default ObjectImage;
