import React from 'react';
import PropTypes from 'prop-types';

import './index.css';

const Button = ({ text, onClick = null }) => (<button type="button" className="button" onClick={onClick}>{text}</button>);


Button.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

Button.defaultProps = {
  onClick: null,
};

export default Button;
