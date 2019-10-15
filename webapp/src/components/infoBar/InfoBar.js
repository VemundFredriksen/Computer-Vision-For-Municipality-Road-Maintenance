import React from 'react';
import PropTypes from 'prop-types';

import './InfoBar.css';

const InfoBar = (
  {
    type,
    status,
    priority,
    imagePath,
  },
) => (
  <div className="info_bar__wrapper">
    <div className="image__container">
      <img src={imagePath} alt="detected road object" className="object_image" />
    </div>
    <div className="info__container">
      <span className="object_info">
        {`Type: ${type}`}
      </span>
      <span className="object_info">
        {`Status: ${status}`}
      </span>
      <span className="object_info">
        {`Priority: ${priority}`}
      </span>
    </div>
  </div>
);

InfoBar.propTypes = {
  type: PropTypes.string,
  status: PropTypes.string,
  priority: PropTypes.number,
  imagePath: PropTypes.string,
};

InfoBar.defaultProps = {
  type: '',
  status: '',
  priority: 0,
  imagePath: '',
};

export default InfoBar;
