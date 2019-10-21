import React from 'react';
import PropTypes from 'prop-types';

import './InfoBar.css';

const InfoBar = (
  {
    type,
    status,
    priority,
    imagePath,
    onCloseClick,
  },
) => (
  <div className="info_bar__wrapper">
    <span className="close_icon__container">
      <button type="button" className="close_button" onClick={onCloseClick}>
        <CloseIcon />
      </button>
    </span>
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
  onCloseClick: PropTypes.func,
};

InfoBar.defaultProps = {
  type: 'Missing',
  status: 'Missing',
  priority: 0,
  imagePath: '',
  onCloseClick: null,
};

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 10.5858l6.2929-6.29289 1.4142 1.41421L13.4142 12l6.2929 6.2929-1.4142
      1.4142L12 13.4142l-6.29288 6.2929-1.41421-1.4142L10.5858 12 4.29291 5.70712l1.41421-1.41421L12
      10.5858z"
    />
  </svg>
);

export default InfoBar;
