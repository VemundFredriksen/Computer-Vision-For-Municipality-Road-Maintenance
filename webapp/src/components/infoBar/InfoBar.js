import React from 'react';
import PropTypes from 'prop-types';

import './InfoBar.css';

const InfoBar = ({ type, status, priority }) => (
  <div className="info_bar__wrapper">
    <span>
      Type:
      {type}
    </span>
    <span>
      Status:
      {status}
    </span>
    <span>
      Priority:
      {priority}
    </span>
  </div>
);

InfoBar.propTypes = {
  type: PropTypes.string,
  status: PropTypes.string,
  priority: PropTypes.number,
};

InfoBar.defaultProps = {
  type: '',
  status: '',
  priority: 0,
};

export default InfoBar;
